import { ComponentChildren } from "preact";
import { MarkdownStoryContext } from "../use/useMarkdownStory";
import { batch, useSignal } from "@preact/signals";
import { Story, StoryContext, deserialize } from "../../parser";
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
  const selections = useSignal<string[] | null>(null);

  const backgroundUrl = useSignal("");
  const backgroundParentAnimation = useSignal("");
  const backgroundImageAnimation = useSignal("");

  const stack = useMemo(() => new CallbackStack(), []);

  const textName = useSignal("");
  const textValue = useSignal("");
  const idle = useSignal(false);
  const consoleVisible = useSignal(true);

  const start = async (story: Story | Promise<Story>) => {
    story = await story;

    const ctx = {
      selection: 0,
      console: {
        show: () => (consoleVisible.value = true),
        hide: () => (consoleVisible.value = false),
      },
      audio,
      preload,
    } satisfies StoryContext;

    const generator = story(ctx);
    playing.value = true;

    for (const serial of generator) {
      const action = deserialize(...serial);
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
            textName.value = action.name;
            textValue.value = action.text;
          });
          await stack.waitAnimation();
          idle.value = true;
          await stack.waitClick();
          idle.value = false;
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

      if (!playing.value) break;
    }

    end();
  };

  const end = () => {
    batch(() => {
      playing.value = false;
      // reset backgrounds
      backgroundUrl.value = "";
      backgroundParentAnimation.value = "";
      backgroundImageAnimation.value = "";
      // reset text
      textName.value = "";
      textValue.value = "";
      idle.value = false;
      consoleVisible.value = true;
    });
  };

  return (
    <MarkdownStoryContext.Provider
      value={{
        start,
        end,
        playing,
        selections,
        text: {
          name: textName,
          value: textValue,
          idle: idle,
          visible: consoleVisible,
        },
        background: {
          url: backgroundUrl,
          parentAnimation: backgroundParentAnimation,
          imageAnimation: backgroundImageAnimation,
        },
        step() {
          stack.step();
        },
        select(data) {
          stack.select(data);
        },
        waitAnimation(animations) {
          return stack.waitAnimations(animations);
        },
      }}
    >
      {props.children}
    </MarkdownStoryContext.Provider>
  );
}
