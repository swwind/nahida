use std::time::Duration;

use nahida_core::{
  easing::EasingFunction,
  story::{Animation, AnimationType, StoryAction, Transition, TransitionType},
  Location, Position, Size,
};

use crate::{parse, steps, story};

#[test]
fn test_figure() {
  let story = story![
    steps![StoryAction::Fig {
      name: "nahida".to_string(),
      url: "./figure.png".to_string(),
      transition: None,
      animation: None,
      location: Location::default(),
      removal: false,
    }],
    steps![StoryAction::Fig {
      name: "nahida".to_string(),
      url: "./figure.png".to_string(),
      transition: Some(Transition {
        ty: TransitionType::FadeIn,
        time: Duration::from_secs(4),
        easing: EasingFunction::ease_out()
      }),
      animation: Some(Animation {
        ty: AnimationType::To {
          location: Location {
            position: Position(0.2, 0.0),
            size: Size::FixedHeight(0.3)
          }
        },
        time: Duration::from_secs(20),
        easing: EasingFunction::ease_in_out()
      }),
      location: Location {
        position: Position(0.7, 1.0),
        size: Size::Fixed(0.3, 0.2)
      },
      removal: false,
    }],
    steps![StoryAction::Fig {
      name: "nahida".to_string(),
      url: "./figure.png".to_string(),
      transition: Some(Transition {
        ty: TransitionType::ConicOut,
        time: Duration::from_secs(4),
        easing: EasingFunction::Linear
      }),
      animation: None,
      location: Location::default(),
      removal: true,
    }]
  ];

  assert_eq!(parse!(include_str!("fig.md")), Ok(story));
}
