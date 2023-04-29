import { Story } from "../../parser";
import { ReadonlySignal } from "@preact/signals";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export interface MarkdownStory {
  start(story: Story | Promise<Story>): void;
  end(): void;

  /** game is playing or not */
  playing: ReadonlySignal<boolean>;
  /** current selection */
  selections: ReadonlySignal<string[] | null>;

  /** background url */
  background: {
    url: ReadonlySignal<string>;
    parentAnimation: ReadonlySignal<string>;
    imageAnimation: ReadonlySignal<string>;
  };

  /** things related to console */
  text: {
    /** current console is visible or not */
    visible: ReadonlySignal<boolean>;
    /** current speaking character name */
    name: ReadonlySignal<string>;
    /** is waiting user to click */
    idle: ReadonlySignal<boolean>;
    /** current text value */
    value: ReadonlySignal<string>;
  };

  /** step function, skip current animation or jump to next */
  step(): void;
  /** make the selection */
  select(data: number): void;

  /** wait animation to be done */
  waitAnimation(animations: Animation[]): Promise<void>;
}

export const MarkdownStoryContext = createContext<MarkdownStory | null>(null);

export function useMarkdownStory() {
  const markdownStory = useContext(MarkdownStoryContext);

  if (!markdownStory) {
    throw new Error("Please nest your component in <StoryProvider />");
  }

  return markdownStory;
}
