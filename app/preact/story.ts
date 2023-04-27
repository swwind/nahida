import type { Context, Story } from "../parser";

import { MutableRef, useEffect, useMemo, useRef } from "preact/hooks";
import { ReadonlySignal } from "@preact/signals";

import {
  preload,
  preloadBackground,
  transformBackgroundClassName,
  transformImageClassName,
} from "./utils";
import { bgUrl, bgmAudio, name, show, selections } from "./signals";
import { CallbackStack } from "./callback-stack";

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
   * Current speaking character name
   */
  name: ReadonlySignal<string>;
  /**
   * Current selection
   */
  selections: ReadonlySignal<string[] | null>;

  /**
   * Step function, skip current animation or jump to next
   */
  step: () => void;
  /**
   * Make the selection
   */
  select: (data: number) => void;
}

export function useMarkdownStory(story: Story): MarkdownStoryController {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const stack = useMemo(() => new CallbackStack(), []);

  useEffect(() => {
    const ctx: Context = {
      selection: 0,
      console: {
        show: () => (show.value = true),
        hide: () => (show.value = false),
      },
      bgm: {
        play: () => bgmAudio.value?.play(),
        pause: () => bgmAudio.value?.pause(),
        mute: () => bgmAudio.value && (bgmAudio.value.muted = true),
        unmute: () => bgmAudio.value && (bgmAudio.value.muted = false),
      },
      preload,
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

            if (bgUrl.value === action.url) {
              // if background not change, just replay animations
              const background = backgroundRef.current
                .firstChild as HTMLDivElement;
              const image = background.firstChild as HTMLImageElement;

              background.className = transformBackgroundClassName(
                action.parentAnimation
              );
              image.className = transformImageClassName(action.imageAnimation);

              await stack.waitAnimations(background);
            } else {
              // if background changes, then add a new element
              const background = await preloadBackground(
                action.url,
                action.parentAnimation,
                action.imageAnimation
              );

              backgroundRef.current.appendChild(background);
              bgUrl.value = action.url;

              await stack.waitAnimations(background);
              // remove old backgrounds when animations done
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
              // remove old text
              while (textRef.current.firstChild) {
                textRef.current.removeChild(textRef.current.firstChild);
              }
              // add new text
              const span = document.createElement("span");
              span.textContent = action.text;
              span.setAttribute("data-text", action.text);
              span.style.animationDuration = `${action.text.length * 25}ms`;
              textRef.current.appendChild(span);
              await stack.waitAnimations(span);
            }

            await stack.waitClick();
            break;
          }
          case "select": {
            selections.value = action.options;
            await stack.waitSelection((selection) => {
              ctx.selection = selection;
            });
            selections.value = null;
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
    selections,

    step: () => stack.step(),
    select: (data) => stack.select(data),
  };
}
