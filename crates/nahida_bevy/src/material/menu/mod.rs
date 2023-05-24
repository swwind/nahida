use bevy::prelude::*;

pub mod background;

use background::MenuBackgroundMaterialPlugin;

pub struct MenuMaterialPlugin;

impl Plugin for MenuMaterialPlugin {
  fn build(&self, app: &mut App) {
    app.add_plugin(MenuBackgroundMaterialPlugin);
  }
}
