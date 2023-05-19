use std::{path::PathBuf, time::Duration};

use crate::{easing::EasingFunction, location::Location};

pub struct StoryStep {
  pub actions: Vec<StoryAction>,
}

pub struct Story {
  pub steps: Vec<StoryStep>,
}

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
  },

  /// changing the BGM
  Bgm { url: PathBuf },

  /// playing some sfx
  Sfx { url: PathBuf },

  /// control flow
  Navigate { url: PathBuf, ret: bool },
}

pub enum TransitionType {
  FadeIn,
  FadeOut,
  ConicIn,
  ConicOut,
  BlindsIn,
  BlindsOut,
  Shake,
}

pub struct Transition {
  pub ty: TransitionType,
  pub time: Duration,
  pub easing: EasingFunction,
}

pub enum AnimationType {
  To { location: Location },
  Shake,
}

pub struct Animation {
  pub ty: AnimationType,
  pub time: Duration,
  pub easing: EasingFunction,
}
