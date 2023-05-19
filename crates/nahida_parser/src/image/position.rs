use nahida_core::location::Position;

#[derive(Debug, Clone, Copy)]
pub enum PositionKeyword {
  Left,
  Right,
  Top,
  Bottom,
  Center,
  Percent(f32),
}

pub fn parse_position_keyword(param: &str) -> Option<PositionKeyword> {
  match param {
    "left" => Some(PositionKeyword::Left),
    "right" => Some(PositionKeyword::Right),
    "top" => Some(PositionKeyword::Top),
    "bottom" => Some(PositionKeyword::Bottom),
    "center" => Some(PositionKeyword::Center),
    p if p.ends_with('%') => {
      if let Ok(percent) = p.trim_end_matches('%').parse::<f32>() {
        Some(PositionKeyword::Percent(percent / 100.0))
      } else {
        None
      }
    }
    _ => None,
  }
}

/// parse `<position>`
pub fn parse_position(input: &[PositionKeyword]) -> Option<Position> {
  use PositionKeyword::*;

  match input.len() {
    0 => Some(Position(0.0, 0.0)),

    1 => {
      let ty = input[0];

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
      let (t1, t2) = (input[0], input[1]);

      match (t1, t2) {
        (Left, Top) => Some(Position(0.0, 0.0)),
        (Top, Left) => Some(Position(0.0, 0.0)),
        (Left, Center) => Some(Position(0.0, 0.5)),
        (Center, Left) => Some(Position(0.0, 0.5)),
        (Left, Bottom) => Some(Position(0.0, 1.0)),
        (Bottom, Left) => Some(Position(0.0, 1.0)),

        (Right, Top) => Some(Position(1.0, 0.0)),
        (Top, Right) => Some(Position(1.0, 0.0)),
        (Right, Center) => Some(Position(1.0, 0.5)),
        (Center, Right) => Some(Position(1.0, 0.5)),
        (Right, Bottom) => Some(Position(1.0, 1.0)),
        (Bottom, Right) => Some(Position(1.0, 1.0)),

        (Top, Center) => Some(Position(0.5, 0.0)),
        (Center, Top) => Some(Position(0.5, 0.0)),
        (Center, Center) => Some(Position(0.5, 0.5)),
        (Bottom, Center) => Some(Position(0.5, 1.0)),
        (Center, Bottom) => Some(Position(0.5, 1.0)),

        (Left, Percent(y)) => Some(Position(0.0, y)),
        (Center, Percent(y)) => Some(Position(0.5, y)),
        (Right, Percent(y)) => Some(Position(1.0, y)),

        (Percent(x), Top) => Some(Position(x, 0.0)),
        (Percent(x), Center) => Some(Position(x, 0.5)),
        (Percent(x), Bottom) => Some(Position(x, 1.0)),

        (Percent(x), Percent(y)) => Some(Position(x, y)),

        _ => None,
      }
    }

    3 => {
      let (t1, t2, t3) = (input[0], input[1], input[2]);

      match (t1, t2, t3) {
        (Left, Percent(x), Top) => Some(Position(x, 0.0)),
        (Left, Percent(x), Center) => Some(Position(x, 0.5)),
        (Left, Percent(x), Bottom) => Some(Position(x, 1.0)),

        (Right, Percent(x), Top) => Some(Position(1.0 - x, 0.0)),
        (Right, Percent(x), Center) => Some(Position(1.0 - x, 0.5)),
        (Right, Percent(x), Bottom) => Some(Position(1.0 - x, 1.0)),

        (Top, Percent(y), Left) => Some(Position(0.0, y)),
        (Top, Percent(y), Center) => Some(Position(0.5, y)),
        (Top, Percent(y), Right) => Some(Position(1.0, y)),

        (Bottom, Percent(y), Left) => Some(Position(0.0, 1.0 - y)),
        (Bottom, Percent(y), Center) => Some(Position(0.5, 1.0 - y)),
        (Bottom, Percent(y), Right) => Some(Position(1.0, 1.0 - y)),

        (Top, Left, Percent(x)) => Some(Position(x, 0.0)),
        (Center, Left, Percent(x)) => Some(Position(x, 0.5)),
        (Bottom, Left, Percent(x)) => Some(Position(x, 1.0)),

        (Top, Right, Percent(x)) => Some(Position(1.0 - x, 0.0)),
        (Center, Right, Percent(x)) => Some(Position(1.0 - x, 0.5)),
        (Bottom, Right, Percent(x)) => Some(Position(1.0 - x, 1.0)),

        (Left, Top, Percent(y)) => Some(Position(0.0, y)),
        (Center, Top, Percent(y)) => Some(Position(0.5, y)),
        (Right, Top, Percent(y)) => Some(Position(1.0, y)),

        (Left, Bottom, Percent(y)) => Some(Position(0.0, 1.0 - y)),
        (Center, Bottom, Percent(y)) => Some(Position(0.5, 1.0 - y)),
        (Right, Bottom, Percent(y)) => Some(Position(1.0, 1.0 - y)),

        _ => None,
      }
    }

    4 => {
      let (t1, t2, t3, t4) = (input[0], input[1], input[2], input[3]);

      match (t1, t2, t3, t4) {
        (Left, Percent(x), Top, Percent(y)) => Some(Position(x, y)),
        (Top, Percent(y), Left, Percent(x)) => Some(Position(x, y)),

        (Left, Percent(x), Bottom, Percent(y)) => Some(Position(x, 1.0 - y)),
        (Bottom, Percent(y), Left, Percent(x)) => Some(Position(x, 1.0 - y)),

        (Right, Percent(x), Top, Percent(y)) => Some(Position(1.0 - x, y)),
        (Top, Percent(y), Right, Percent(x)) => Some(Position(1.0 - x, y)),

        (Right, Percent(x), Bottom, Percent(y)) => Some(Position(1.0 - x, 1.0 - y)),
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

  use super::parse_position_keyword;

  fn parse(s: &str) -> Option<Position> {
    parse_position(
      &s.split_whitespace()
        .map(|x| parse_position_keyword(x).unwrap())
        .collect::<Vec<_>>(),
    )
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
