#[derive(Debug, Clone, PartialEq, Default)]
pub struct Position(pub f32, pub f32);

#[derive(Debug, Clone, PartialEq, Default)]
pub enum Size {
  Cover,
  #[default]
  Contain,
  FixedWidth(f32),
  FixedHeight(f32),
  Fixed(f32, f32),
}

#[derive(Debug, Clone, Default, PartialEq)]
pub struct Location {
  pub position: Position,
  pub size: Size,
}
