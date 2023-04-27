export async function preloadBackground(
  url: string,
  parentAnimation: string,
  imageAnimation: string
) {
  const div = document.createElement("div");
  animateBackground(div, parentAnimation);

  const image = await preloadImage(url);
  animateImage(image, imageAnimation);

  div.appendChild(image);
  return div;
}

function parseAnimation(
  animation: string,
  defaultConfig: KeyframeAnimationOptions
) {
  const animations = animation.split(" ").filter((x) => x.length > 0);

  animations.forEach((animation) => {
    // override duration
    if (animation.startsWith("duration-")) {
      defaultConfig.duration = +animation.slice(9);
    }
    // override fill-mode
    if (animation.startsWith("fill-mode-")) {
      defaultConfig.fill = animation.slice(10) as FillMode;
    }
  });

  return [animations, defaultConfig] as const;
}

export function animateBackground(div: HTMLDivElement, animation: string) {
  const [animations, configs] = parseAnimation(animation, {
    duration: 1000,
    iterations: 1,
    fill: "forwards",
  });

  for (const animation of animations) {
    switch (animation) {
      case "fade-in":
        div.animate([{ opacity: 0 }, { opacity: 1 }], configs);
        break;
      case "fade-out":
        div.animate([{ opacity: 1 }, { opacity: 0 }], configs);
        break;

      default:
        if (!div.classList.contains(animation)) {
          div.classList.add(animation);
        }
    }
  }
}

export function animateImage(image: HTMLImageElement, animation: string) {
  const [animations, configs] = parseAnimation(animation, {
    duration: 60000,
    iterations: 1,
    fill: "forwards",
  });

  const fromPosition = ["center", "center"];
  const toPosition = ["center", "center"];

  for (const animation of animations) {
    switch (animation) {
      case "cover":
      case "contain":
      case "fill":
        image.style.objectFit = animation;
        break;

      case "left":
      case "right":
        fromPosition[0] = animation;
        break;
      case "top":
      case "bottom":
        fromPosition[1] = animation;
        break;
      case "center":
        fromPosition[0] = animation;
        fromPosition[1] = animation;
        break;

      case "to-left":
      case "to-right":
        toPosition[0] = animation.slice(3);
        break;
      case "to-top":
      case "to-bottom":
        toPosition[1] = animation.slice(3);
        break;
      case "to-center":
        toPosition[0] = animation.slice(3);
        toPosition[1] = animation.slice(3);
        break;

      default:
        if (!image.classList.contains(animation)) {
          image.classList.add(animation);
        }
    }
  }

  const from = fromPosition.join(" ");
  const to = toPosition.join(" ");

  if (from === to) {
    image.style.objectPosition = from;
  } else {
    image.animate({ objectPosition: [from, to] }, configs);
  }
}

export function preloadImage(url: string) {
  const image = new Image();

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);

    image.src = url;
  });
}

export function preload(url: string, as: string) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
}
