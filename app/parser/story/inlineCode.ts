import { InlineCode } from "mdast";
import { StoryContext } from "../utils";

export function parseStoryInlineCode(
  ctx: StoryContext,
  inlineCode: InlineCode
) {
  ctx.append(inlineCode.value.trim());
}
