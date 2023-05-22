use std::{fs, path::PathBuf, time::Duration};

use image::Tokenizer;
use markdown::{
  mdast::{Heading, Image, Link, Node, Paragraph, Root, Text},
  unist::Position,
};
use nahida_core::story::{Story, StoryAction, StoryStep};
use thiserror::Error;
use url::Url;

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
  #[error("invalid image")]
  InvalidImage,
  #[error("figure shoud have a name")]
  NoFigureName,
  #[error("invalid wait time: {0}")]
  InvalidWaitTime(String),
  #[error("invalid url: {0}")]
  InvalidUrl(String),
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
  source: Url,
}

type Result<T> = std::result::Result<T, ParseError>;

#[cfg(test)]
impl NahidaParser {
  pub fn parse_from_text(text: &str) -> Result<Story> {
    NahidaParser {
      source: Url::parse("file:///index.md").unwrap(),
    }
    .parse_text(text)
  }
}

impl NahidaParser {
  pub fn parse_from_file(file: PathBuf) -> Result<Story> {
    let text = fs::read_to_string(&file).unwrap();
    NahidaParser {
      source: Url::parse(&format!("file://{}", file.to_string_lossy())).unwrap(),
    }
    .parse_text(&text)
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

  fn parse_url(&self, url: &str) -> std::result::Result<Url, url::ParseError> {
    self.source.join(&url)
  }

  fn parse_link(&self, link: &Link) -> Result<StoryAction> {
    let text = match &link.children[..] {
      [Node::Text(Text { value, .. })] => value.clone(),
      _ => Err(ParseError::new_with_position(
        ParseErrorType::InvalidLink,
        link.position.clone(),
      ))?,
    };
    let mut text = Tokenizer::new(&text);

    match text.next() {
      Some("goto") => Ok(StoryAction::Navigate {
        url: self.parse_url(&link.url).unwrap(),
        ret: false,
      }),
      Some("end") => Ok(StoryAction::Navigate {
        url: self.parse_url(&link.url).unwrap(),
        ret: true,
      }),
      Some("wait") => Ok(StoryAction::Wait {
        time: Duration::from_millis(link.url.trim_start_matches('#').parse().map_err(|_| {
          ParseError::new_with_position(
            ParseErrorType::InvalidWaitTime(link.url.clone()),
            link.position.clone(),
          )
        })?),
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
    let url = self.parse_url(&image.url).map_err(|_| {
      ParseError::new_with_position(
        ParseErrorType::InvalidUrl(image.url.clone()),
        image.position.clone(),
      )
    })?;

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
        name: title.parse_name().ok_or_else(|| {
          ParseError::new_with_position(ParseErrorType::NoFigureName, image.position.clone())
        })?,
        location: title.parse_location(),
        animation: title.parse_animation(),
      }),
      Some("bgm") => Ok(StoryAction::Bgm { url }),
      Some("sfx") => Ok(StoryAction::Sfx { url }),
      _ => Err(ParseError::new_with_position(
        ParseErrorType::InvalidImage,
        image.position.clone(),
      )),
    }
  }
}

#[cfg(test)]
mod tests;
