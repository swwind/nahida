use std::{collections::HashMap, path::PathBuf};

use bevy::prelude::*;
use nahida_core::story::StoryAction;

use crate::{asset::story::StoryAsset, NahidaEntryPoint};

use super::NahidaState;

fn join_absolute_path(src: &PathBuf, dst: &PathBuf) -> Option<PathBuf> {
  let mut parent = src.parent();
  let mut dst = dst.as_path();

  loop {
    match () {
      _ if dst.starts_with("./") => {
        dst = dst.strip_prefix("./").unwrap();
      }
      _ if dst.starts_with("../") => {
        dst = dst.strip_prefix("../").unwrap();
        parent = parent.and_then(|p| p.parent());
      }
      _ => break,
    }
  }

  parent.and_then(|p| Some(p.join(dst)))
}

#[test]
fn test_join_absolute_path() {
  use std::path::PathBuf;

  let a = PathBuf::from("index.md");
  let b = PathBuf::from("story/chapter1/scene1.md");
  let c = PathBuf::from("./bad_end.md");
  let d = PathBuf::from("../../happy_end.md");

  assert_eq!(
    join_absolute_path(&a, &b),
    Some(PathBuf::from("story/chapter1/scene1.md"))
  );
  assert_eq!(
    join_absolute_path(&a, &c),
    Some(PathBuf::from("bad_end.md"))
  );
  assert_eq!(join_absolute_path(&a, &d), None);
  assert_eq!(
    join_absolute_path(&b, &a),
    Some(PathBuf::from("story/chapter1/index.md"))
  );
  assert_eq!(
    join_absolute_path(&b, &c),
    Some(PathBuf::from("story/chapter1/bad_end.md"))
  );
  assert_eq!(
    join_absolute_path(&b, &d),
    Some(PathBuf::from("happy_end.md"))
  );
}

pub struct LoadingPlugin;

impl Plugin for LoadingPlugin {
  fn build(&self, app: &mut App) {
    app
      .init_resource::<NahidaFonts>()
      .init_resource::<NahidaLoadingState>()
      .init_resource::<NahidaResources>()
      .add_systems(
        (setup_loading_text, setup_load_fonts, load_entry_point)
          .in_schedule(OnEnter(NahidaState::Loading)),
      )
      .add_systems(
        (sync_loading_text, load_resource_recursive).in_set(OnUpdate(NahidaState::Loading)),
      )
      .add_system(destroy_loading_text.in_schedule(OnExit(NahidaState::Loading)));
  }
}

#[derive(Component)]
pub struct LoadingComponent;

fn setup_loading_text(mut command: Commands, fonts: Res<NahidaFonts>) {
  command.spawn((
    TextBundle::from_section(
      "Loading...",
      TextStyle {
        font: fonts.hanyi.clone(),
        font_size: 24.0,
        color: Color::WHITE,
      },
    )
    .with_style(Style {
      position_type: PositionType::Absolute,
      position: UiRect {
        left: Val::Px(20.0),
        bottom: Val::Px(20.0),
        ..Default::default()
      },
      ..Default::default()
    }),
    LoadingComponent,
  ));
}

fn destroy_loading_text(mut command: Commands, query: Query<Entity, With<LoadingComponent>>) {
  for entity in query.iter() {
    command.entity(entity).despawn_recursive();
  }
}

fn sync_loading_text(
  loading_state: Res<NahidaLoadingState>,
  mut query: Query<&mut Text, With<LoadingComponent>>,
) {
  for mut text in query.iter_mut() {
    text.sections[0].value = loading_state.logs.join("\n");
  }
}

#[derive(Resource, Default)]
pub struct NahidaFonts {
  hanyi: Handle<Font>,
}

fn setup_load_fonts(mut fonts: ResMut<NahidaFonts>, asset_server: Res<AssetServer>) {
  fonts.hanyi = asset_server.load("hanyi.ttf");
}

/// Loading queue
#[derive(Resource, Default)]
pub struct NahidaLoadingState {
  logs: Vec<String>,
  queue: Vec<PathBuf>,
}

/// All resources parsed from entry point
#[derive(Resource, Default)]
pub struct NahidaResources {
  story: HashMap<PathBuf, Handle<StoryAsset>>,
  image: HashMap<PathBuf, Handle<Image>>,
  audio: HashMap<PathBuf, Handle<AudioSource>>,
}

fn load_entry_point(
  entry_point: Res<NahidaEntryPoint>,
  mut loading_state: ResMut<NahidaLoadingState>,
  mut loaded_resource: ResMut<NahidaResources>,
  asset_server: Res<AssetServer>,
) {
  let url = PathBuf::from(&entry_point.0);
  loading_state.logs.push(format!("Loading: {:?}", url));
  let story = asset_server.load(url.clone());
  loaded_resource.story.insert(url.clone(), story);
  loading_state.queue.push(url.clone());
}

fn load_resource_recursive(
  mut loading_state: ResMut<NahidaLoadingState>,
  mut loaded_resource: ResMut<NahidaResources>,
  asset_story: Res<Assets<StoryAsset>>,
  asset_server: Res<AssetServer>,
) {
  let mut inserts = Vec::new();
  let mut logs = Vec::new();

  loading_state.queue.retain(|src| {
    let handle = loaded_resource.story.get(src);
    let asset = handle.and_then(|x| asset_story.get(x));

    // check if loaded

    if let Some(story) = asset {
      // find assets recursive
      for step in &story.story.steps {
        for action in &step.actions {
          match action {
            StoryAction::Bg { url, .. } | StoryAction::Fig { url, .. } => {
              let url = join_absolute_path(src, url);
              match url {
                Some(url) if !loaded_resource.image.contains_key(&url) => {
                  logs.push(format!("Loading Image: {url:?}"));
                  info!("Loading Image: {url:?}");
                  let image = asset_server.load(url.clone());
                  loaded_resource.image.insert(url, image);
                }
                Some(_) => {
                  // already loaded, skipping
                }
                None => {
                  logs.push(format!("Error: Image Not found: {url:?}"));
                  error!("Image Not Found: {url:?}");
                }
              }
            }
            StoryAction::Bgm { url } | StoryAction::Sfx { url } => {
              let url = join_absolute_path(src, url);
              match url {
                Some(url) if !loaded_resource.audio.contains_key(&url) => {
                  logs.push(format!("Loading Audio: {url:?}"));
                  info!("Loading Audio: {url:?}");
                  let audio = asset_server.load(url.clone());
                  loaded_resource.audio.insert(url, audio);
                }
                Some(_) => {
                  // already loaded, skipping
                }
                None => {
                  logs.push(format!("Error: Audio Not found: {url:?}"));
                  error!("Audio Not Found: {url:?}");
                }
              }
            }
            StoryAction::Navigate { url, .. } => {
              let url = join_absolute_path(src, url);
              match url {
                Some(url) if !loaded_resource.story.contains_key(&url) => {
                  logs.push(format!("Loading: {url:?}"));
                  info!("Loading: {url:?}");
                  let story = asset_server.load(url.clone());
                  inserts.push(url.clone());
                  loaded_resource.story.insert(url, story);
                }
                Some(_) => {
                  // already loaded, skipping
                }
                None => {
                  logs.push(format!("Error: Route Not found: {url:?}"));
                  error!("Route Not Found: {url:?}");
                }
              }
            }
            _ => {}
          }
        }
      }
    }

    asset.is_none()
  });

  loading_state.queue.append(&mut inserts);
  loading_state.logs.append(&mut logs);
}
