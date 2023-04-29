import { ComponentChildren } from "preact";
import { MarkdownStoryContext } from "../use/useMarkdownStory";
import { batch, useSignal } from "@preact/signals";
import {
  Action,
  Story,
  StoryContext,
  StoryGenerator,
  deserialize,
} from "../../parser";
import { useAudioContext } from "../use/useAudioContext";
import { preload } from "../utils";

interface MarkdownStoryProviderProps {
  children?: ComponentChildren;
}

export function MarkdownStoryProvider(props: MarkdownStoryProviderProps) {
  const audio = useAudioContext();

  const playing = useSignal(false);
  const selections = useSignal<string[] | null>(null);

  // background signals
  const backgroundUrl = useSignal("");
  const backgroundParentAnimation = useSignal("");
  const backgroundImageAnimation = useSignal("");

  // text signals
  const consoleName = useSignal("");
  const consoleText = useSignal("");
  const consoleIdle = useSignal(true);
  const consoleVisible = useSignal(true);

  const storyContext = useSignal<StoryContext | null>(null);
  const currentStory = useSignal<StoryGenerator | null>(null);
  const animations = useSignal<Set<Animation>>(new Set());

  // wait all animations done
  const waitAnimations = async () => {
    const array = [...animations.value];
    await Promise.all(array.map((animation) => animation.finished));
  };

  // add animations
  const addAnimations = async (array: Animation[]) => {
    console.log("adding animations");
    await Promise.all(
      array.map(async (animation) => {
        animations.value.add(animation);
        await animation.finished;
        animations.value.delete(animation);
      })
    );
  };

  /** perform an action */
  const performAction = async (action: Action) => {
    console.debug(action);

    switch (action.type) {
      case "background": {
        // change these signals
        batch(() => {
          backgroundUrl.value = action.url;
          backgroundParentAnimation.value = action.parentAnimation;
          backgroundImageAnimation.value = action.imageAnimation;
        });
        await waitAnimations();
        return;
      }
      case "foreground": {
        // TODO
        return;
      }
      case "character": {
        // TODO
        return;
      }
      case "remove-character": {
        // TODO
        return;
      }
      case "text": {
        if (action.vocal) {
          audio.sfx.play(action.vocal);
        }
        batch(() => {
          consoleName.value = action.name;
          consoleText.value = action.text;
        });
        await waitAnimations();
        consoleIdle.value = true;
        return;
      }
      case "select": {
        selections.value = action.options;
        consoleIdle.value = true;
        return;
      }
      case "bgm": {
        // load new bgm and play
        audio.bgm.change(action.url);
        return;
      }
      case "sfx": {
        // play the audio without blocking
        audio.sfx.play(action.url);
        return;
      }
    }
  };

  // run a couple of actions, until we need user click
  const runActions = async () => {
    console.log("run action");

    // game not started
    if (!currentStory.value) {
      return;
    }
    if (!consoleIdle.value) {
      console.warn("trying to run action when running");
      return;
    }

    consoleIdle.value = false;

    while (!consoleIdle.value) {
      const next = currentStory.value.next();

      // story finished
      if (next.done) {
        playing.value = false;
        break;
      }

      const action = deserialize(...next.value);

      // if we need user interactions
      await performAction(action);
    }
  };

  // run single step
  const click = async () => {
    console.log("click");
    if (selections.value) {
      console.warn("use story.select() to make a choice");
      return;
    }

    // finish animation if not finish
    if (animations.value.size > 0) {
      animations.value.forEach((animate) => animate.finish());
      return;
    }

    await runActions();
  };

  const select = async (selection: number) => {
    if (!selections.value) {
      console.warn("use click() instead");
      return;
    }

    const ctx = storyContext.value;
    if (!ctx) {
      console.warn("game is not running!");
      return;
    }

    ctx.selection = selection;
    selections.value = null;

    await runActions();
  };

  const start = async (story: Story) => {
    batch(() => {
      storyContext.value = {
        selection: 0,
        console: {
          show: () => (consoleVisible.value = true),
          hide: () => (consoleVisible.value = false),
        },
        audio,
        preload,
      };
      currentStory.value = story(storyContext.value);
      playing.value = true;
    });

    await click();
  };

  const end = () => {
    batch(() => {
      playing.value = false;
      // reset backgrounds
      backgroundUrl.value = "";
      backgroundParentAnimation.value = "";
      backgroundImageAnimation.value = "";
      // reset text
      consoleName.value = "";
      consoleText.value = "";
      consoleIdle.value = false;
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
        console: {
          name: consoleName,
          text: consoleText,
          idle: consoleIdle,
          visible: consoleVisible,
        },
        background: {
          url: backgroundUrl,
          parentAnimation: backgroundParentAnimation,
          imageAnimation: backgroundImageAnimation,
        },
        click,
        select,
        addAnimations,
      }}
    >
      {props.children}
    </MarkdownStoryContext.Provider>
  );
}
