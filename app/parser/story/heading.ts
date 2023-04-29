import { Heading } from "mdast";
import { ParseContext } from "../utils";
import { ParseError } from "../error";

export function parseStoryHeading(ctx: ParseContext, heading: Heading) {
  if (!heading.children.length) {
    throw new ParseError(
      "Heading should have at least one child",
      heading.position
    );
  }

  if (heading.children.length > 1) {
    throw new ParseError("Too many children in heading", heading.position);
  }

  const text = heading.children[0];

  if (text.type !== "text") {
    throw new ParseError("Unknown heading element", heading.position);
  }

  const name = text.value.trim();

  ctx.name = ctx.cache(name);
}
