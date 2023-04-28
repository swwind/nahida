import { ComponentChildren } from "preact";
import { MarkdownStoryContext } from "../use/useMarkdownStory";
import { useSignal } from "@preact/signals";
import { Story, StoryContext } from "../../parser";
import { useAudioController } from "../use/useAudioContext";
import { animateBackground, preload, preloadBackground } from "../utils";
import { useMemo, useRef } from "preact/hooks";
import { CallbackStack } from "../callback-stack";

interface MarkdownStoryProviderProps {
  children?: ComponentChildren;
}

export function MarkdownStoryProvider(props: MarkdownStoryProviderProps) {
  const audio = useAudioController();

  const showConsole = useSignal(true);

  const backgroundRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const bgUrl = useSignal<string>("");

  const stack = useMemo(() => new CallbackStack(), []);

  const name = useSignal("");
  const selections = useSignal<string[] | null>(null);

  const start = async (story: Story) => {
    const ctx = {
      selection: 0,
      console: {
        show: () => (showConsole.value = true),
        hide: () => (showConsole.value = false),
      },
      audio,
      preload,
    } satisfies StoryContext;

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
            span.style.animationDuration = `${action.text.length * 30}ms`;
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
          audio.bgm.change(action.url).then((audio) => {
            if (!action.animation.includes("noloop")) {
              audio.loop = true;
            }
            if (action.animation.includes("mute")) {
              audio.muted = true;
            }
          });

          break;
        }
        case "sfx": {
          // play the audio without blocking
          audio.sfx.play(action.url);
          break;
        }
      }
    }
  };

  return (
    <MarkdownStoryContext.Provider
      value={{
        start,
        refs: { background: backgroundRef, text: textRef },
        show: showConsole,
        name,
        selections,
        step() {
          stack.step();
        },
        select(data) {
          stack.select(data);
        },
      }}
    >
      {props.children}
    </MarkdownStoryContext.Provider>
  );
}
