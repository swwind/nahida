use bevy::prelude::*;

use super::{loading::NahidaFonts, NahidaState};

pub struct MenuPlugin;

impl Plugin for MenuPlugin {
  fn build(&self, app: &mut App) {
    app.add_system(setup_menu.in_schedule(OnEnter(NahidaState::Menu)));
  }
}

#[derive(Component)]
pub struct MenuComponent;

fn setup_menu(mut command: Commands, fonts: Res<NahidaFonts>, mut color: ResMut<ClearColor>) {
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
}
