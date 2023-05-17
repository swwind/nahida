use std::{path::PathBuf, time::Duration};

use crate::{easing::EasingFunction, location::Location};

pub enum StoryAction {
  /// do nothing and wait for ms time
  Wait {
    time: Duration,
  },

  Actions {
    actions: Vec<Action>,
  },
}

pub enum Action {
  Text {
    name: Option<String>,
    text: String,
  },

  Bg {
    url: PathBuf,
    transition: Transition,
    animation: Animation,
    location: Location,
  },

  Fig {
    name: String,
    url: PathBuf,
    transition: Transition,
    animation: Animation,
    location: Location,
  },

  Bgm {
    url: PathBuf,
  },

  Sfx {
    url: PathBuf,
  },
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
