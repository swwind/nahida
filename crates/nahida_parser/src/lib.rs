use anyhow::anyhow;
use nahida_core::story::Story;
use parser::NahidaParser;

mod image;
mod parser;

#[cfg(test)]
mod tests;

pub fn parse_story(text: &str) -> anyhow::Result<Story> {
  let parser = NahidaParser;
  let story = parser
    .parse_text(text)
    .map_err(|err| anyhow!("failed to parse: {err:?}"))?;

  Ok(story)
}

// pub fn parse_from_url(url: Url) -> anyhow::Result<Story> {
//   match url.scheme() {
//     "file" => {
//       let path = decode(url.path()).unwrap().to_string();
//       let content = fs::read_to_string(path).unwrap();

//       let story = NahidaParser::new(url.clone())
//         .parse_text(&content)
//         .map_err(|err| anyhow!("failed to parse {url}: {err:?}"))?;

//       Ok(story)
//     }
//     _ => todo!(),
//   }
// }

// pub fn parse_from_entry_point(entrance: &Url) -> anyhow::Result<HashMap<Url, Story>> {
//   let mut queue = VecDeque::new();
//   queue.push_back(entrance.clone());

//   let mut set = HashSet::new();
//   let mut map = HashMap::new();

//   while let Some(target) = queue.pop_front() {
//     info!("parsing {target}");
//     let story = parse_from_url(target.clone())?;

//     for step in &story.steps {
//       for action in &step.actions {
//         match action {
//           StoryAction::Bg { url, .. } | StoryAction::Fig { url, .. } => {
//             if !set.contains(url) {
//               set.insert(url.clone());
//               info!("image asset: {url}");
//             }
//           }
//           StoryAction::Bgm { url } | StoryAction::Sfx { url } => {
//             if !set.contains(url) {
//               set.insert(url.clone());
//               info!("audio asset: {url}");
//             }
//           }
//           StoryAction::Navigate { url, .. } => {
//             if !set.contains(url) {
//               set.insert(url.clone());
//               queue.push_back(url.clone());
//             }
//           }
//           _ => {}
//         }
//       }
//     }

//     map.insert(target, story);
//   }

//   Ok(map)
// }
