use std::{fs, path::PathBuf};

use image::Tokenizer;
use markdown::{
  mdast::{Heading, Image, Link, Node, Paragraph, Root, Text},
  unist::Position,
};
use nahida_core::story::{Story, StoryAction, StoryStep};
use thiserror::Error;

mod image;

#[derive(Debug, Error)]
pub enum ParseErrorType {
  #[error("failed to parse markdown: {0}")]
  MdastError(String),
  #[error("unknown markdown node: {0}")]
  UnknownNode(String),
  #[error("invalid heading")]
  InvalidHeading,
  #[error("invalid link")]
  InvalidLink,
  #[error("invalid image type: {0}")]
  InvalidImageType(String),
  #[error("image should have an alt")]
  NoImageAlt,
  #[error("figure shoud have a name")]
  NoFigureName,
}

#[derive(Debug, Error)]
#[error("parse error: {ty} at {position:?}")]
pub struct ParseError {
  ty: ParseErrorType,
  position: Option<Position>,
}

impl ParseError {
  fn new(ty: ParseErrorType) -> Self {
    Self { ty, position: None }
  }

  fn new_with_position(ty: ParseErrorType, position: Option<Position>) -> Self {
    Self { ty, position }
  }
}

pub struct NahidaParser {
  base: PathBuf,
}

type Result<T> = std::result::Result<T, ParseError>;

impl NahidaParser {
  pub fn parse_from_text(text: &str) -> Result<Story> {
    NahidaParser {
      base: PathBuf::default(),
    }
    .parse_text(text)
  }

  pub fn parse_from_file(file: PathBuf) -> Result<Story> {
    let text = fs::read_to_string(file.clone()).unwrap();
    NahidaParser { base: file }.parse_text(&text)
  }
}

impl NahidaParser {
  fn parse_text(&self, text: &str) -> Result<Story> {
    match markdown::to_mdast(text, &markdown::ParseOptions::default())
      .map_err(|x| ParseError::new(ParseErrorType::MdastError(x)))?
    {
      Node::Root(root) => Ok(self.parse_root(&root)?),
      _ => unreachable!(),
    }
  }

  fn parse_root(&self, root: &Root) -> Result<Story> {
    let mut story = Story { steps: Vec::new() };
    let mut name = None;

    for child in &root.children {
      match child {
        Node::Heading(heading) => name = Some(self.parse_heading(heading)?),
        Node::ThematicBreak(_) => name = None,
        Node::Paragraph(paragraph) => story.steps.push(self.parse_paragraph(paragraph, &name)?),
        node => Err(ParseError::new_with_position(
          ParseErrorType::UnknownNode(format!("{node:?}")),
          node.position().cloned(),
        ))?,
      }
    }

    Ok(story)
  }

  fn parse_heading(&self, heading: &Heading) -> Result<String> {
    match &heading.children[..] {
      [Node::Text(Text { value, .. })] => Ok(value.clone()),
      _ => Err(ParseError::new_with_position(
        ParseErrorType::InvalidHeading,
        heading.position.clone(),
      )),
    }
  }

  fn parse_paragraph(&self, paragraph: &Paragraph, name: &Option<String>) -> Result<StoryStep> {
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
          let action = self.parse_link(link)?;
          step.actions.push(action);
        }
        Node::Image(image) => {
          let action = self.parse_image(image)?;
          step.actions.push(action);
        }
        _ => todo!(),
      }
    }

    Ok(step)
  }

  fn parse_link(&self, link: &Link) -> Result<StoryAction> {
    let text = match &link.children[..] {
      [Node::Text(Text { value, .. })] => value.clone(),
      _ => Err(ParseError::new_with_position(
        ParseErrorType::InvalidLink,
        link.position.clone(),
      ))?,
    };

    match () {
      _ if text.contains("goto") => Ok(StoryAction::Navigate {
        url: PathBuf::from(link.url.clone()),
        ret: !text.contains("end"),
      }),
      _ => Err(ParseError::new_with_position(
        ParseErrorType::InvalidLink,
        link.position.clone(),
      )),
    }
  }

  fn parse_image(&self, image: &Image) -> Result<StoryAction> {
    let mut alt = Tokenizer::new(&image.alt);
    let title = image.title.clone().unwrap_or_default();
    let mut title = Tokenizer::new(&title);
    let url = self.base.join(&image.url);

    match alt.next() {
      Some("bg") => {
        let transition = alt.parse_transition();
        let location = title.parse_location();
        let animation = title.parse_animation();

        Ok(StoryAction::Bg {
          url,
          transition,
          animation,
          location,
        })
      }
      Some("fig") => {
        let remove = matches!(alt.peek(), Some(&"remove"));
        if remove {
          alt.next();
        }

        let transition = alt.parse_transition();
        let name = title.parse_name().ok_or_else(|| {
          ParseError::new_with_position(ParseErrorType::NoFigureName, image.position.clone())
        })?;
        let location = title.parse_location();
        let animation = title.parse_animation();

        Ok(StoryAction::Fig {
          name,
          url,
          transition,
          animation,
          location,
        })
      }
      Some(ty) => Err(ParseError::new_with_position(
        ParseErrorType::InvalidImageType(format!("{ty}")),
        image.position.clone(),
      )),
      None => Err(ParseError::new_with_position(
        ParseErrorType::NoImageAlt,
        image.position.clone(),
      )),
    }
  }
}

#[cfg(test)]
mod tests {
  use crate::{NahidaParser, ParseError, ParseErrorType};

  #[test]
  fn test_parser() {
    assert!(matches!(
      NahidaParser::parse_from_text(r#"[x](./haid.md "title")"#),
      Err(ParseError {
        ty: ParseErrorType::InvalidLink,
        ..
      }),
    ));
  }
}
