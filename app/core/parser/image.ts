import { Image } from "mdast";
import { ParseContext } from ".";
import { ParseError } from "./error";

export function parseStoryImage(ctx: ParseContext, image: Image) {
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
        // ![bgm](#play)
        case "#play":
          ctx.append("ctx.audio.bgm.play();");
          return;
        // ![bgm](#pause)
        case "#pause":
          ctx.append("ctx.audio.bgm.pause();");
          return;
        // ![bgm](#mute)
        case "#mute":
          ctx.append("ctx.audio.bgm.mute();");
          return;
        // ![bgm](#unmute)
        case "#unmute":
          ctx.append("ctx.audio.bgm.unmute();");
          return;
        // ![bgm](#fade-in "1000")
        case "#fade-in":
          if (image.title) {
            ctx.append(`ctx.audio.bgm.fadeIn(${image.title});`);
          } else {
            ctx.append(`ctx.audio.bgm.fadeIn();`);
          }
          return;
        // ![bgm](#fade-out "1000")
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
    ctx.yield({ type: "bgm", url });
    return;
  }

  if (alt.includes("sfx")) {
    const url = ctx.import(image.url + "?url", "audio");
    ctx.yield({ type: "sfx", url });
    return;
  }

  if (alt.includes("console")) {
    switch (image.url) {
      // ![console](#show)
      case "#show":
        ctx.yield({ type: "console", visible: true });
        return;
      // ![console](#hide)
      case "#hide":
        ctx.yield({ type: "console", visible: false });
        return;
      // ![console](#wait "1000")
      case "#wait":
        ctx.yield({ type: "wait", time: image.title ? +image.title : 1000 });
        return;
      default:
        throw new ParseError(
          `Unknown console operation: \`${image.url}\``,
          image.position
        );
    }
  }

  if (alt.includes("fig")) {
    if (image.url.startsWith("#")) {
      switch (image.url) {
        case "#remove":
          if (!image.title) {
            throw new ParseError("No figure name", image.position);
          }
          ctx.yield({
            type: "remove-figure",
            identity: image.title,
          });
          return;
        default:
          throw new ParseError(
            `Unknown figure operation: ${image.url}`,
            image.position
          );
      }
    }

    const title = (image.title || "").split(" ").filter((x) => x.length > 0);
    if (!title.length) {
      throw new ParseError("No figure name", image.position);
    }

    const identity = title.shift()!;
    let slashIndex = title.indexOf("/");
    if (slashIndex === -1) slashIndex = title.length;
    const size = title.slice(0, slashIndex).join(" ");
    const position = title.slice(slashIndex + 1).join(" ");
    const url = ctx.import(image.url + "?url", "image");
    ctx.yield({ type: "figure", url, identity, size, position });
    return;
  }

  throw new ParseError("Unknown image", image.position);
}
