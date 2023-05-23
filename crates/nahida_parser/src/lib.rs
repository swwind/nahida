use anyhow::anyhow;
use nahida_core::story::Story;
use parser::NahidaParser;

mod parser;

#[cfg(test)]
mod tests;

pub fn parse_story(text: &str) -> anyhow::Result<Story> {
  let story = NahidaParser::default()
    .parse_text(text)
    .map_err(|err| anyhow!("failed to parse: {err:?}"))?;

  Ok(story)
}
