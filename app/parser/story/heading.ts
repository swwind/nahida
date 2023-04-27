import { Heading } from "mdast";
import { StoryContext } from "../utils";

export function parseStoryHeading(ctx: StoryContext, heading: Heading) {
  if (!heading.children.length) {
    ctx.name = null;
    return;
  }

  if (heading.children.length > 1) {
    throw new Error(
      "Too many children in heading at line " + heading.position?.start.line
    );
  }

  const text = heading.children[0];

  if (text.type !== "text") {
    throw new Error("Unknown heading at line " + heading.position?.start.line);
  }

  const name = text.value.trim();

  ctx.name = ctx.cache(name);
}
