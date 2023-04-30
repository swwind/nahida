import { StoryAnimation, animate } from "./animate";

function parseAnimation(
  animation: string,
  defaultConfig: KeyframeAnimationOptions
) {
  const animations = animation
    .split(" ")
    .filter((x) => x.length > 0)
    .filter((animation) => {
      // override duration
      if (animation.startsWith("duration-")) {
        defaultConfig.duration = +animation.slice(9);
        return false;
      }
      // override fill-mode
      if (animation.startsWith("fill-mode-")) {
        defaultConfig.fill = animation.slice(10) as FillMode;
        return false;
      }
      return true;
    });

  return [animations, defaultConfig] as const;
}

/**
 * Animate `fade-in`, `fade-out` animations
 */
export function animateBackground(div: HTMLDivElement, animation: string) {
  const animates: StoryAnimation[] = [];
  const [animations, configs] = parseAnimation(animation, {
    duration: 1000,
    iterations: 1,
    fill: "forwards",
  });

  for (const animation of animations) {
    switch (animation) {
      case "fade-in":
        animates.push(div.animate([{ opacity: 0 }, { opacity: 1 }], configs));
        break;
      case "fade-out":
        animates.push(div.animate([{ opacity: 1 }, { opacity: 0 }], configs));
        break;
      case "conic-in":
        animates.push(
          animate((progress) => {
            const a = progress * 1.1 - 0.1;
            const b = progress * 1.1;
            div.style.maskImage = `conic-gradient(white ${
              a * 100
            }%, transparent ${b * 100}%)`;
          }, configs.duration as number)
        );
        break;
      case "conic-out":
        animates.push(
          animate((progress) => {
            const a = progress * 1.1 - 0.1;
            const b = progress * 1.1;
            div.style.maskImage = `conic-gradient(transparent ${
              a * 100
            }%, white ${b * 100}%)`;
          }, configs.duration as number)
        );
        break;

      default:
        console.warn("unknown animation: " + animation);
    }
  }

  return animates;
}

/**
 * Animate `to-bottom`, `to-top` animations
 */
export function animateImage(div: HTMLDivElement, animation: string) {
  const animates: StoryAnimation[] = [];
  const [animations, configs] = parseAnimation(animation, {
    duration: 60000,
    iterations: 1,
    fill: "forwards",
  });

  let fromPosition = [];
  let toPosition = [];
  let hasAnimation = false;

  for (const animation of animations) {
    switch (animation) {
      case "left":
      case "right":
      case "top":
      case "bottom":
      case "center":
        fromPosition.push(animation);
        break;

      case "to-left":
      case "to-right":
      case "to-top":
      case "to-bottom":
      case "to-center":
        hasAnimation = true;
        toPosition.push(animation.slice(3));
        break;

      case "cover":
      case "contain":
      case "fill":
        div.style.backgroundSize = animation;
        break;

      default:
        if (animation.endsWith("%")) {
          div.style.backgroundSize = animation;
          break;
        }

        console.warn("unknown animation: " + animation);
    }
  }

  const from = fromPosition.join(" ");
  const to = toPosition.join(" ");

  if (hasAnimation && from !== to) {
    animates.push(div.animate({ backgroundPosition: [from, to] }, configs));
  } else {
    div.style.backgroundPosition = from;
  }

  return animates;
}

export function preload(url: string, as: string) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
}
