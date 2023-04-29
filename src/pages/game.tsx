import { BackgroundOutlet, useMarkdownStory, useRouter } from "@/preact";

import "./game.scss";

import intro from "../story/intro.md";
import { useSignal } from "@preact/signals";
import { PauseIcon } from "~/icons/pause";
import { useEffect } from "preact/hooks";
import { TextOutlet } from "@/preact/components/TextOutlet";
import dendro from "../assets/images/icons/dendro.webp?url";
import { Fragment } from "preact/jsx-runtime";

export function Game() {
  const story = useMarkdownStory();
  const menu = useSignal(false);
  const router = useRouter();

  useEffect(() => {
    story.start(intro);
    return () => story.end();
  }, []);

  return (
    <Fragment>
      <div class="game" onClick={() => story.step()}>
        <BackgroundOutlet />

        <div class="console" style={{ opacity: story.show.value ? 1 : 0 }}>
          <div class="name">{story.name.value}</div>
          <div class="text">
            <TextOutlet />
            {story.idle.value && <img src={dendro} class="indicator" />}
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
      </div>
      <div
        class="absolute top-4 left-4 rounded-lg p-2 bg-black bg-opacity-0 transition-colors hover:bg-opacity-20"
        onClick={() => {
          menu.value = true;
        }}
      >
        <PauseIcon class="h-4 w-4 text-white" />
      </div>
      {menu.value && (
        <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50">
          <div class="w-full h-full">
            <h1 class="text-white text-2xl mt-8 text-center">菜单</h1>
            <div class="flex flex-col gap-4 text-sm text-white mx-auto mt-8 w-fit">
              <button
                class="py-1 rounded transition-colors px-4 bg-black bg-opacity-0 hover:bg-opacity-30"
                onClick={() => (menu.value = false)}
              >
                继续游戏
              </button>
              <button
                class="py-1 rounded transition-colors px-4 bg-black bg-opacity-0 hover:bg-opacity-30"
                onClick={() => alert("并没有可以读取的存档喵~")}
              >
                读取存档
              </button>
              <button
                class="py-1 rounded transition-colors px-4 bg-black bg-opacity-0 hover:bg-opacity-30"
                onClick={() => router.push("settings")}
              >
                设置
              </button>
              <button
                class="py-1 rounded transition-colors px-4 bg-black bg-opacity-0 hover:bg-opacity-30"
                onClick={() => router.pop()}
              >
                退出
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
