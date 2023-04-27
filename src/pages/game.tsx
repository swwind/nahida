import { useMarkdownStory } from "@/preact";

import "./game.scss";

import intro from "../story/intro.md";
import { Signal, useSignal } from "@preact/signals";
import { PauseIcon } from "~/icons/pause";

interface Props {
  start: Signal<boolean>;
}

export default function (props: Props) {
  const story = useMarkdownStory(intro);
  const menu = useSignal(false);

  return (
    <>
      <div class="game" onClick={() => story.step()}>
        <div class="background" ref={story.refs.background}></div>

        <div class="console" style={{ opacity: story.show.value ? 1 : 0 }}>
          <div class="name">{story.name.value}</div>
          <div class="text" ref={story.refs.text} />
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
        <PauseIcon class="h-8 w-8 text-white" />
      </div>
      {menu.value && (
        <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50">
          <div class="w-full h-full">
            <h1 class="text-white text-4vvw mt-20 text-center">菜单</h1>
            <div class="flex flex-col gap-4 text-2vvw text-white mx-auto mt-20 w-fit">
              <button
                class="py-2 rounded transition-colors px-8 bg-black bg-opacity-0 hover:bg-opacity-30"
                onClick={() => (menu.value = false)}
              >
                继续游戏
              </button>
              <button
                class="py-2 rounded transition-colors px-8 bg-black bg-opacity-0 hover:bg-opacity-30"
                onClick={() => alert("并没有可以读取的存档喵~")}
              >
                读取存档
              </button>
              <button
                class="py-2 rounded transition-colors px-8 bg-black bg-opacity-0 hover:bg-opacity-30"
                onClick={() => alert("并没有可以设置的东西喵~")}
              >
                设置
              </button>
              <button
                class="py-2 rounded transition-colors px-8 bg-black bg-opacity-0 hover:bg-opacity-30"
                onClick={() => {
                  props.start.value = false;
                }}
              >
                退出
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
