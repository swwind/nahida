use std::{path::PathBuf, time::Duration};

use nahida_core::{
  easing::EasingFunction,
  location::{Location, Position, Size},
  story::{Animation, AnimationType, Story, StoryAction, StoryStep, Transition, TransitionType},
};

use crate::NahidaParser;

macro_rules! story {
  () => {
    Story { steps: Vec::new() }
  };
  ($($x:expr),+ $(,)?) => {
    Story { steps: vec![$($x),+] }
  };
}

macro_rules! steps {
  () => (
    StoryStep { actions: Vec::new() }
  );
  ($($x:expr),+ $(,)?) => (
    StoryStep { actions: vec![$($x),+] }
  );
}

#[test]
fn test_basic() {
  let story = Ok(story![
    steps![StoryAction::Text {
      name: Some("纳西妲".to_string()),
      text: "「你好呀」".to_string()
    }],
    steps![StoryAction::Text {
      name: Some("我".to_string()),
      text: "「……」".to_string()
    }],
    steps![StoryAction::Text {
      name: Some("我".to_string()),
      text: "「……你好」".to_string()
    }],
    steps![StoryAction::Text {
      name: None,
      text: "突然有个羽毛球上前向我搭话，我莫名感觉到有些慌乱".to_string()
    }],
    steps![StoryAction::Text {
      name: None,
      text: "定睛一看，才发现是个少女".to_string()
    }],
  ]);

  assert_eq!(
    NahidaParser::parse_from_text(include_str!("basic.md")),
    story
  );
}

#[test]
fn test_background() {
  let story = Ok(story![
    steps![StoryAction::Bg {
      url: PathBuf::from("/background.png"),
      transition: None,
      animation: None,
      location: Location::default(),
    }],
    steps![StoryAction::Bg {
      url: PathBuf::from("/background.png"),
      transition: None,
      animation: None,
      location: Location {
        position: Position(0.0, 0.5),
        size: Size::default(),
      },
    }],
    steps![StoryAction::Bg {
      url: PathBuf::from("/background.png"),
      transition: None,
      animation: None,
      location: Location {
        position: Position(0.0, 0.5),
        size: Size::Cover,
      },
    }],
    steps![StoryAction::Bg {
      url: PathBuf::from("/background.png"),
      transition: None,
      animation: None,
      location: Location {
        position: Position(0.0, 0.2),
        size: Size::FixedHeight(0.3),
      },
    }],
    steps![StoryAction::Bg {
      url: PathBuf::from("/background.png"),
      transition: None,
      animation: Some(Animation {
        ty: AnimationType::To {
          location: Location {
            position: Position(0.2, 0.8),
            size: Size::FixedWidth(0.4)
          }
        },
        time: Duration::from_secs(60),
        easing: EasingFunction::Linear,
      }),
      location: Location {
        position: Position(0.7, 1.0),
        size: Size::Fixed(0.3, 0.2),
      },
    }],
    steps![StoryAction::Bg {
      url: PathBuf::from("/background.png"),
      transition: None,
      animation: Some(Animation {
        ty: AnimationType::To {
          location: Location {
            position: Position(0.2, 0.0),
            size: Size::FixedHeight(0.3)
          }
        },
        time: Duration::from_secs(20),
        easing: EasingFunction::ease_in_out(),
      }),
      location: Location {
        position: Position(0.7, 1.0),
        size: Size::Fixed(0.3, 0.2),
      },
    }],
    steps![StoryAction::Bg {
      url: PathBuf::from("/background.png"),
      transition: Some(Transition {
        ty: TransitionType::FadeIn,
        time: Duration::from_secs(1),
        easing: EasingFunction::Linear
      }),
      animation: None,
      location: Location::default()
    }],
    steps![StoryAction::Bg {
      url: PathBuf::from("/background.png"),
      transition: Some(Transition {
        ty: TransitionType::FadeOut,
        time: Duration::from_secs(5),
        easing: EasingFunction::StepStart
      }),
      animation: None,
      location: Location::default()
    }]
  ]);

  assert_eq!(NahidaParser::parse_from_text(include_str!("bg.md")), story);
}
