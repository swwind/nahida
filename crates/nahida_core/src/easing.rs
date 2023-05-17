#[derive(Debug)]
pub enum EasingFunction {
  Linear,

  StepStart,
  StepEnd,

  CubicBezier(CubicBezier),
}

impl EasingFunction {
  pub fn linear() -> Self {
    Self::Linear
  }

  pub fn step_start() -> Self {
    Self::StepStart
  }

  pub fn step_end() -> Self {
    Self::StepEnd
  }

  pub fn ease() -> Self {
    Self::cubic_bezier(0.25, 0.1, 0.25, 1.0)
  }

  pub fn ease_in() -> Self {
    Self::cubic_bezier(0.42, 0.0, 1.0, 1.0)
  }

  pub fn ease_out() -> Self {
    Self::cubic_bezier(0.0, 0.0, 0.58, 1.0)
  }

  pub fn ease_in_out() -> Self {
    Self::cubic_bezier(0.42, 0.0, 0.58, 1.0)
  }

  pub fn cubic_bezier(x1: f32, y1: f32, x2: f32, y2: f32) -> Self {
    Self::CubicBezier(CubicBezier::new(x1, y1, x2, y2))
  }
}

impl EasingFunction {
  pub fn easing(&self, x: f32) -> f32 {
    match self {
      EasingFunction::Linear => x.clamp(0.0, 1.0),
      EasingFunction::StepStart => {
        if x > 0.0 {
          1.0
        } else {
          0.0
        }
      }
      EasingFunction::StepEnd => {
        if x < 1.0 {
          0.0
        } else {
          1.0
        }
      }
      EasingFunction::CubicBezier(cubic) => match () {
        _ if x < 0.0 => 0.0,
        _ if x > 1.0 => 1.0,
        _ => cubic.sample_y(cubic.solve_x(x)).clamp(0.0, 1.0),
      },
    }
  }
}

#[derive(Debug)]
pub struct CubicBezier {
  ax: f32,
  bx: f32,
  cx: f32,

  ay: f32,
  by: f32,
  cy: f32,
}

impl CubicBezier {
  const EPSILON: f32 = 1e-6;

  fn new(x1: f32, y1: f32, x2: f32, y2: f32) -> Self {
    let cx = 3.0 * x1;
    let bx = 3.0 * (x2 - x1) - cx; /* -6 * x1 + 3 * x2 */
    let ax = 1.0 - cx - bx; /* 1 + 3 * x1 - 3 * x2 */

    let cy = 3.0 * y1;
    let by = 3.0 * (y2 - y1) - cy; /* -6 * y1 + 3 * y2 */
    let ay = 1.0 - cy - by; /* 1 + 3 * y1 - 3 * y2 */

    Self {
      ax,
      bx,
      cx,
      ay,
      by,
      cy,
    }
  }

  /// get x (t)
  fn sample_x(&self, t: f32) -> f32 {
    ((self.ax * t + self.bx) * t + self.cx) * t
  }

  /// get y (t)
  fn sample_y(&self, t: f32) -> f32 {
    ((self.ay * t + self.by) * t + self.cy) * t
  }

  /// get dx / dt (t)
  fn sample_dx(&self, t: f32) -> f32 {
    (3.0 * self.ax * t + 2.0 * self.bx) * t + self.cx
  }

  /// get dy / dt (t)
  fn sample_dy(&self, t: f32) -> f32 {
    (3.0 * self.ay * t + 2.0 * self.by) * t + self.cy
  }

  /// get t from x
  fn solve_x(&self, x: f32) -> f32 {
    // try newton's method
    let mut t2 = x;
    for _ in 0..8 {
      let x2 = self.sample_x(t2) - x;
      if x2.abs() < Self::EPSILON {
        return t2;
      }
      let d2 = self.sample_dx(t2);
      if d2.abs() < Self::EPSILON {
        break;
      }
      t2 = t2 - x2 / d2;
    }

    // try binary search
    let (mut l, mut r) = (0.0, 1.0);
    while l < r {
      let mid = (l + r) * 0.5;
      let x2 = self.sample_x(mid);
      if (x2 - x).abs() < Self::EPSILON {
        return mid;
      }

      if x2 > x {
        l = mid;
      } else {
        r = mid;
      }
    }

    // give up
    return (l + r) * 0.5;
  }
}
