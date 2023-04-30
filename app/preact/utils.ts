import { StoryAnimation, animate } from "./animate";

function parseAnimation(animation: string, duration: number) {
  const animations = animation
    .split(" ")
    .filter((x) => x.length > 0)
    .filter((animation) => {
      // override duration
      if (animation.startsWith("duration-")) {
        duration = +animation.slice(9);
        return false;
      }
      return true;
    });

  return [animations, duration] as const;
}

/**
 * Animate `fade-in`, `fade-out` animations
 */
export function animateBackground(div: HTMLDivElement, animation: string) {
  const animates: StoryAnimation[] = [];
  const [animations, duration] = parseAnimation(animation, 1000);

  for (const animation of animations) {
    switch (animation) {
      case "fade-in":
        animates.push(
          div.animate({ opacity: [0, 1] }, { duration, fill: "forwards" })
        );
        break;
      case "fade-out":
        animates.push(
          div.animate({ opacity: [1, 0] }, { duration, fill: "forwards" })
        );
        break;
      case "conic-in":
        animates.push(
          animate((progress) => {
            const a = progress * 1.1 - 0.1;
            const b = progress * 1.1;
            setMask(
              div,
              `conic-gradient(white ${a * 100}%, transparent ${b * 100}%)`,
              "100%"
            );
          }, duration)
        );
        break;
      case "conic-out":
        animates.push(
          animate((progress) => {
            const a = progress * 1.1 - 0.1;
            const b = progress * 1.1;
            setMask(
              div,
              `conic-gradient(transparent ${a * 100}%, white ${b * 100}%)`,
              "100%"
            );
          }, duration)
        );
        break;
      case "blinds-in":
        animates.push(
          animate((progress) => {
            console.log("in", progress);
            const a = progress * 1.5 - 0.5;
            const b = progress * 1.5;
            setMask(
              div,
              `linear-gradient(to right, white ${a * 100}%, transparent ${
                b * 100
              }%)`,
              "5%"
            );
          }, duration)
        );
        break;
      case "blinds-out":
        animates.push(
          animate((progress) => {
            console.log("out", progress);
            const a = progress * 1.5 - 0.5;
            const b = progress * 1.5;
            setMask(
              div,
              `linear-gradient(to right, transparent ${a * 100}%, white ${
                b * 100
              }%)`,
              "5%"
            );
          }, duration)
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
  const [animations, duration] = parseAnimation(animation, 60000);

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
    animates.push(
      div.animate(
        { backgroundPosition: [from, to] },
        { duration, fill: "forwards" }
      )
    );
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

export function setMask(elem: HTMLElement, image: string, size: string) {
  elem.style.maskImage = image;
  elem.style.maskSize = size;

  // fix for chrome 1+
  elem.style.webkitMaskImage = image;
  elem.style.webkitMaskSize = size;
}
