use std::time::Duration;

use nahida_core::easing::EasingFunction;

pub fn parse_time(time: &str) -> Option<Duration> {
  match () {
    _ if time.ends_with("ms") => time[..time.len() - 2]
      .parse()
      .ok()
      .and_then(|x| Some(Duration::from_millis(x))),

    _ if time.ends_with("s") => time[..time.len() - 1]
      .parse()
      .ok()
      .and_then(|x| Some(Duration::from_secs(x))),

    _ => None,
  }
}

pub fn parse_easing(easing: &str) -> Option<EasingFunction> {
  match easing {
    "linear" => Some(EasingFunction::linear()),

    "ease" => Some(EasingFunction::ease()),
    "ease-in" => Some(EasingFunction::ease_in()),
    "ease-out" => Some(EasingFunction::ease_out()),
    "ease-in-out" => Some(EasingFunction::ease_in_out()),

    "step-start" => Some(EasingFunction::step_start()),
    "step-end" => Some(EasingFunction::step_end()),

    _ => None,
  }
}
