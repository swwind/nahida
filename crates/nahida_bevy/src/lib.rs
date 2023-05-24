use asset::NahidaAssetPlugin;
use bevy::{prelude::*, window::WindowResized};

use material::NahidaMaterialPlugin;
use state::NahidaStatePlugin;

mod asset;
mod material;
mod state;

#[derive(Resource)]
pub struct NahidaEntryPoint(pub String);

pub struct NahidaPlugin;

impl Plugin for NahidaPlugin {
  fn build(&self, app: &mut App) {
    app
      .add_plugins(DefaultPlugins)
      .add_plugin(NahidaStatePlugin)
      .add_plugin(NahidaAssetPlugin)
      .add_plugin(NahidaMaterialPlugin)
      .insert_resource(ClearColor(Color::BLACK))
      .insert_resource(WindowSize(0.0, 0.0))
      .add_startup_system(setup_camera)
      .add_system(sync_window_size)
      .add_system(sync_transform_with_location.after(sync_window_size));
  }
}

fn setup_camera(mut command: Commands) {
  command.spawn(Camera2dBundle::default());
}

#[derive(Component, Default, Debug, Clone)]
pub struct Location {
  location: nahida_core::Location,
  z_index: f32,
}

impl Location {
  pub fn new(position: nahida_core::Position, size: nahida_core::Size, z_index: f32) -> Self {
    Self {
      location: nahida_core::Location { position, size },
      z_index,
    }
  }
}

impl Location {
  /// - center is (0, 0)
  /// - left from `-window_size.0 / 2.0` to right `window_size.0 / 2.0`
  /// - top from `window_size.1 / 2.0` to bottom `-window_size.1 / 2.0`
  fn compute_transform(&self, window_size: (f32, f32), image_aspect: f32) -> Transform {
    use nahida_core::Size;

    let computed_size = match &self.location.size {
      Size::Cover => (
        window_size.0.max(window_size.1 * image_aspect),
        window_size.1.max(window_size.0 / image_aspect),
      ),
      Size::Contain => (
        window_size.0.min(window_size.1 * image_aspect),
        window_size.1.min(window_size.0 / image_aspect),
      ),
      Size::FixedWidth(w) => (w * window_size.0, w * window_size.0 / image_aspect),
      Size::FixedHeight(h) => (h * window_size.1 * image_aspect, h * window_size.1),
      Size::Fixed(w, h) => (w * window_size.0, h * window_size.1),
    };

    let translation = Vec3::new(
      (window_size.0 - computed_size.0) * (self.location.position.0 - 0.5),
      (window_size.1 - computed_size.1) * (0.5 - self.location.position.1),
      self.z_index,
    );
    let scale = Vec3::new(computed_size.0, computed_size.1, -1.0);

    Transform::from_translation(translation).with_scale(scale)
  }
}

#[derive(Component)]
pub struct OriginalImage(pub Handle<Image>);

fn sync_transform_with_location(
  mut query: Query<(&OriginalImage, &Location, &mut Transform)>,
  assets: Res<Assets<Image>>,
  window_size: Res<WindowSize>,
) {
  for (texture, location, mut transform) in query.iter_mut() {
    if let Some(image) = assets.get(&texture.0) {
      let window_size = (window_size.0, window_size.1);
      let image_size = image.size();
      let image_aspect = image_size.x / image_size.y;

      *transform = location.compute_transform(window_size, image_aspect);
    }
  }
}

#[derive(Resource, Default, Debug)]
pub struct WindowSize(pub f32, pub f32);

fn sync_window_size(mut events: EventReader<WindowResized>, mut window_size: ResMut<WindowSize>) {
  for e in events.iter() {
    window_size.0 = e.width;
    window_size.1 = e.height;
  }
}
