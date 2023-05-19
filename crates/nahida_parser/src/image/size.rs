use nahida_core::location::Size;

enum SizeParamType {
  Contain,
  Cover,
  Fill,
  Auto,
  Percent(f32),
}

fn check_size_param_type(param: &str) -> Option<SizeParamType> {
  match param {
    "contain" => Some(SizeParamType::Contain),
    "cover" => Some(SizeParamType::Cover),
    "fill" => Some(SizeParamType::Fill),
    "auto" => Some(SizeParamType::Auto),
    p if p.ends_with('%') => {
      if let Ok(percent) = p.trim_end_matches('%').parse::<f32>() {
        Some(SizeParamType::Percent(percent / 100.0))
      } else {
        None
      }
    }
    _ => None,
  }
}

/// parse `<size>`
pub fn parse_size(input: &[&str]) -> Option<Size> {
  use SizeParamType::*;

  match input.len() {
    0 => Some(Size::Contain),

    1 => {
      let ty = check_size_param_type(&input[0])?;

      match ty {
        Contain => Some(Size::Contain),
        Cover => Some(Size::Cover),
        Fill => Some(Size::Fill),
        Auto => Some(Size::Contain),
        Percent(w) => Some(Size::FixedWidth(w)),
      }
    }

    2 => {
      let (t1, t2) = (
        check_size_param_type(&input[0])?,
        check_size_param_type(&input[1])?,
      );

      match (t1, t2) {
        (Auto, Auto) => Some(Size::Contain),
        (Auto, Percent(h)) => Some(Size::FixedHeight(h)),
        (Percent(w), Auto) => Some(Size::FixedWidth(w)),
        (Percent(w), Percent(h)) => Some(Size::Fixed(w, h)),

        _ => None,
      }
    }

    _ => None,
  }
}

#[cfg(test)]
mod tests {
  use nahida_core::location::Size;

  use crate::image::size::parse_size;

  fn parse(s: &str) -> Option<Size> {
    parse_size(&s.split_whitespace().collect::<Vec<_>>())
  }

  #[test]
  fn test_parse_size() {
    assert_eq!(parse("contain"), Some(Size::Contain));
    assert_eq!(parse("cover"), Some(Size::Cover));
    assert_eq!(parse("fill"), Some(Size::Fill));
    assert_eq!(parse("auto"), Some(Size::Contain));
    assert_eq!(parse("20%"), Some(Size::FixedWidth(0.2)));

    assert_eq!(parse("auto auto"), Some(Size::Contain));
    assert_eq!(parse("25% auto"), Some(Size::FixedWidth(0.25)));
    assert_eq!(parse("auto 25%"), Some(Size::FixedHeight(0.25)));
    assert_eq!(parse("40% 25%"), Some(Size::Fixed(0.4, 0.25)));
  }
}
