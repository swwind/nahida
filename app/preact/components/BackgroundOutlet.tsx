import { useRef } from "preact/hooks";
import { useMarkdownStory } from "../use/useMarkdownStory";
import { useSignal, useSignalEffect } from "@preact/signals";
import { animateBackground } from "../utils";
import { animateImage } from "../utils";

/**
 * ```jsx
 * <div class="background">
 *   <div style="background-image: xxx"></div>
 *   <div style="background-image: xxx"></div>
 * </div>
 * ```
 */
export function BackgroundOutlet() {
  const story = useMarkdownStory();
  const backgroundRef = useRef<HTMLDivElement>(null);

  const currentUrl = useSignal("");
  const currentBackground = useSignal<HTMLDivElement | null>(null);

  useSignalEffect(() => {
    const url = story.background.url.value;
    const parentAnimation = story.background.parentAnimation.value;
    const imageAnimation = story.background.imageAnimation.value;

    const div = backgroundRef.current!;

    // if background not change, just replay animations
    if (currentUrl.peek() === url) {
      const background = currentBackground.peek();

      if (background) {
        const animations = animateBackground(background, parentAnimation);
        story.addAnimations(animations);
      }
    }

    // if background changes, then add a new element
    else if (url) {
      const background = document.createElement("div");
      background.style.backgroundImage = `url(${url})`;

      const animations = animateBackground(background, parentAnimation);
      animateImage(background, imageAnimation);

      div.appendChild(background);

      story.addAnimations(animations).then(() => {
        // remove old backgrounds when animations done
        while (div.firstChild && div.firstChild !== background) {
          div.removeChild(div.firstChild);
        }
      });

      currentBackground.value = background;
    }

    // or target is empty, remove current image instantly
    else {
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }
      currentBackground.value = null;
    }

    currentUrl.value = url;
  });

  return <div class="background" ref={backgroundRef}></div>;
}
