use nahida_core::{location::Location, story::Animation};

use super::{parse_position, parse_size};

/// parse `[ <position> ] [ / <size> ] [ <animation> ]`
pub fn parse_location_animation(input: &str) -> Option<(Location, Option<Animation>)> {
  let mut input = input.split_whitespace();
  let mut now = input.next();

  let mut position_words = Vec::new();
  let mut size_words = Vec::new();
  let mut animation_words = Vec::new();

  // [ <position> ]
  while let Some(x) = now {
    if !is_position_keyword(x) {
      break;
    }
    position_words.push(x);
    now = input.next();
  }

  // [ / <size> ]
  if let Some("/") = now {
    now = input.next();

    while let Some(x) = now {
      if !is_size_keyword(x) {
        break;
      }
      size_words.push(x);
      now = input.next();
    }
  }

  // [ <animation> ]
  while let Some(x) = now {
    animation_words.push(x);
    now = input.next();
  }

  let position = parse_position(&position_words).unwrap_or_default();
  let size = parse_size(&size_words).unwrap_or_default();
  let location = Location { position, size };

  Some((location, None))
}

fn is_position_keyword(word: &str) -> bool {
  match word {
    "left" | "right" | "center" | "top" | "bottom" => true,
    p if is_percentage(p) => true,
    _ => false,
  }
}

fn is_size_keyword(word: &str) -> bool {
  match word {
    "contain" | "cover" | "fill" | "auto" => true,
    p if is_percentage(p) => true,
    _ => false,
  }
}

fn is_percentage(word: &str) -> bool {
  word.ends_with('%') && word.trim_end_matches('%').parse::<f32>().is_ok()
}
