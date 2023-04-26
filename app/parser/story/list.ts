import { List } from "mdast";
import { StoryContext } from "../utils";
import { parseStoryContents } from "./contents";

export function parseStoryList(ctx: StoryContext, list: List) {
  const ordered = list.ordered || false;

  if (ordered) {
    ctx.append(`switch (ctx.selection) {`);

    for (let index = 0; index < list.children.length; ++index) {
      ctx.append(`case ${index}: {`);

      parseStoryContents(ctx, list.children[index].children);

      ctx.append(`break;`);
      ctx.append(`}`);
    }

    ctx.append(`}`);
  } else {
    const options: string[] = [];

    for (const item of list.children) {
      if (
        item.children.length === 1 &&
        item.children[0].type === "paragraph" &&
        item.children[0].children.length === 1 &&
        item.children[0].children[0].type === "text"
      ) {
        options.push(item.children[0].children[0].value.trim());
        continue;
      }

      throw new Error(
        "Invalid option in selection list at line " + item.position?.start.line
      );
    }

    ctx.yield({ type: "select", options: options });
  }
}
