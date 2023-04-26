export async function preloadBackground(
  url: string,
  parentAnimation: string,
  imageAnimation: string
) {
  const div = document.createElement("div");
  div.className = transformBackgroundClassName(parentAnimation);

  const image = await preloadImage(url);
  image.className = transformImageClassName(imageAnimation);

  div.appendChild(image);
  return div;
}

export function preloadImage(url: string) {
  const image = new Image();

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);

    image.src = url;
  });
}

export function transformBackgroundClassName(className: string) {
  const classList = className.split(" ").filter((x) => x.length > 0);

  if (
    !classList.some((x) => x.startsWith("fill-mode-")) &&
    !classList.includes("forwards") &&
    !classList.includes("backwards")
  ) {
    classList.push("forwards");
  }

  if (
    !classList.includes("animate-in") &&
    classList.some((x) => x.endsWith("-in") || x.startsWith("slide-in"))
  ) {
    classList.push("animate-in");
  }

  if (
    !classList.includes("animate-out") &&
    classList.some((x) => x.endsWith("-out") || x.startsWith("slide-out"))
  ) {
    classList.push("animate-out");
  }

  return classList
    .map((x) => {
      switch (x) {
        case "forwards":
          return "fill-mode-forwards";
        case "backwards":
          return "fill-mode-backwords";

        default:
          return x;
      }
    })
    .join(" ");
}

export function transformImageClassName(className: string) {
  return className
    .split(" ")
    .map((x) => {
      switch (x) {
        case "cover":
          return "object-cover";
        case "contain":
          return "object-contain";
        case "fill":
          return "object-fill";

        case "left":
          return "object-left";
        case "left-top":
        case "top-left":
          return "object-left-top";
        case "left-bottom":
        case "bottom-left":
          return "object-left-bottom";
        case "right":
          return "object-right";
        case "right-top":
        case "top-right":
          return "object-right-top";
        case "right-bottom":
        case "bottom-right":
          return "object-right-bottom";
        case "top":
          return "object-top";
        case "bottom":
          return "object-bottom";
        case "center":
          return "object-center";

        case "to-top":
          return "animate-to-top";
        case "to-left":
          return "animate-to-left";
        case "to-right":
          return "animate-to-right";
        case "to-bottom":
          return "animate-to-bottom";

        default:
          return x;
      }
    })
    .join(" ");
}

export async function waitAnimationDone(doc: Element) {
  const animations = doc.getAnimations();
  await Promise.all(animations.map((anime) => anime.finished));
}
