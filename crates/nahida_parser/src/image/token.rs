use std::{iter::Peekable, str::SplitWhitespace, time::Duration};

use nahida_core::{
  easing::EasingFunction,
  location::Location,
  story::{Animation, AnimationType, Transition, TransitionType},
};

use super::{
  animation::{parse_easing, parse_time},
  position::{parse_position, parse_position_keyword},
  size::{parse_size, parse_size_keyword},
};

pub struct Tokenizer<'a> {
  token: Peekable<SplitWhitespace<'a>>,
}

impl<'a> Tokenizer<'a> {
  pub fn new(title: &'a str) -> Self {
    Self {
      token: title.split_whitespace().peekable(),
    }
  }

  pub fn peek(&mut self) -> Option<&&'a str> {
    self.token.peek()
  }

  pub fn next(&mut self) -> Option<&'a str> {
    self.token.next()
  }
}

impl<'a> Tokenizer<'a> {
  /// parse `[ <position> ] [ / <size> ]`
  pub fn parse_location(&mut self) -> Location {
    let mut position_words = Vec::new();
    let mut size_words = Vec::new();

    // [ <position> ]
    while let Some(x) = self.token.peek() {
      match parse_position_keyword(x) {
        Some(word) => position_words.push(word),
        None => break,
      }
      self.token.next();
    }

    // [ / <size> ]
    if let Some(&"/") = self.token.peek() {
      self.token.next();

      while let Some(x) = self.token.peek() {
        match parse_size_keyword(x) {
          Some(word) => size_words.push(word),
          None => break,
        }
        self.token.next();
      }
    }

    let position = parse_position(&position_words).unwrap_or_default();
    let size = parse_size(&size_words).unwrap_or_default();
    let location = Location { position, size };

    location
  }

  pub fn parse_animation(&mut self) -> Option<Animation> {
    let mut ty = None;
    let mut time = Duration::from_secs(60);
    let mut easing = EasingFunction::Linear;

    while let Some(param) = self.token.next() {
      match param {
        "to" => {
          ty = Some(AnimationType::To {
            location: self.parse_location(),
          })
        }
        "shake" => ty = Some(AnimationType::Shake),
        word => {
          if let Some(t) = parse_time(word) {
            time = t;
          } else if let Some(e) = parse_easing(word) {
            easing = e;
          }
        }
      }
    }

    ty.and_then(|ty| Some(Animation { ty, time, easing }))
  }

  pub fn parse_transition(&mut self) -> Option<Transition> {
    let mut ty = None;
    let mut time = Duration::from_secs(1);
    let mut easing = EasingFunction::linear();

    while let Some(token) = self.token.next() {
      match token {
        "fade-in" => ty = Some(TransitionType::FadeIn),
        "fade-out" => ty = Some(TransitionType::FadeOut),
        "conic-in" => ty = Some(TransitionType::ConicIn),
        "conic-out" => ty = Some(TransitionType::ConicOut),
        "blinds-in" => ty = Some(TransitionType::BlindsIn),
        "blinds-out" => ty = Some(TransitionType::BlindsOut),
        "shake" => ty = Some(TransitionType::Shake),
        word => {
          if let Some(t) = parse_time(word) {
            time = t;
          } else if let Some(e) = parse_easing(word) {
            easing = e;
          }
        }
      }
    }

    ty.and_then(|ty| Some(Transition { ty, time, easing }))
  }

  pub fn parse_name(&mut self) -> Option<String> {
    self.token.next().and_then(|x| Some(x.to_string()))
  }

  // /// parse `<location> [ <animation> ]`
  // pub fn parse_location_animation(&mut self) -> Option<(Location, Option<Animation>)> {
  //   let location = self.parse_location();
  //   let animation = self.parse_animation();
  //   Some((location, animation))
  // }

  // /// parse `<name> <location> [ <animation> ]`
  // pub fn parse_name_location_animation(&mut self) -> Option<(String, Location, Option<Animation>)> {
  //   let name = self.token.next().and_then(|x| Some(x.to_string()))?;
  //   let location = self.parse_location();
  //   let animation = self.parse_animation();
  //   Some((name, location, animation))
  // }
}
