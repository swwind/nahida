import { Link } from "mdast";
import { ParseContext } from ".";
import { ParseError } from "./error";

export function parseStoryLink(ctx: ParseContext, link: Link) {
  if (link.children.length === 1 && link.children[0].type === "text") {
    const attr = link.children[0].value.split(" ");

    // removes first \0
    const story = ctx.import(link.url).slice(1);
    ctx.append(`yield *${story}(ctx);`);

    if (attr.includes("goto")) {
      return;
    }

    if (attr.includes("end")) {
      ctx.append(`return;`);
      return;
    }
  }

  throw new ParseError("Invalid link", link.position);
}
