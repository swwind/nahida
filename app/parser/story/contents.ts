import { BlockContent, Content, DefinitionContent } from "mdast";
import { StoryContext } from "../utils";
import { parseStoryHeading } from "./heading";
import { parseStoryHtml } from "./html";
import { parseStoryCode } from "./code";
import { parseStoryList } from "./list";
import { parseStoryText } from "./text";
import { parseStoryImage } from "./image";
import { parseStoryLink } from "./link";
import { parseStoryInlineCode } from "./inlineCode";

export function parseStoryContents(
  ctx: StoryContext,
  contents: (BlockContent | Content | DefinitionContent)[]
) {
  for (const child of contents) {
    if (child.type === "heading") {
      parseStoryHeading(ctx, child);
      continue;
    }

    if (child.type === "paragraph") {
      parseStoryContents(ctx, child.children);
      continue;
    }

    if (child.type === "html") {
      parseStoryHtml(ctx, child);
      continue;
    }

    if (child.type === "code") {
      parseStoryCode(ctx, child);
      continue;
    }

    if (child.type === "list") {
      parseStoryList(ctx, child);
      continue;
    }

    if (child.type === "text") {
      parseStoryText(ctx, child);
      continue;
    }

    if (child.type === "image") {
      parseStoryImage(ctx, child);
      continue;
    }

    if (child.type === "link") {
      parseStoryLink(ctx, child);
      continue;
    }

    if (child.type === "inlineCode") {
      parseStoryInlineCode(ctx, child);
      continue;
    }

    throw new Error("Unknown content at line " + child.position?.start.line);
  }
}
