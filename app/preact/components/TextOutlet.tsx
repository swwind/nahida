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
    const text = story.text.value.value;
    const span = textRef.current!;

    span.style.animation = "none";
    void span.offsetHeight;
    span.textContent = text;
    span.style.animation = "";
    span.style.animationDuration = `${text.length * 30}ms`;

    story.waitAnimation(span.getAnimations());
  });

  return <span ref={textRef} />;
}
