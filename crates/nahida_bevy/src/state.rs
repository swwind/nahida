use bevy::prelude::*;

use self::{loading::LoadingPlugin, menu::MenuPlugin};

pub mod loading;
pub mod menu;

#[derive(States, Default, Debug, Hash, Clone, PartialEq, Eq)]
pub enum NahidaState {
  #[default]
  Loading,
  Menu,
}

pub struct NahidaStatePlugin;

impl Plugin for NahidaStatePlugin {
  fn build(&self, app: &mut App) {
    app
      .add_state::<NahidaState>()
      .add_plugin(LoadingPlugin)
      .add_plugin(MenuPlugin);
  }
}
