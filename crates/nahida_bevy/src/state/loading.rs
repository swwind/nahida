use bevy::{prelude::*, utils::HashMap};
use nahida_core::story::StoryAction;

use crate::{asset::story::StoryAsset, NahidaEntryPoint};

use super::NahidaState;

pub struct LoadingPlugin;

impl Plugin for LoadingPlugin {
  fn build(&self, app: &mut App) {
    app
      .init_resource::<LoadingText>()
      .init_resource::<NahidaFonts>()
      .init_resource::<NahidaLoadingQueue>()
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
    Text2dBundle {
      text: Text::from_section(
        "",
        TextStyle {
          font: fonts.hanyi.clone(),
          font_size: 32.0,
          color: Color::WHITE,
        },
      ),
      ..Default::default()
    },
    LoadingComponent,
  ));
}

fn destroy_loading_text(mut command: Commands, query: Query<Entity, With<LoadingComponent>>) {
  for entity in query.iter() {
    command.entity(entity).despawn_recursive();
  }
}

#[derive(Resource)]
pub struct LoadingText {
  pub text: String,
}

impl Default for LoadingText {
  fn default() -> Self {
    Self {
      text: String::from("Loading..."),
    }
  }
}

fn sync_loading_text(
  loading_text: Res<LoadingText>,
  mut query: Query<&mut Text, With<LoadingComponent>>,
) {
  for mut text in query.iter_mut() {
    text.sections[0].value = loading_text.text.clone();
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
pub struct NahidaLoadingQueue {
  story: HashMap<String, Handle<StoryAsset>>,
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
  mut loading_queue: ResMut<NahidaLoadingQueue>,
  asset_server: Res<AssetServer>,
) {
  let story = asset_server.load(&entry_point.0);
  info!("Loading: {}", entry_point.0);
  loading_queue.story.insert(entry_point.0.clone(), story);
}

fn load_resource_recursive(
  mut loading_queue: ResMut<NahidaLoadingQueue>,
  mut loaded_resource: ResMut<NahidaResources>,
  asset: Res<Assets<StoryAsset>>,
  asset_server: Res<AssetServer>,
) {
  let mut removal = Vec::new();
  let mut insert = Vec::new();

  for (path, handle) in loading_queue.story.iter() {
    if let Some(story) = asset.get(handle) {
      removal.push(path.clone());
      info!("Loaded: {path}");

      for step in &story.story.steps {
        for action in &step.actions {
          match action {
            StoryAction::Bg { url, .. } | StoryAction::Fig { url, .. } => {
              info!("Loading Image: {}", url);
              let image = asset_server.load(url);
              loaded_resource.image.insert(url.clone(), image);
            }
            StoryAction::Bgm { url } | StoryAction::Sfx { url } => {
              info!("Loading Audio: {}", url);
              let audio = asset_server.load(url);
              loaded_resource.audio.insert(url.clone(), audio);
            }
            StoryAction::Navigate { url, .. } => {
              let story = asset_server.load(url);
              insert.push((url.clone(), story));
            }
            _ => {}
          }
        }
      }
    }
  }

  for key in removal {
    if let Some(handle) = loading_queue.story.remove(&key) {
      loaded_resource.story.insert(key, handle);
    }
  }

  for (key, value) in insert {
    loading_queue.story.insert(key, value);
  }
}
