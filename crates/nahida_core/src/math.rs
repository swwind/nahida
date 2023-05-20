/// solve ax^3+bx^2+cx+d=0
pub fn cubic_solve4(a: f32, b: f32, c: f32, d: f32) -> f32 {
  cubic_solve3(b / a, c / a, d / a)
}

/// solve x^3+ax^2+bx+c=0
fn cubic_solve3(a: f32, b: f32, c: f32) -> f32 {
  let p = b - a * a / 3.0;
  let q = 2.0 * a * a * a / 27.0 - a * b / 3.0 + c;
  cubic_solve2(p, q) + a / 3.0
}

/// solve x^3+px+q=0
fn cubic_solve2(p: f32, q: f32) -> f32 {
  let delta = (q * q / 4.0 + p * p * p / 27.0).sqrt();
  let theta = -q / 2.0;
  (theta + delta).powf(1.0 / 3.0) + (theta - delta).powf(1.0 / 3.0)
}
