import { Link } from "mdast";
import { StoryContext } from "../utils";

export function parseStoryLink(ctx: StoryContext, link: Link) {
  if (link.children.length === 1 && link.children[0].type === "text") {
    const attr = link.children[0].value.split(" ");

    if (attr.includes("goto")) {
      const story = ctx.importUrl(link.url);
      ctx.append(`yield *${story}(ctx);`);
      return;
    }

    if (attr.includes("end")) {
      const story = ctx.importUrl(link.url);
      ctx.append(`yield *${story}(ctx);`);
      ctx.append(`return;`);
      return;
    }
  }

  throw new Error("Invalid link at line " + link.position?.start.line);
}
