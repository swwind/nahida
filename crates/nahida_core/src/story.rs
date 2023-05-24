use std::{path::PathBuf, time::Duration};

use crate::{easing::EasingFunction, location::Location};

#[derive(Debug, PartialEq)]
pub struct StoryStep {
  pub actions: Vec<StoryAction>,
}

#[derive(Debug, PartialEq)]
pub struct Story {
  /// runtime steps
  pub steps: Vec<StoryStep>,
}

#[derive(Debug, PartialEq)]
pub enum StoryAction {
  /// do nothing
  Wait { time: Duration },

  /// showing a text
  Text { name: Option<String>, text: String },

  /// changing the background
  Bg {
    url: PathBuf,
    transition: Option<Transition>,
    animation: Option<Animation>,
    location: Location,
  },

  /// chaning the figure
  Fig {
    name: String,
    url: PathBuf,
    transition: Option<Transition>,
    animation: Option<Animation>,
    location: Location,
    removal: bool,
  },

  /// changing the BGM
  Bgm { url: PathBuf },

  /// playing some sfx
  Sfx { url: PathBuf },

  /// control flow
  Navigate { url: PathBuf, ret: bool },
}

#[derive(Debug, PartialEq)]
pub enum TransitionType {
  FadeIn,
  FadeOut,
  ConicIn,
  ConicOut,
  BlindsIn,
  BlindsOut,
  Shake,
}

#[derive(Debug, PartialEq)]
pub struct Transition {
  pub ty: TransitionType,
  pub time: Duration,
  pub easing: EasingFunction,
}

#[derive(Debug, PartialEq)]
pub enum AnimationType {
  To { location: Location },
  Shake,
}

#[derive(Debug, PartialEq)]
pub struct Animation {
  pub ty: AnimationType,
  pub time: Duration,
  pub easing: EasingFunction,
}
