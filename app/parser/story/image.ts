import { Image } from "mdast";
import { StoryContext } from "../utils";
import { ParseError } from "../error";

export function parseStoryImage(ctx: StoryContext, image: Image) {
  const alt = (image.alt ?? "").split(" ");
  const title = image.title ?? "";

  if (alt.includes("bg")) {
    const url = ctx.import(image.url + "?url", "image");
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
    const url = ctx.import(image.url + "?url", "image");
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
    const url = ctx.import(image.url + "?url", "audio");
    if (ctx.vocal) {
      throw new ParseError("Multiple vocal track detected", image.position);
    }
    ctx.vocal = url;
    return;
  }

  if (alt.includes("bgm")) {
    if (image.url.startsWith("#")) {
      switch (image.url) {
        case "#play":
          ctx.append("ctx.audio.bgm.play();");
          return;
        case "#pause":
          ctx.append("ctx.audio.bgm.pause();");
          return;
        case "#mute":
          ctx.append("ctx.audio.bgm.mute();");
          return;
        case "#unmute":
          ctx.append("ctx.audio.bgm.unmute();");
          return;
        case "#fade-in":
          if (image.title) {
            ctx.append(`ctx.audio.bgm.fadeIn(${image.title});`);
          } else {
            ctx.append(`ctx.audio.bgm.fadeIn();`);
          }
          return;
        case "#fade-out":
          if (image.title) {
            ctx.append(`ctx.audio.bgm.fadeOut(${image.title});`);
          } else {
            ctx.append(`ctx.audio.bgm.fadeOut();`);
          }
          return;

        default:
          throw new ParseError(
            `Unknown BGM operation: \`${image.url}\``,
            image.position
          );
      }
    }

    const url = ctx.import(image.url + "?url", "audio");
    const animation = image.title ?? "";
    ctx.yield({ type: "bgm", url, animation });
    return;
  }

  if (alt.includes("sfx")) {
    const url = ctx.import(image.url + "?url", "audio");
    const animation = image.title ?? "";
    ctx.yield({ type: "sfx", url, animation });
    return;
  }

  if (alt.includes("console")) {
    switch (image.url) {
      case "#show":
        ctx.append(`ctx.console.show();`);
        return;
      case "#hide":
        ctx.append(`ctx.console.hide();`);
        return;
      default:
        throw new ParseError(
          `Unknown console operation: \`${image.url}\``,
          image.position
        );
    }
  }

  if (alt.some((v) => v.startsWith("+") || v.startsWith("-"))) {
    const char = alt.find((v) => v.startsWith("+") || v.startsWith("-"))!;
    const url = ctx.import(image.url + "?url", "image");
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
