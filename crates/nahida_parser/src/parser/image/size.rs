use nahida_core::location::Size;

#[derive(Debug, Clone, Copy)]
pub enum SizeKeyword {
  Contain,
  Cover,
  Fill,
  Auto,
  Percent(f32),
}

pub fn parse_size_keyword(param: &str) -> Option<SizeKeyword> {
  match param {
    "contain" => Some(SizeKeyword::Contain),
    "cover" => Some(SizeKeyword::Cover),
    "fill" => Some(SizeKeyword::Fill),
    "auto" => Some(SizeKeyword::Auto),
    p if p.ends_with('%') => {
      if let Ok(percent) = p.trim_end_matches('%').parse::<f32>() {
        Some(SizeKeyword::Percent(percent / 100.0))
      } else {
        None
      }
    }
    _ => None,
  }
}

/// parse `<size>`
pub fn parse_size(input: &[SizeKeyword]) -> Option<Size> {
  use SizeKeyword::*;

  match input.len() {
    0 => Some(Size::Contain),

    1 => {
      let ty = input[0];

      match ty {
        Contain => Some(Size::Contain),
        Cover => Some(Size::Cover),
        Fill => Some(Size::Fixed(1.0, 1.0)),
        Auto => Some(Size::Contain),
        Percent(w) => Some(Size::FixedWidth(w)),
      }
    }

    2 => {
      let (t1, t2) = (input[0], input[1]);

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

  use super::{parse_size, parse_size_keyword};

  fn parse(s: &str) -> Option<Size> {
    parse_size(
      &s.split_whitespace()
        .map(|x| parse_size_keyword(x).unwrap())
        .collect::<Vec<_>>(),
    )
  }

  #[test]
  fn test_parse_size() {
    assert_eq!(parse("contain"), Some(Size::Contain));
    assert_eq!(parse("cover"), Some(Size::Cover));
    assert_eq!(parse("fill"), Some(Size::Fixed(1.0, 1.0)));
    assert_eq!(parse("auto"), Some(Size::Contain));
    assert_eq!(parse("20%"), Some(Size::FixedWidth(0.2)));

    assert_eq!(parse("auto auto"), Some(Size::Contain));
    assert_eq!(parse("25% auto"), Some(Size::FixedWidth(0.25)));
    assert_eq!(parse("auto 25%"), Some(Size::FixedHeight(0.25)));
    assert_eq!(parse("40% 25%"), Some(Size::Fixed(0.4, 0.25)));
  }
}
