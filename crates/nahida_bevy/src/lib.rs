use bevy::{prelude::*, window::WindowResized};

pub use url::Url;

#[derive(Resource)]
pub struct NahidaEntryPoint(pub Url);

pub struct NahidaPlugin;

impl Plugin for NahidaPlugin {
  fn build(&self, app: &mut App) {
    app
      .add_plugins(DefaultPlugins)
      .insert_resource(ClearColor(Color::BLACK))
      .insert_resource(WindowSize(0.0, 0.0))
      .add_startup_system(setup_camera)
      .add_startup_system(debug_spawn_background)
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
  /// - center is (0, 0)
  /// - left from `-window_size.0 / 2.0` to right `window_size.0 / 2.0`
  /// - top from `window_size.1 / 2.0` to bottom `-window_size.1 / 2.0`
  pub fn compute_transform(&self, window_size: (f32, f32), image_size: (f32, f32)) -> Transform {
    use nahida_core::Size;

    let image_aspect = image_size.0 / image_size.1;

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
    let scale = Vec3::new(
      computed_size.0 / image_size.0,
      computed_size.1 / image_size.1,
      1.0,
    );

    Transform::from_translation(translation).with_scale(scale)
  }
}

fn debug_spawn_background(mut command: Commands, asset_server: Res<AssetServer>) {
  command.spawn((
    Location {
      location: nahida_core::Location {
        position: nahida_core::Position(0.5, 0.5),
        size: nahida_core::Size::FixedWidth(0.5),
      },
      ..Default::default()
    },
    SpriteBundle {
      texture: asset_server.load("tree.png"),
      transform: Transform::from_xyz(0.0, 0.0, 0.0).with_scale(Vec3::splat(0.5)),
      ..Default::default()
    },
  ));
}

fn sync_transform_with_location(
  mut query: Query<(&Handle<Image>, &Location, &mut Transform)>,
  assets: Res<Assets<Image>>,
  window_size: Res<WindowSize>,
) {
  for (texture, location, mut transform) in query.iter_mut() {
    if let Some(image) = assets.get(texture) {
      let window_size = (window_size.0, window_size.1);
      let image_size = image.size();
      let image_size = (image_size.x, image_size.y);

      *transform = location.compute_transform(window_size, image_size);
    }
  }
}

#[derive(Resource)]
pub struct WindowSize(pub f32, pub f32);

fn sync_window_size(mut events: EventReader<WindowResized>, mut window_size: ResMut<WindowSize>) {
  for e in events.iter() {
    window_size.0 = e.width;
    window_size.1 = e.height;
  }
}
