import { BackgroundOutlet, useMarkdownStory, useRouter } from "@/preact";

import "./game.scss";

import intro from "../story/intro.md";
import { PauseIcon } from "~/icons/pause";
import { useEffect } from "preact/hooks";
import { TextOutlet } from "@/preact/components/TextOutlet";
import { FigureOutlet } from "@/preact/components/FigureOutlet";

export function Game() {
  const story = useMarkdownStory();
  const router = useRouter();

  useEffect(() => {
    story.start(intro);
    return () => story.end();
  }, []);

  return (
    <div class="game" onClick={() => story.click()}>
      <BackgroundOutlet />
      <FigureOutlet />

      <div
        class="console"
        style={{ opacity: story.console.visible.value ? 1 : 0 }}
      >
        <div class="name">{story.console.name.value}</div>
        <div class="text">
          <TextOutlet />
          {story.console.idle.value && <span class="indicator" />}
        </div>
      </div>

      {story.selections.value && (
        <div class="selection">
          {story.selections.value.map((option, index) => (
            <div
              class="option"
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                story.select(index);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      <div
        class="absolute left-4 top-4 rounded-lg bg-black bg-opacity-0 p-2 transition-colors hover:bg-opacity-20"
        onClick={(e) => {
          e.stopPropagation();
          router.push("settings");
        }}
      >
        <PauseIcon class="h-4 w-4 text-white" />
      </div>
    </div>
  );
}
