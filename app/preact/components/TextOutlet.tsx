import { useRef } from "preact/hooks";
import { useMarkdownStory } from "../use/useMarkdownStory";
import { useSignalEffect } from "@preact/signals";

/**
 * ```jsx
 * <span data-text="xxx">xxx</span>
 * ```
 */
export function TextOutlet() {
  const story = useMarkdownStory();
  const textRef = useRef<HTMLSpanElement>(null);

  useSignalEffect(() => {
    const text = story.text.value;
    const span = textRef.current;

    if (!span) {
      return;
    }

    span.style.animation = "none";
    void span.offsetHeight;
    span.style.animation = "";
    span.style.animationDuration = `${text.length * 30}ms`;

    story.waitAnimation(span);
  });

  return (
    <span data-text={story.text.value} ref={textRef}>
      {story.text.value}
    </span>
  );
}
