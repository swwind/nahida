import { ComponentChildren } from "preact";
import { MarkdownStoryContext } from "../use/useMarkdownStory";
import { batch, useSignal, useSignalEffect } from "@preact/signals";
import { Story, StoryContext } from "../../parser";
import { useAudioContext } from "../use/useAudioContext";
import { preload } from "../utils";
import { useMemo } from "preact/hooks";
import { CallbackStack } from "../callback-stack";

interface MarkdownStoryProviderProps {
  children?: ComponentChildren;
}

export function MarkdownStoryProvider(props: MarkdownStoryProviderProps) {
  const audio = useAudioContext();

  const playing = useSignal(false);
  const showConsole = useSignal(true);

  const backgroundUrl = useSignal("");
  const backgroundParentAnimation = useSignal("");
  const backgroundImageAnimation = useSignal("");

  const stack = useMemo(() => new CallbackStack(), []);

  const name = useSignal("");
  const text = useSignal("");
  const selections = useSignal<string[] | null>(null);

  const animating = useSignal(false);
  const idle = useSignal(false);

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
    playing.value = true;

    for await (const action of generator) {
      if (!playing.value) break;
      console.debug(action);

      switch (action.type) {
        case "background": {
          batch(() => {
            backgroundUrl.value = action.url;
            backgroundParentAnimation.value = action.parentAnimation;
            backgroundImageAnimation.value = action.imageAnimation;
          });
          await stack.waitAnimation();
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
          if (action.vocal) {
            // FIXME
            audio.sfx.play(action.vocal);
          }

          batch(() => {
            name.value = action.name;
            text.value = action.text;
            idle.value = false;
          });

          await stack.waitAnimation();
          idle.value = true;
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

    playing.value = false;
  };

  useSignalEffect(() => {
    if (!playing.value) {
      batch(() => {
        backgroundUrl.value = "";
        backgroundParentAnimation.value = "";
        backgroundImageAnimation.value = "";
        animating.value = false;
        idle.value = false;
        name.value = "";
        text.value = "";
        showConsole.value = true;
      });

      // audio.bgm.fadeOut();
    }
  });

  return (
    <MarkdownStoryContext.Provider
      value={{
        start,
        end() {
          playing.value = false;
        },
        playing,
        show: showConsole,
        name,
        selections,
        step() {
          stack.step();
        },
        select(data) {
          stack.select(data);
        },
        animating,
        idle,
        text,
        background: {
          url: backgroundUrl,
          parentAnimation: backgroundParentAnimation,
          imageAnimation: backgroundImageAnimation,
        },
        waitAnimation(elem) {
          return stack.waitAnimations(elem);
        },
      }}
    >
      {props.children}
    </MarkdownStoryContext.Provider>
  );
}
