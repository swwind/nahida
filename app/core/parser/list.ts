import { List } from "mdast";
import { ParseContext } from ".";
import { parseStoryContents } from "./contents";
import { ParseError } from "./error";

export function parseStoryList(ctx: ParseContext, list: List) {
  const ordered = list.ordered || false;

  if (ordered) {
    // ordered list -> switch case
    ctx.append(`switch (ctx.selection) {`);

    for (let index = 0; index < list.children.length; ++index) {
      ctx.append(`case ${index}: {`);

      parseStoryContents(ctx, list.children[index].children);

      ctx.append(`break;`);
      ctx.append(`}`);
    }

    ctx.append(`}`);
  } else {
    // unordered list -> select
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

      throw new ParseError("Invalid option in selection list", item.position);
    }

    ctx.yield({ type: "select", options: options });
  }
}
