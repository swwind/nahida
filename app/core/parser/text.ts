import { Text } from "mdast";
import { ParseContext } from ".";

export function parseStoryText(ctx: ParseContext, text: Text) {
  const value = text.value.trim();

  if (!value) {
    return;
  }

  const name = ctx.name || "";
  const vocal = ctx.vocal || "";

  ctx.yield({ type: "text", text: value, name, vocal });

  ctx.vocal = null;
}
