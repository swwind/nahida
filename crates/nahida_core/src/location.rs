#[derive(Debug, Clone, PartialEq, Default)]
pub struct Position(pub f32, pub f32);

#[derive(Debug, Clone, PartialEq, Default)]
pub enum Size {
  Cover,
  #[default]
  Contain,
  Fill,
  FixedWidth(f32),
  FixedHeight(f32),
  Fixed(f32, f32),
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
      Size::FixedWidth(w) => (*w, w / aspect),
      Size::FixedHeight(h) => (h * aspect, *h),
      Size::Fixed(w, h) => (*w, *h),
    };

    let left = (1.0 - width) * self.position.0;
    let right = left + width;
    let top = (1.0 - height) * self.position.1;
    let bottom = top + height;

    Rect {
      left,
      top,
      right,
      bottom,
    }
  }
}
