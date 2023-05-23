use std::time::Duration;

use markdown::{
  mdast::{Heading, Image, Link, Node, Paragraph, Root, Text},
  unist::Position,
};
use nahida_core::story::{Story, StoryAction, StoryStep};
use thiserror::Error;

mod image;

use image::Tokenizer;

#[derive(Debug, Error, PartialEq)]
pub enum ParseErrorType {
  #[error("failed to parse markdown: {0}")]
  MdastError(String),
  #[error("unknown markdown node: {0}")]
  UnknownNode(String),
  #[error("invalid heading")]
  InvalidHeading,
  #[error("invalid link")]
  InvalidLink,
  #[error("invalid image")]
  InvalidImage,
  #[error("figure shoud have a name")]
  NoFigureName,
  #[error("invalid wait time: {0}")]
  InvalidWaitTime(String),
}

#[derive(Debug, Error, PartialEq)]
#[error("parse error: {ty} at {position:?}")]
pub struct ParseError {
  ty: ParseErrorType,
  position: Option<Position>,
}

#[derive(Default)]
pub struct NahidaParser {
  current_position: Option<Position>,
}

type Result<T> = std::result::Result<T, ParseError>;

impl NahidaParser {
  pub fn parse_text(&mut self, text: &str) -> Result<Story> {
    match markdown::to_mdast(text, &markdown::ParseOptions::default())
      .map_err(|x| self.throw(ParseErrorType::MdastError(x)))?
    {
      Node::Root(root) => Ok(self.parse_root(&root)?),
      _ => unreachable!(),
    }
  }
}

impl NahidaParser {
  fn throw(&self, ty: ParseErrorType) -> ParseError {
    ParseError {
      ty,
      position: self.current_position.clone(),
    }
  }

  fn parse_root(&mut self, root: &Root) -> Result<Story> {
    self.current_position = root.position.clone();

    let mut story = Story { steps: Vec::new() };
    let mut name = None;

    for child in &root.children {
      match child {
        Node::Heading(heading) => name = Some(self.parse_heading(heading)?),
        Node::ThematicBreak(_) => name = None,
        Node::Paragraph(paragraph) => story.steps.push(self.parse_paragraph(paragraph, &name)?),
        node => Err(self.throw(ParseErrorType::UnknownNode(format!("{node:?}"))))?,
      }
    }

    Ok(story)
  }

  fn parse_heading(&mut self, heading: &Heading) -> Result<String> {
    self.current_position = heading.position.clone();

    match &heading.children[..] {
      [Node::Text(Text { value, .. })] => Ok(value.clone()),
      _ => Err(self.throw(ParseErrorType::InvalidHeading)),
    }
  }

  fn parse_paragraph(&mut self, paragraph: &Paragraph, name: &Option<String>) -> Result<StoryStep> {
    self.current_position = paragraph.position.clone();

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

  fn parse_link(&mut self, link: &Link) -> Result<StoryAction> {
    self.current_position = link.position.clone();

    let text = match &link.children[..] {
      [Node::Text(Text { value, .. })] => value.clone(),
      _ => Err(self.throw(ParseErrorType::InvalidLink))?,
    };
    let mut text = Tokenizer::new(&text);

    match text.next() {
      Some("goto") => Ok(StoryAction::Navigate {
        url: link.url.clone(),
        ret: false,
      }),
      Some("end") => Ok(StoryAction::Navigate {
        url: link.url.clone(),
        ret: true,
      }),
      Some("wait") => Ok(StoryAction::Wait {
        time: Duration::from_millis(
          link
            .url
            .trim_start_matches('#')
            .parse()
            .map_err(|_| self.throw(ParseErrorType::InvalidWaitTime(link.url.clone())))?,
        ),
      }),
      _ => Err(self.throw(ParseErrorType::InvalidLink)),
    }
  }

  fn parse_image(&mut self, image: &Image) -> Result<StoryAction> {
    self.current_position = image.position.clone();

    let mut alt = Tokenizer::new(&image.alt);
    let title = image.title.clone().unwrap_or_default();
    let mut title = Tokenizer::new(&title);
    let url = image.url.clone();

    match alt.next() {
      Some("bg") => Ok(StoryAction::Bg {
        url,
        transition: alt.parse_transition(),
        location: title.parse_location(),
        animation: title.parse_animation(),
      }),
      Some("fig") => Ok(StoryAction::Fig {
        url,
        removal: alt.parse_remove(),
        transition: alt.parse_transition(),
        name: title
          .parse_name()
          .ok_or_else(|| self.throw(ParseErrorType::NoFigureName))?,
        location: title.parse_location(),
        animation: title.parse_animation(),
      }),
      Some("bgm") => Ok(StoryAction::Bgm { url }),
      Some("sfx") => Ok(StoryAction::Sfx { url }),
      _ => Err(self.throw(ParseErrorType::InvalidImage)),
    }
  }
}
