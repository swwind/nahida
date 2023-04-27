import { Link } from "mdast";
import { StoryContext } from "../utils";

export function parseStoryLink(ctx: StoryContext, link: Link) {
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

  throw new Error("Invalid link at line " + link.position?.start.line);
}
