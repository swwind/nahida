import { ThematicBreak } from "mdast";
import { ParseContext } from "../utils";

export function parseStoryThematicBreak(
  ctx: ParseContext,
  _child: ThematicBreak
) {
  ctx.name = null;
}
