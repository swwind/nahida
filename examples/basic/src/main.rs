use bevy::prelude::*;
use nahida_bevy::NahidaPlugin;

fn main() {
  env_logger::init();

  App::new()
    .add_plugins(DefaultPlugins)
    .add_plugin(NahidaPlugin)
    .run();
}
