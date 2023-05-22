use std::time::Duration;

use nahida_core::{
  easing::EasingFunction,
  story::{Animation, AnimationType, StoryAction, Transition, TransitionType},
  Location, Position, Size,
};

use crate::{steps, story, url, NahidaParser};

#[test]
fn test_background() {
  let story = story![
    steps![StoryAction::Bg {
      url: url!("file:///background.png"),
      transition: None,
      animation: None,
      location: Location::default(),
    }],
    steps![StoryAction::Bg {
      url: url!("file:///background.png"),
      transition: None,
      animation: None,
      location: Location {
        position: Position(0.0, 0.5),
        size: Size::default(),
      },
    }],
    steps![StoryAction::Bg {
      url: url!("file:///background.png"),
      transition: None,
      animation: None,
      location: Location {
        position: Position(0.0, 0.5),
        size: Size::Cover,
      },
    }],
    steps![StoryAction::Bg {
      url: url!("file:///background.png"),
      transition: None,
      animation: None,
      location: Location {
        position: Position(0.0, 0.2),
        size: Size::FixedHeight(0.3),
      },
    }],
    steps![StoryAction::Bg {
      url: url!("file:///background.png"),
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
      url: url!("file:///background.png"),
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
      url: url!("file:///background.png"),
      transition: Some(Transition {
        ty: TransitionType::FadeIn,
        time: Duration::from_secs(1),
        easing: EasingFunction::Linear
      }),
      animation: None,
      location: Location::default()
    }],
    steps![StoryAction::Bg {
      url: url!("file:///background.png"),
      transition: Some(Transition {
        ty: TransitionType::FadeOut,
        time: Duration::from_secs(5),
        easing: EasingFunction::StepStart
      }),
      animation: None,
      location: Location::default()
    }]
  ];

  assert_eq!(
    NahidaParser::parse_from_text(include_str!("bg.md")).unwrap(),
    story
  );
}
