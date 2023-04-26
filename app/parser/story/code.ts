import { Code } from "mdast";
import { StoryContext } from "../utils";

export function parseStoryCode(ctx: StoryContext, code: Code) {
  ctx.append(code.value.trim());
}
