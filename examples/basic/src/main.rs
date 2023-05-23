use bevy::prelude::*;
use bevy_inspector_egui::quick::WorldInspectorPlugin;
use nahida_bevy::{NahidaEntryPoint, NahidaPlugin};

fn main() {
  App::new()
    .insert_resource(NahidaEntryPoint("story.md".to_string()))
    .add_plugin(NahidaPlugin)
    .add_plugin(WorldInspectorPlugin::new())
    .run();
}
