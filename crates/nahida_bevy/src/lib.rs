use bevy::prelude::*;

pub struct NahidaPlugin;

impl Plugin for NahidaPlugin {
  fn build(&self, app: &mut App) {
    app
      .add_startup_system(setup_camera)
      .insert_resource(ClearColor(Color::BLACK));
  }
}

fn setup_camera(mut command: Commands) {
  command.spawn(Camera2dBundle::default());
}
