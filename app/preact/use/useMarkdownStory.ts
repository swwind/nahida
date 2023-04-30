import { Story } from "@/core";
import { ReadonlySignal } from "@preact/signals";
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { StoryAnimation } from "../animate";

export interface MarkdownStory {
  start(story: Story): void;
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
  console: {
    /** current speaking character name */
    name: ReadonlySignal<string>;
    /** current text value */
    text: ReadonlySignal<string>;
    /** is waiting user to click */
    idle: ReadonlySignal<boolean>;
    /** current console is visible or not */
    visible: ReadonlySignal<boolean>;
  };

  /** step function, skip current animation or jump to next */
  click(): void;
  /** make the selection */
  select(data: number): void;

  /** add animations */
  addAnimations(animations: StoryAnimation[]): Promise<void>;
}

export const MarkdownStoryContext = createContext<MarkdownStory | null>(null);

export function useMarkdownStory() {
  const markdownStory = useContext(MarkdownStoryContext);

  if (!markdownStory) {
    throw new Error("Please nest your component in <StoryProvider />");
  }

  return markdownStory;
}
