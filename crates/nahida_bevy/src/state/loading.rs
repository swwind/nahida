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
  queue: HashMap<String, Handle<StoryAsset>>,
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
  asset_server: Res<AssetServer>,
) {
  let story = asset_server.load(&entry_point.0);
  let log = format!("Loading: {}", entry_point.0);
  info!(log);
  loading_state.logs.push(log);
  loading_state.queue.insert(entry_point.0.clone(), story);
}

fn load_resource_recursive(
  mut loading_state: ResMut<NahidaLoadingState>,
  mut loaded_resource: ResMut<NahidaResources>,
  asset: Res<Assets<StoryAsset>>,
  asset_server: Res<AssetServer>,
) {
  let mut removes = Vec::new();
  let mut inserts = Vec::new();
  let mut logs = Vec::new();

  for (path, handle) in loading_state.queue.iter() {
    // check if loaded
    if let Some(story) = asset.get(handle) {
      removes.push(path.clone());

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
              inserts.push((url.clone(), story));
            }
            _ => {}
          }
        }
      }
    }
  }

  for key in removes {
    if let Some(handle) = loading_state.queue.remove(&key) {
      loaded_resource.story.insert(key, handle);
    }
  }
  for (key, value) in inserts {
    loading_state.queue.insert(key, value);
  }
  for log in logs {
    info!(log);
    loading_state.logs.push(log);
  }
}
