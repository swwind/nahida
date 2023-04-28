import { Story } from "../../parser";
import { ReadonlySignal } from "@preact/signals";
import { createContext } from "preact";
import { Ref, useContext } from "preact/hooks";

export interface MarkdownStory {
  start(story: Story): void;

  refs: {
    background: Ref<HTMLDivElement>;
    text: Ref<HTMLDivElement>;
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

export const MarkdownStoryContext = createContext<MarkdownStory | null>(null);

export function useMarkdownStory() {
  const markdownStory = useContext(MarkdownStoryContext);

  if (!markdownStory) {
    throw new Error("Please nest your component in <StoryProvider />");
  }

  return markdownStory;
}
