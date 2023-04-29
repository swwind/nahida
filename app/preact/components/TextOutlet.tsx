import { useRef } from "preact/hooks";
import { useMarkdownStory } from "../use/useMarkdownStory";
import { useSignalEffect } from "@preact/signals";

/**
 * ```jsx
 * <span>xxx</span>
 * ```
 */
export function TextOutlet() {
  const story = useMarkdownStory();
  const textRef = useRef<HTMLSpanElement>(null);

  useSignalEffect(() => {
    const text = story.console.text.value;
    const span = textRef.current!;

    span.textContent = text;

    if (text) {
      span.style.animation = "none";
      void span.offsetHeight;
      span.style.animation = "";
      span.style.animationDuration = `${text.length * 30}ms`;

      story.addAnimations(span.getAnimations());
    }
  });

  return <span ref={textRef} />;
}
