import { Image } from "mdast";
import { StoryContext } from "../utils";

export const STORY_VOCAL = "vocal";

export function parseStoryImage(ctx: StoryContext, image: Image) {
  const alt = (image.alt ?? "").split(" ");
  const title = image.title ?? "";

  if (alt.includes("bg")) {
    const url = ctx.importUrl(image.url + "?url");
    const deco = alt.filter((x) => x !== "bg").join(" ");
    ctx.yield({
      type: "background",
      url,
      parentAnimation: deco,
      imageAnimation: title,
    });
    return;
  }

  if (alt.includes("fg")) {
    const url = ctx.importUrl(image.url + "?url");
    const deco = alt.filter((x) => x !== "fg").join(" ");
    ctx.yield({
      type: "foreground",
      url,
      parentAnimation: deco,
      imageAnimation: title,
    });
    return;
  }

  if (alt.includes("v")) {
    const url = ctx.importUrl(image.url + "?url");
    if (ctx.register.has(STORY_VOCAL)) {
      throw new Error(
        "Multiple vocal detected at line " + image.position?.start.line
      );
    }
    ctx.register.set(STORY_VOCAL, url);
    return;
  }

  if (alt.includes("bgm")) {
    const url = ctx.importUrl(image.url + "?url");
    ctx.yield({ type: "bgm", url });
    return;
  }

  if (alt.includes("sfx")) {
    const url = ctx.importUrl(image.url + "?url");
    ctx.yield({ type: "sfx", url });
    return;
  }

  if (alt.some((v) => v.startsWith("+") || v.startsWith("-"))) {
    const char = alt.find((v) => v.startsWith("+") || v.startsWith("-"))!;
    const identity = char.slice(1);
    if (char.startsWith("-")) {
      ctx.yield({ type: "remove-charactor", identity });
    } else {
      const url = ctx.importUrl(image.url + "?url");
      const animation = alt.filter((x) => x !== char).join(" ");
      ctx.yield({ type: "charactor", url, identity, animation });
    }
    return;
  }

  throw new Error("Unknown image at line " + image.position?.start.line);
}
