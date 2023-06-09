use bevy::{
  asset::{AssetLoader, LoadedAsset},
  prelude::*,
  reflect::TypeUuid,
};
use nahida_core::story::Story;
use nahida_parser::parse_story;

pub struct StoryAssetPlugin;

impl Plugin for StoryAssetPlugin {
  fn build(&self, app: &mut App) {
    app
      .add_asset::<StoryAsset>()
      .init_asset_loader::<StoryAssetLoader>();
  }
}

#[derive(Debug, TypeUuid)]
#[uuid = "658ba4c9-e7b9-4fe0-80d6-1be39af5eba1"]
pub struct StoryAsset {
  pub story: Story,
}

#[derive(Default)]
pub struct StoryAssetLoader;

impl AssetLoader for StoryAssetLoader {
  fn load<'a>(
    &'a self,
    bytes: &'a [u8],
    load_context: &'a mut bevy::asset::LoadContext,
  ) -> bevy::utils::BoxedFuture<'a, Result<(), bevy::asset::Error>> {
    Box::pin(async move {
      let text = String::from_utf8_lossy(bytes);
      let story = parse_story(&text)?;
      load_context.set_default_asset(LoadedAsset::new(StoryAsset { story }));
      Ok(())
    })
  }

  fn extensions(&self) -> &[&str] {
    &["md"]
  }
}
