use bevy::prelude::*;

pub mod menu;

use menu::MenuMaterialPlugin;

pub struct NahidaMaterialPlugin;

impl Plugin for NahidaMaterialPlugin {
  fn build(&self, app: &mut App) {
    app.add_plugin(MenuMaterialPlugin);
  }
}
