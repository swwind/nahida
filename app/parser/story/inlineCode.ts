import { InlineCode } from "mdast";
import { ParseContext } from "../utils";

export function parseStoryInlineCode(
  ctx: ParseContext,
  inlineCode: InlineCode
) {
  ctx.append(inlineCode.value.trim());
}
