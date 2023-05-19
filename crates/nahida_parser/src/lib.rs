use std::{path::PathBuf, time::Duration};

use markdown::{
  mdast::{Heading, Image, Link, Node, Paragraph, Root, Text},
  unist::Position,
};
use nahida_core::{
  easing::EasingFunction,
  location::{Location, PositionX, PositionY, Size, SizeX, SizeY},
  story::{Story, StoryAction, StoryStep, Transition, TransitionType},
};

#[derive(Debug)]
pub struct ParseError {
  message: String,
  position: Option<Position>,
}

impl ParseError {
  fn new(message: impl Into<String>) -> Self {
    Self {
      message: message.into(),
      position: None,
    }
  }

  fn new_with_position(message: impl Into<String>, position: Option<Position>) -> Self {
    Self {
      message: message.into(),
      position,
    }
  }
}

#[derive(Default)]
pub struct NahidaParser;

type Result<T> = std::result::Result<T, ParseError>;

impl NahidaParser {
  pub fn parse(text: &str) -> Result<Story> {
    match markdown::to_mdast(text, &markdown::ParseOptions::default())
      .map_err(|x| ParseError::new(x))?
    {
      Node::Root(root) => Ok(Self::parse_root(&root)?),
      _ => unreachable!(),
    }
  }

  fn parse_root(root: &Root) -> Result<Story> {
    let mut story = Story { steps: Vec::new() };
    let mut name = None;

    for child in &root.children {
      match child {
        Node::Heading(heading) => name = Some(Self::parse_heading(heading)?),
        Node::ThematicBreak(_) => name = None,
        Node::Paragraph(paragraph) => story.steps.push(Self::parse_paragraph(paragraph, &name)?),
        node => Err(ParseError::new_with_position(
          format!("Unknown node: {node:?}"),
          node.position().cloned(),
        ))?,
      }
    }

    Ok(story)
  }

  fn parse_heading(heading: &Heading) -> Result<String> {
    match &heading.children[..] {
      [Node::Text(Text { value, .. })] => Ok(value.clone()),
      _ => Err(ParseError::new_with_position(
        "Invalid heading",
        heading.position.clone(),
      )),
    }
  }

  fn parse_paragraph(paragraph: &Paragraph, name: &Option<String>) -> Result<StoryStep> {
    let mut step = StoryStep {
      actions: Vec::new(),
    };

    for child in &paragraph.children {
      match child {
        Node::Text(Text { value, .. }) => {
          let action = StoryAction::Text {
            name: name.clone(),
            text: value.clone(),
          };
          step.actions.push(action);
        }
        Node::Link(link) => {
          let action = Self::parse_link(link)?;
          step.actions.push(action);
        }
        Node::Image(image) => {
          let action = Self::parse_image(image)?;
          step.actions.push(action);
        }
        _ => todo!(),
      }
    }

    Ok(step)
  }

  fn parse_link(link: &Link) -> Result<StoryAction> {
    let text = match &link.children[..] {
      [Node::Text(Text { value, .. })] => value.clone(),
      _ => Err(ParseError::new_with_position(
        "Invalid link",
        link.position.clone(),
      ))?,
    };

    match () {
      _ if text.contains("goto") => Ok(StoryAction::Navigate {
        url: PathBuf::from(link.url.clone()),
        ret: !text.contains("end"),
      }),
      _ => Err(ParseError::new_with_position(
        "Unknown link",
        link.position.clone(),
      )),
    }
  }

  fn parse_time_and_easing(
    params: &[&str],
    mut time: Duration,
    mut easing: EasingFunction,
  ) -> Result<(Duration, EasingFunction)> {
    for param in params {
      match *param {
        "linear" => easing = EasingFunction::linear(),

        "ease" => easing = EasingFunction::ease(),
        "ease-in" => easing = EasingFunction::ease_in(),
        "ease-out" => easing = EasingFunction::ease_out(),
        "ease-in-out" => easing = EasingFunction::ease_in_out(),

        "step-start" => easing = EasingFunction::step_start(),
        "step-end" => easing = EasingFunction::step_end(),

        t if is_secs(t) => time = Duration::from_secs(t[..t.len() - 1].parse().unwrap()),
        t if is_millis(t) => time = Duration::from_millis(t[..t.len() - 2].parse().unwrap()),

        _ => {}
      }
    }

    Ok((time, easing))
  }

  fn parse_transition(params: &[&str]) -> Result<Option<Transition>> {
    let (time, easing) =
      Self::parse_time_and_easing(params, Duration::from_secs(1), EasingFunction::Linear)?;

    let mut ty = None;

    for param in params {
      match *param {
        "fade-in" => ty = Some(TransitionType::FadeIn),
        "fade-out" => ty = Some(TransitionType::FadeOut),
        "conic-in" => ty = Some(TransitionType::ConicIn),
        "conic-out" => ty = Some(TransitionType::ConicOut),
        "blinds-in" => ty = Some(TransitionType::BlindsIn),
        "blinds-out" => ty = Some(TransitionType::BlindsOut),
        "shake" => ty = Some(TransitionType::Shake),

        _ => {}
      }
    }

    Ok(ty.and_then(|ty| Some(Transition { ty, time, easing })))
  }

  fn parse_percent(percent: &str) -> Result<f32> {
    Ok(percent[..percent.len() - 1].parse::<f32>().unwrap() / 100.0)
  }

  fn parse_location(params: &[&str], mut location: Location) -> Result<Location> {
    let mut is_position = true;
    let mut is_position_x = true;
    let mut is_position_y = true;
    let mut is_size = true;
    let mut is_size_x = true;
    let mut is_size_y = true;

    for param in params {
      if is_position {
        match *param {
          "left" => {
            if !is_position_x {
              Err(ParseError::new("invalid position: left"))?;
            }
            location.position.x = PositionX::Left;
            is_position_x = false;
          }
          "right" => {
            if !is_position_x {
              Err(ParseError::new("invalid position: right"))?;
            }
            location.position.x = PositionX::Right;
            is_position_x = false;
          }
          "top" => {
            if !is_position_y {
              Err(ParseError::new("invalid position: top"))?;
            }
            location.position.y = PositionY::Top;
            is_position_y = false;
          }
          "bottom" => {
            if !is_position_y {
              Err(ParseError::new("invalid position: bottom"))?;
            }
            location.position.y = PositionY::Bottom;
            is_position_y = false;
          }
          "center" => {
            if is_position_x {
              location.position.x = PositionX::Center;
              is_position_x = false;
            } else if is_position_y {
              location.position.y = PositionY::Center;
              is_position_y = false;
            } else {
              Err(ParseError::new("invalid position: center"))?;
            }
          }
          "/" => {
            is_position = false;
          }
          percent if is_percent(percent) => {
            let uniform = Self::parse_percent(percent)?;
            if is_position_x {
              location.position.x = PositionX::Percent(uniform);
              is_position_x = false;
            } else if is_position_y {
              location.position.y = PositionY::Percent(uniform);
              is_position_y = false;
            } else {
              Err(ParseError::new(format!("invalid position: {percent}")))?;
            }
          }
          _ => {
            is_position = false;
            is_size = false;
          }
        }
      } else if is_size {
        match *param {
          "contain" => {
            if !is_size_x || !is_size_y {
              Err(ParseError::new("invalid size: contain"))?;
            }
            location.size = Size::Contain;
            is_size = false;
          }
          "cover" => {
            if !is_size_x || !is_size_y {
              Err(ParseError::new("invalid size: cover"))?;
            }
            location.size = Size::Cover;
            is_size = false;
          }
          "fill" => {
            if !is_size_x || !is_size_y {
              Err(ParseError::new("invalid size: fill"))?;
            }
            location.size = Size::Fill;
            is_size = false;
          }
          "auto" => {
            let (mut x, mut y) = match &location.size {
              Size::Cover | Size::Contain | Size::Fill => (SizeX::Auto, SizeY::Auto),
              Size::Xy { x, y } => (x.clone(), y.clone()),
            };

            if is_size_x {
              x = SizeX::Auto;
              is_size_x = false;
            } else if is_size_y {
              y = SizeY::Auto;
              is_size_x = false;
            } else {
              Err(ParseError::new("invalid size: auto"))?;
            }

            location.size = Size::Xy { x, y };
          }
          percent if is_percent(percent) => {
            let (mut x, mut y) = match &location.size {
              Size::Cover | Size::Contain | Size::Fill => (SizeX::Auto, SizeY::Auto),
              Size::Xy { x, y } => (x.clone(), y.clone()),
            };

            let uniform = Self::parse_percent(percent)?;
            if is_size_x {
              x = SizeX::Percent(uniform);
              is_size_x = false;
            } else if is_size_y {
              y = SizeY::Percent(uniform);
              is_size_y = false;
            } else {
              Err(ParseError::new(format!("invalid size: {percent}")))?;
            }

            location.size = Size::Xy { x, y };
          }
          _ => {
            is_size = false;
          }
        }
      } else {
        break;
      }
    }

    Ok(location)
  }

  fn parse_name(params: &[&str]) -> Result<String> {
    match params.first() {
      Some(name) => Ok(name.to_string()),
      None => Err(ParseError::new("No name found"))?,
    }
  }

  fn parse_image(image: &Image) -> Result<StoryAction> {
    let alt = image.alt.split(' ').collect::<Vec<_>>();
    let title = image
      .title
      .as_ref()
      .and_then(|x| Some(x.split(' ').collect()))
      .unwrap_or(Vec::new());
    match alt.first() {
      Some(ptr) if *ptr == "bg" => {
        let transition = Self::parse_transition(&alt[1..]).map_err(|mut x| {
          x.position = image.position.clone();
          x
        })?;
        let location = Self::parse_location(&title, Location::default())?;

        todo!()
      }
      Some(ptr) if *ptr == "fig" => {
        let transition = Self::parse_transition(&alt[1..])?;
        let name = match title.first() {
          Some(name) => *name,
          None => Err(ParseError::new_with_position(
            "No name provided for fig",
            image.position.clone(),
          ))?,
        };
        let location = Self::parse_location(&title[1..], Location::default())?;

        todo!()
      }
      _ => Err(ParseError::new_with_position(
        "Unknown image",
        image.position.clone(),
      )),
    }
  }
}

fn is_secs(s: &str) -> bool {
  s.ends_with("s") && s[..s.len() - 1].chars().all(|x| x.is_digit(10))
}

fn is_millis(s: &str) -> bool {
  s.ends_with("ms") && s[..s.len() - 2].chars().all(|x| x.is_digit(10))
}

fn is_percent(s: &str) -> bool {
  s.ends_with("%")
}

#[cfg(test)]
mod tests {
  use crate::NahidaParser;

  #[test]
  fn test_parser() {
    NahidaParser::parse(r#"[x](./haid.md "title")"#).unwrap();
  }
}
