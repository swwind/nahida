use bevy::{
  prelude::*,
  reflect::TypeUuid,
  render::render_resource::{AsBindGroup, ShaderRef},
  sprite::{Material2d, Material2dPlugin},
};

pub struct MenuBackgroundMaterialPlugin;

impl Plugin for MenuBackgroundMaterialPlugin {
  fn build(&self, app: &mut App) {
    app
      .add_plugin(Material2dPlugin::<MenuBackgroundMaterial>::default())
      .add_system(menu_background_matering_timing);
  }
}

#[derive(AsBindGroup, TypeUuid, Debug, Clone)]
#[uuid = "a3d71c04-d054-4946-80f8-ba6cfbc90cad"]
pub struct MenuBackgroundMaterial {
  #[uniform(0)]
  pub time: f32,
  #[texture(1)]
  #[sampler(2)]
  pub texture: Option<Handle<Image>>,
}

impl Material2d for MenuBackgroundMaterial {
  fn fragment_shader() -> ShaderRef {
    "shader/background.wgsl".into()
  }
}

fn menu_background_matering_timing(
  query: Query<&Handle<MenuBackgroundMaterial>>,
  mut materials: ResMut<Assets<MenuBackgroundMaterial>>,
  time: Res<Time>,
) {
  for handle in query.iter() {
    if let Some(material) = materials.get_mut(handle) {
      material.time += time.delta_seconds();
    }
  }
}
