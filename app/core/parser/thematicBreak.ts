import { ThematicBreak } from "mdast";
import { ParseContext } from ".";

export function parseStoryThematicBreak(
  ctx: ParseContext,
  _child: ThematicBreak
) {
  ctx.name = null;
}
