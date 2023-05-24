use bevy::{prelude::*, sprite::MaterialMesh2dBundle};
use nahida_core::{Position, Size};

use crate::{
  material::menu::background::MenuBackgroundMaterial, Location, OriginalImage, WindowSize,
};

use super::{loading::NahidaFonts, NahidaState};

pub struct MenuPlugin;

impl Plugin for MenuPlugin {
  fn build(&self, app: &mut App) {
    app.add_system(setup_menu.in_schedule(OnEnter(NahidaState::Menu)));
  }
}

#[derive(Component)]
pub struct MenuComponent;

fn setup_menu(
  mut command: Commands,
  fonts: Res<NahidaFonts>,
  mut color: ResMut<ClearColor>,
  mut meshes: ResMut<Assets<Mesh>>,
  mut material: ResMut<Assets<MenuBackgroundMaterial>>,
  asset_server: Res<AssetServer>,
  window_size: Res<WindowSize>,
) {
  color.0 = Color::ALICE_BLUE;

  command.spawn(
    TextBundle::from_section(
      "This is menu",
      TextStyle {
        font: fonts.hanyi.clone(),
        font_size: 24.0,
        color: Color::BLACK,
      },
    )
    .with_style(Style {
      position_type: PositionType::Absolute,
      position: UiRect {
        left: Val::Px(20.0),
        top: Val::Px(20.0),
        ..Default::default()
      },
      ..Default::default()
    }),
  );

  println!("window: {window_size:?}");

  let tree = asset_server.load("tree.png");

  command.spawn((
    OriginalImage(tree.clone()),
    MaterialMesh2dBundle {
      mesh: meshes.add(Mesh::from(shape::Cube::new(-1.0))).into(),
      material: material.add(MenuBackgroundMaterial {
        time: 0.0,
        texture: Some(tree),
      }),
      ..Default::default()
    },
    Location::new(Position(0.5, 0.5), Size::Contain, 0.0),
  ));
}
