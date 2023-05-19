#[derive(Debug, Clone, Default)]
pub struct Position {
  pub x: PositionX,
  pub y: PositionY,
}

#[derive(Debug, Clone, Default)]
pub enum PositionX {
  Left,
  #[default]
  Center,
  Right,
  Percent(f32),
}

#[derive(Debug, Clone, Default)]
pub enum PositionY {
  Top,
  #[default]
  Center,
  Bottom,
  Percent(f32),
}

#[derive(Debug, Clone)]
pub enum Size {
  Cover,
  Contain,
  Fill,
  Xy { x: SizeX, y: SizeY },
}

impl Default for Size {
  fn default() -> Self {
    Self::Xy {
      x: Default::default(),
      y: Default::default(),
    }
  }
}

#[derive(Debug, Clone, Default)]
pub enum SizeX {
  #[default]
  Auto,
  Percent(f32),
}

#[derive(Debug, Clone, Default)]
pub enum SizeY {
  #[default]
  Auto,
  Percent(f32),
}

#[derive(Debug, Clone, Default)]
pub struct Location {
  pub position: Position,
  pub size: Size,
}

#[derive(Debug, Clone)]
pub struct Rect {
  pub left: f32,
  pub top: f32,
  pub right: f32,
  pub bottom: f32,
}

impl Location {
  /// note: aspect should be scaled to make window aspect to 1.0
  ///
  /// e.g. aspect = (image_width / window_width) / (image_height / window_height)
  pub fn rect(&self, aspect: f32) -> Rect {
    let one = 1.0f32;
    let (width, height) = match &self.size {
      Size::Cover => (one.max(1.0 * aspect), one.max(1.0 / aspect)),
      Size::Contain => (one.min(1.0 * aspect), one.min(1.0 / aspect)),
      Size::Fill => (1.0, 1.0),
      Size::Xy { x, y } => match (x, y) {
        (SizeX::Auto, SizeY::Auto) => todo!(),
        (SizeX::Auto, SizeY::Percent(py)) => (py * aspect, *py),
        (SizeX::Percent(px), SizeY::Auto) => (*px, px / aspect),
        (SizeX::Percent(px), SizeY::Percent(py)) => (*px, *py),
      },
    };

    let x = match &self.position.x {
      PositionX::Left => 0.0,
      PositionX::Center => 0.5,
      PositionX::Right => 1.0,
      PositionX::Percent(x) => *x,
    };

    let y = match &self.position.y {
      PositionY::Top => 0.0,
      PositionY::Center => 0.5,
      PositionY::Bottom => 1.0,
      PositionY::Percent(y) => *y,
    };

    let left = (1.0 - width) * x;
    let right = left + width;
    let top = (1.0 - height) * y;
    let bottom = top + height;

    Rect {
      left,
      top,
      right,
      bottom,
    }
  }
}
