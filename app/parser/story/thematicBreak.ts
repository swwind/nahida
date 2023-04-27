import { ThematicBreak } from "mdast";
import { StoryContext } from "../utils";

export function parseStoryThematicBreak(
  ctx: StoryContext,
  _child: ThematicBreak
) {
  ctx.name = null;
}
