import type { Context, Story } from "../parser";

import { MutableRef, useCallback, useEffect, useRef } from "preact/hooks";
import { ReadonlySignal, useSignal } from "@preact/signals";

import {
  preloadBackground,
  transformBackgroundClassName,
  transformImageClassName,
  waitAnimationDone,
} from "./utils";

export interface MarkdownStoryController {
  /**
   * HTML element hooks
   */
  refs: {
    background: MutableRef<HTMLDivElement | null>;
    text: MutableRef<HTMLDivElement | null>;
  };

  /**
   * Whether console is visible or not
   *
   * changing this does not block main thread
   */
  show: ReadonlySignal<boolean>;
  /**
   * Currect speaking character name
   */
  name: ReadonlySignal<string>;

  /**
   * Step function, skip current animation or jump to next
   */
  step: () => void;
}

export function useMarkdownStory(story: Story): MarkdownStoryController {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const backgroundUrl = useSignal("");
  const name = useSignal("");
  const show = useSignal(true);

  const bgmAudio = useSignal<HTMLAudioElement | null>(null);

  const clickResolve = useSignal<(() => void)[]>([]);

  const step = useCallback(() => {
    const resolve = clickResolve.value.pop();
    if (resolve) {
      resolve();
    }
  }, []);

  useEffect(() => {
    function waitClick() {
      return new Promise<void>((resolve) => {
        clickResolve.value.push(resolve);
      });
    }

    const ctx: Context = {
      selection: 0,
      console: {
        show: () => (show.value = true),
        hide: () => (show.value = false),
      },
      preload: (url, as) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = url;
        link.as = as;
        document.head.appendChild(link);
      },
    };

    async function start() {
      const generator = story(ctx);

      for (const action of generator) {
        console.log(action);
        switch (action.type) {
          case "background": {
            if (!backgroundRef.current) {
              throw new Error("Background element missing");
            }

            if (backgroundUrl.value === action.url) {
              const background = backgroundRef.current
                .firstChild as HTMLDivElement;
              const image = background.firstChild as HTMLImageElement;

              background.className = transformBackgroundClassName(
                action.parentAnimation
              );
              image.className = transformImageClassName(action.imageAnimation);

              await waitAnimationDone(background);
            } else {
              const background = await preloadBackground(
                action.url,
                action.parentAnimation,
                action.imageAnimation
              );

              backgroundRef.current.appendChild(background);
              backgroundUrl.value = action.url;

              await waitAnimationDone(background);
              // remove old backgrounds
              if (
                backgroundRef.current.firstChild &&
                backgroundRef.current.firstChild !== background
              ) {
                backgroundRef.current.removeChild(
                  backgroundRef.current.firstChild
                );
              }
            }

            break;
          }
          case "foreground": {
            // TODO
            break;
          }
          case "character": {
            // TODO
            break;
          }
          case "remove-character": {
            // TODO
            break;
          }
          case "text": {
            name.value = action.name;

            if (action.vocal) {
              const vocal = new Audio(action.vocal);
              vocal.addEventListener("canplay", () => vocal.play());
            }

            if (textRef.current) {
              while (textRef.current.firstChild) {
                textRef.current.removeChild(textRef.current.firstChild);
              }
              const span = document.createElement("span");
              span.textContent = action.text;
              span.setAttribute("data-text", action.text);
              span.style.animationDuration = `${action.text.length * 25}ms`;
              textRef.current.appendChild(span);
            }

            await waitClick();
            break;
          }
          case "select": {
            // TODO
            break;
          }
          case "bgm": {
            const audio = new Audio(action.url);
            audio.loop = true;
            audio.addEventListener("canplay", () => {
              bgmAudio.value?.pause();
              bgmAudio.value = audio;
              bgmAudio.value.play();
            });

            break;
          }
          case "sfx": {
            const audio = new Audio(action.url);
            audio.addEventListener("canplay", () => audio.play());
            break;
          }
        }
      }
    }

    start();
  }, []);

  return {
    refs: {
      background: backgroundRef,
      text: textRef,
    },
    show,
    name,
    step,
  };
}
