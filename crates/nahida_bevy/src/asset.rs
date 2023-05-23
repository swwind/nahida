use bevy::prelude::*;

use self::story::StoryAssetPlugin;

pub mod story;

pub struct NahidaAssetPlugin;

impl Plugin for NahidaAssetPlugin {
  fn build(&self, app: &mut App) {
    app.add_plugin(StoryAssetPlugin);
  }
}
