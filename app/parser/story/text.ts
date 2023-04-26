import { Text } from "mdast";
import { STORY_NAME } from "./heading";
import { STORY_VOCAL } from "./image";
import { StoryContext } from "../utils";

export function parseStoryText(ctx: StoryContext, text: Text) {
  const value = text.value.trim();

  if (!value) {
    return;
  }

  const name = ctx.register.get(STORY_NAME) || "";
  const vocal = ctx.register.get(STORY_VOCAL) || "";

  ctx.yield({ type: "text", text: value, name, vocal });

  ctx.register.delete(STORY_VOCAL);
}
