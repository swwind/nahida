use bevy::prelude::*;
use nahida_bevy::{NahidaEntryPoint, NahidaPlugin};

fn main() {
  App::new()
    .insert_resource(NahidaEntryPoint("story.md".to_string()))
    .add_plugin(NahidaPlugin)
    .run();
}
