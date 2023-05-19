use nahida_core::location::Position;

enum PositionParamType {
  Left,
  Right,
  Top,
  Bottom,
  Center,
  Percent(f32),
}

fn check_position_param_type(param: &str) -> Option<PositionParamType> {
  match param {
    "left" => Some(PositionParamType::Left),
    "right" => Some(PositionParamType::Right),
    "top" => Some(PositionParamType::Top),
    "bottom" => Some(PositionParamType::Bottom),
    "center" => Some(PositionParamType::Center),
    p if p.ends_with('%') => {
      if let Ok(percent) = p.trim_end_matches('%').parse::<f32>() {
        Some(PositionParamType::Percent(percent / 100.0))
      } else {
        None
      }
    }
    _ => None,
  }
}

/// parse `<position>`
pub fn parse_position(input: &[&str]) -> Option<Position> {
  use PositionParamType::*;

  match input.len() {
    0 => Some(Position(0.0, 0.0)),

    1 => {
      let ty = check_position_param_type(&input[0])?;
      match ty {
        Left => Some(Position(0.0, 0.5)),
        Right => Some(Position(1.0, 0.5)),
        Top => Some(Position(0.5, 0.0)),
        Bottom => Some(Position(0.5, 1.0)),
        Center => Some(Position(0.5, 0.5)),

        Percent(x) => Some(Position(x, 0.5)),
      }
    }

    2 => {
      let (t1, t2) = (
        check_position_param_type(&input[0])?,
        check_position_param_type(&input[1])?,
      );

      match (t1, t2) {
        (Left, Top) => Some(Position(0.0, 0.0)),
        (Left, Bottom) => Some(Position(0.0, 1.0)),
        (Left, Percent(y)) => Some(Position(0.0, y)),

        (Right, Top) => Some(Position(1.0, 0.0)),
        (Right, Bottom) => Some(Position(1.0, 1.0)),
        (Right, Percent(y)) => Some(Position(1.0, y)),

        (Top, Left) => Some(Position(0.0, 0.0)),
        (Top, Right) => Some(Position(1.0, 0.0)),
        (Bottom, Left) => Some(Position(0.0, 1.0)),
        (Bottom, Right) => Some(Position(1.0, 1.0)),

        (Percent(x), Top) => Some(Position(x, 0.0)),
        (Percent(x), Bottom) => Some(Position(x, 1.0)),
        (Percent(x), Percent(y)) => Some(Position(x, y)),

        _ => None,
      }
    }

    3 => {
      let (t1, t2, t3) = (
        check_position_param_type(&input[0])?,
        check_position_param_type(&input[1])?,
        check_position_param_type(&input[2])?,
      );

      match (t1, t2, t3) {
        (Left, Top, Percent(y)) => Some(Position(0.0, y)),
        (Left, Bottom, Percent(y)) => Some(Position(0.0, 1.0 - y)),
        (Left, Percent(x), Top) => Some(Position(x, 0.0)),
        (Left, Percent(x), Bottom) => Some(Position(x, 1.0)),

        (Right, Top, Percent(y)) => Some(Position(1.0, y)),
        (Right, Bottom, Percent(y)) => Some(Position(1.0, 1.0 - y)),
        (Right, Percent(x), Top) => Some(Position(1.0 - x, 0.0)),
        (Right, Percent(x), Bottom) => Some(Position(1.0 - x, 1.0)),

        (Top, Left, Percent(x)) => Some(Position(x, 0.0)),
        (Top, Right, Percent(x)) => Some(Position(1.0 - x, 0.0)),
        (Top, Percent(y), Left) => Some(Position(0.0, y)),
        (Top, Percent(y), Right) => Some(Position(1.0, y)),

        (Bottom, Left, Percent(x)) => Some(Position(x, 1.0)),
        (Bottom, Right, Percent(x)) => Some(Position(1.0 - x, 1.0)),
        (Bottom, Percent(y), Left) => Some(Position(0.0, 1.0 - y)),
        (Bottom, Percent(y), Right) => Some(Position(1.0, 1.0 - y)),

        _ => None,
      }
    }

    4 => {
      let (t1, t2, t3, t4) = (
        check_position_param_type(&input[0])?,
        check_position_param_type(&input[1])?,
        check_position_param_type(&input[2])?,
        check_position_param_type(&input[3])?,
      );

      match (t1, t2, t3, t4) {
        (Left, Percent(x), Top, Percent(y)) => Some(Position(x, y)),
        (Left, Percent(x), Bottom, Percent(y)) => Some(Position(x, 1.0 - y)),
        (Right, Percent(x), Top, Percent(y)) => Some(Position(1.0 - x, y)),
        (Right, Percent(x), Bottom, Percent(y)) => Some(Position(1.0 - x, 1.0 - y)),
        (Top, Percent(y), Left, Percent(x)) => Some(Position(x, y)),
        (Top, Percent(y), Right, Percent(x)) => Some(Position(1.0 - x, y)),
        (Bottom, Percent(y), Left, Percent(x)) => Some(Position(x, 1.0 - y)),
        (Bottom, Percent(y), Right, Percent(x)) => Some(Position(1.0 - x, 1.0 - y)),

        _ => None,
      }
    }

    _ => None,
  }
}

#[cfg(test)]
mod tests {
  use nahida_core::location::Position;

  use crate::image::position::parse_position;

  fn parse(s: &str) -> Option<Position> {
    parse_position(&s.split_whitespace().collect::<Vec<_>>())
  }

  #[test]
  fn test_parse_position() {
    assert_eq!(parse(""), Some(Position(0.0, 0.0)));

    assert_eq!(parse("left"), Some(Position(0.0, 0.5)));
    assert_eq!(parse("right"), Some(Position(1.0, 0.5)));
    assert_eq!(parse("top"), Some(Position(0.5, 0.0)));
    assert_eq!(parse("bottom"), Some(Position(0.5, 1.0)));
    assert_eq!(parse("center"), Some(Position(0.5, 0.5)));
    assert_eq!(parse("20%"), Some(Position(0.2, 0.5)));

    assert_eq!(parse("left top"), Some(Position(0.0, 0.0)));
    assert_eq!(parse("left bottom"), Some(Position(0.0, 1.0)));
    assert_eq!(parse("right top"), Some(Position(1.0, 0.0)));
    assert_eq!(parse("right bottom"), Some(Position(1.0, 1.0)));

    assert_eq!(parse("left 20%"), Some(Position(0.0, 0.2)));
    assert_eq!(parse("20% bottom"), Some(Position(0.2, 1.0)));

    assert_eq!(parse("20% left"), None);
    assert_eq!(parse("bottom 20%"), None);

    assert_eq!(parse("left 20% top"), Some(Position(0.2, 0.0)));
    assert_eq!(parse("right 20% top"), Some(Position(0.8, 0.0)));
    assert_eq!(parse("left top 20%"), Some(Position(0.0, 0.2)));
    assert_eq!(parse("left bottom 20%"), Some(Position(0.0, 0.8)));
    assert_eq!(parse("top 20% left"), Some(Position(0.0, 0.2)));
    assert_eq!(parse("bottom 20% left"), Some(Position(0.0, 0.8)));

    assert_eq!(parse("left top center"), None);
    assert_eq!(parse("left top bottom"), None);
    assert_eq!(parse("left 20% 20%"), None);

    assert_eq!(parse("left 20% top 30%"), Some(Position(0.2, 0.3)));
    assert_eq!(parse("top 30% left 20%"), Some(Position(0.2, 0.3)));
    assert_eq!(parse("right 20% bottom 30%"), Some(Position(0.8, 0.7)));
    assert_eq!(parse("bottom 30% right 20%"), Some(Position(0.8, 0.7)));

    assert_eq!(parse("top left 30% 20%"), None);
    assert_eq!(parse("30% 20% top left"), None);
    assert_eq!(parse("top left right bottom"), None);
  }
}
