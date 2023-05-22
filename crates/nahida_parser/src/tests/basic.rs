use nahida_core::story::StoryAction;

use crate::{steps, story, NahidaParser};

#[test]
fn test_basic() {
  let story = story![
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
  ];

  assert_eq!(
    NahidaParser::parse_from_text(include_str!("basic.md")).unwrap(),
    story
  );
}
