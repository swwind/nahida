import { Text } from "mdast";
import { StoryContext } from "../utils";

export function parseStoryText(ctx: StoryContext, text: Text) {
  const value = text.value.trim();

  if (!value) {
    return;
  }

  const name = ctx.name || "";
  const vocal = ctx.vocal || "";

  ctx.yield({ type: "text", text: value, name, vocal });

  ctx.vocal = null;
}
