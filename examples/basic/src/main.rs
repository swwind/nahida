use bevy::prelude::*;
use nahida_bevy::{NahidaEntryPoint, NahidaPlugin, Url};

fn main() {
  env_logger::init();

  let entrance = Url::parse("file:///home/swwind/Repositories/nahida/assets/story.md").unwrap();

  App::new()
    .insert_resource(NahidaEntryPoint(entrance))
    .add_plugin(NahidaPlugin)
    .run();
}
