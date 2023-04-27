import type { Context, Story } from "../parser";

import { MutableRef, useEffect, useMemo, useRef } from "preact/hooks";
import { ReadonlySignal } from "@preact/signals";

import { animateBackground, preload, preloadBackground } from "./utils";
import { bgUrl, bgmAudio, name, show, selections } from "./signals";
import { CallbackStack } from "./callback-stack";
import { animateAudioFadeIn, animateAudioFadeOut, preloadAudio } from "./audio";

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
        fadeIn: (time = 1000) =>
          bgmAudio.value && animateAudioFadeIn(bgmAudio.value, time),
        fadeOut: (time = 1000) =>
          bgmAudio.value && animateAudioFadeOut(bgmAudio.value, time),
      },
      preload,
    };

    async function start() {
      const generator = story(ctx);

      for (const action of generator) {
        console.log(action);
        switch (action.type) {
          case "background": {
            const parent = backgroundRef.current;
            if (!parent) {
              throw new Error("Background element missing");
            }

            if (bgUrl.value === action.url) {
              // if background not change, just replay animations
              const background = parent.firstChild as HTMLDivElement;
              animateBackground(background, action.parentAnimation);

              // FIXME: should not play animation again
              // const image = background.firstChild as HTMLImageElement;
              // animateImage(image, action.imageAnimation);

              await stack.waitAnimations(background);
            } else {
              // if background changes, then add a new element
              const background = await preloadBackground(
                action.url,
                action.parentAnimation,
                action.imageAnimation
              );

              parent.appendChild(background);
              bgUrl.value = action.url;

              await stack.waitAnimations(background);
              // remove old backgrounds when animations done
              if (parent.firstChild && parent.firstChild !== background) {
                parent.removeChild(parent.firstChild);
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
            // load new bgm and play
            const audio = await preloadAudio(action.url);
            bgmAudio.value?.pause();
            bgmAudio.value = audio;

            if (!action.animation.includes("noloop")) {
              audio.loop = true;
            }
            if (action.animation.includes("mute")) {
              audio.muted = true;
            }
            audio.play();

            break;
          }
          case "sfx": {
            // play the audio without blocking
            preloadAudio(action.url).then((audio) => {
              audio.play();
            });
            break;
          }
        }
      }
    }

    start();

    return () => {
      bgmAudio.value?.pause();

      name.value = "";
      show.value = true;
      bgmAudio.value = null;
      bgUrl.value = "";
      selections.value = null;
    };
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