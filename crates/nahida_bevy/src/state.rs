use bevy::prelude::*;

use self::loading::LoadingPlugin;

pub mod loading;

#[derive(States, Default, Debug, Hash, Clone, PartialEq, Eq)]
pub enum NahidaState {
  #[default]
  Loading,
}

pub struct NahidaStatePlugin;

impl Plugin for NahidaStatePlugin {
  fn build(&self, app: &mut App) {
    app.add_state::<NahidaState>().add_plugin(LoadingPlugin);
  }
}
