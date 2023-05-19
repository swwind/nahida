use std::{fmt::Display, path::PathBuf, time::Duration};

use markdown::{
  mdast::{Heading, Image, Link, Node, Paragraph, Root, Text},
  unist::Position,
};
use nahida_core::{
  easing::EasingFunction,
  story::{Story, StoryAction, StoryStep},
};

mod image;

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

impl Display for ParseError {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    write!(f, "ParseError: {} at {:?}", self.message, self.position)
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

  fn parse_image(image: &Image) -> Result<StoryAction> {
    todo!()
  }
}

#[cfg(test)]
mod tests {
  use crate::NahidaParser;

  #[test]
  fn test_parser() {
    NahidaParser::parse(r#"[x](./haid.md "title")"#).unwrap();
  }
}
