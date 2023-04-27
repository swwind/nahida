import { Image } from "mdast";
import { StoryContext } from "../utils";
import { ParseError } from "../error";

export function parseStoryImage(ctx: StoryContext, image: Image) {
  const alt = (image.alt ?? "").split(" ");
  const title = image.title ?? "";

  if (alt.includes("bg")) {
    const url = ctx.import(image.url + "?url");
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
    const url = ctx.import(image.url + "?url");
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
    const url = ctx.import(image.url + "?url");
    if (ctx.vocal) {
      throw new ParseError("Multiple vocal track detected", image.position);
    }
    ctx.vocal = url;
    return;
  }

  if (alt.includes("bgm")) {
    const url = ctx.import(image.url + "?url");
    ctx.yield({ type: "bgm", url });
    return;
  }

  if (alt.includes("sfx")) {
    const url = ctx.import(image.url + "?url");
    ctx.yield({ type: "sfx", url });
    return;
  }

  if (alt.some((v) => v.startsWith("+") || v.startsWith("-"))) {
    const char = alt.find((v) => v.startsWith("+") || v.startsWith("-"))!;
    const url = ctx.import(image.url + "?url");
    const identity = char.slice(1);
    const parentAnimation = alt
      .filter((x) => !x.startsWith("+") && !x.startsWith("-"))
      .join(" ");
    const imageAnimation = image.title ?? "";

    if (char.startsWith("-")) {
      ctx.yield({
        type: "remove-character",
        url,
        identity,
        parentAnimation,
        imageAnimation,
      });
    } else {
      ctx.yield({
        type: "character",
        url,
        identity,
        parentAnimation,
        imageAnimation,
      });
    }
    return;
  }

  throw new ParseError("Unknown image", image.position);
}
