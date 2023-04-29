import { Code } from "mdast";
import { ParseContext } from "../utils";

export function parseStoryCode(ctx: ParseContext, code: Code) {
  ctx.append(code.value.trim());
}
