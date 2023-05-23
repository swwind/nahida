use std::collections::HashMap;

use bevy::prelude::*;
use nahida_core::story::StoryAction;

use crate::{asset::story::StoryAsset, NahidaEntryPoint};

use super::NahidaState;

pub struct LoadingPlugin;

impl Plugin for LoadingPlugin {
  fn build(&self, app: &mut App) {
    app
      .init_resource::<NahidaFonts>()
      .init_resource::<NahidaLoadingState>()
      .init_resource::<NahidaResources>()
      .add_systems(
        (sync_loading_text, load_resource_recursive).in_set(OnUpdate(NahidaState::Loading)),
      )
      .add_systems(
        (
          setup_loading_text,
          setup_load_fonts,
          move_entry_point_to_loading_queue,
        )
          .in_schedule(OnEnter(NahidaState::Loading)),
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
  queue: Vec<String>,
}

/// All resources parsed from entry point
#[derive(Resource, Default)]
pub struct NahidaResources {
  story: HashMap<String, Handle<StoryAsset>>,
  image: HashMap<String, Handle<Image>>,
  audio: HashMap<String, Handle<AudioSource>>,
}

fn move_entry_point_to_loading_queue(
  entry_point: Res<NahidaEntryPoint>,
  mut loading_state: ResMut<NahidaLoadingState>,
  mut loaded_resource: ResMut<NahidaResources>,
  asset_server: Res<AssetServer>,
) {
  let url = &entry_point.0;
  loading_state.logs.push(format!("Loading: {}", url));
  let story = asset_server.load(url);
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

  loading_state.queue.retain(|path| {
    let handle = loaded_resource.story.get(path);
    let asset = handle.and_then(|x| asset_story.get(x));

    // check if loaded

    if let Some(story) = asset {
      // find assets recursive
      for step in &story.story.steps {
        for action in &step.actions {
          match action {
            StoryAction::Bg { url, .. } | StoryAction::Fig { url, .. } => {
              logs.push(format!("Loading Image: {}", url));
              let image = asset_server.load(url);
              loaded_resource.image.insert(url.clone(), image);
            }
            StoryAction::Bgm { url } | StoryAction::Sfx { url } => {
              logs.push(format!("Loading Audio: {}", url));
              let audio = asset_server.load(url);
              loaded_resource.audio.insert(url.clone(), audio);
            }
            StoryAction::Navigate { url, .. } => {
              logs.push(format!("Loading: {}", url));
              let story = asset_server.load(url);
              loaded_resource.story.insert(url.clone(), story);
              inserts.push(url.clone());
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
