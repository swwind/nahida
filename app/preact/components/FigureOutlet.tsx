import { useRef } from "preact/hooks";
import { useMarkdownStory } from "..";
import { useSignalEffect } from "@preact/signals";

/**
 * ```jsx
 * <div class="figure" />
 * ```
 */
export function FigureOutlet() {
  const figureRef = useRef<HTMLDivElement>(null);
  const story = useMarkdownStory();

  useSignalEffect(() => {
    const figures = story.figures.value;
    const div = figureRef.current!;

    const background = figures
      .map((figure) => {
        const image = figure.url
          ? `url(${figure.url})`
          : // transparent background
            "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=)";
        const position = figure.position || "center";
        const size = figure.size || "contain";
        return `${image} ${position} / ${size} no-repeat`;
      })
      .join(", ");
    div.style.background = background;
    // story.addAnimations(div.getAnimations());
  });

  return <div class="figure" ref={figureRef} />;
}
