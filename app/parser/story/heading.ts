import { Heading } from "mdast";
import { StoryContext } from "../utils";

export const STORY_NAME = "name";

export function parseStoryHeading(ctx: StoryContext, heading: Heading) {
  if (!heading.children.length) {
    ctx.register.delete(STORY_NAME);
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

  if (!name) {
    ctx.register.delete(STORY_NAME);
    return;
  }

  const varname = ctx.importName(name);
  ctx.register.set(STORY_NAME, varname);
}
