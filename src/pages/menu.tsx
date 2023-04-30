import { useRouter } from "@/preact";

import "./menu.scss";
import { useEffect } from "preact/hooks";
import { useAudioContext } from "@/preact/use/useAudioContext";
import flower from "../assets/audio/music/flower.mp3?url";

export function Menu() {
  const router = useRouter();
  const audio = useAudioContext();

  useEffect(() => {
    audio.bgm.change(flower);
  }, []);

  return (
    <div class="menu h-full w-full bg-white">
      <div class="flex h-full w-full flex-col items-center justify-center gap-10 bg-[url(/src/assets/images/background/bg-2.png)] bg-cover bg-center">
        <h1 class="title text-5xl text-white">我与纳西妲的禁断之恋</h1>
        <div class="flex flex-col gap-4 text-sm text-white">
          <button
            class="rounded bg-black bg-opacity-20 px-4 py-2 transition-colors hover:bg-opacity-30"
            onClick={() => router.push("game")}
          >
            开始游戏
          </button>
          <button
            class="rounded bg-black bg-opacity-20 px-4 py-2 transition-colors hover:bg-opacity-30"
            onClick={() => alert("并没有可以读取的存档喵~")}
          >
            读取存档
          </button>
          <button
            class="rounded bg-black bg-opacity-20 px-4 py-2 transition-colors hover:bg-opacity-30"
            onClick={() => router.push("settings")}
          >
            设置
          </button>
        </div>
      </div>
    </div>
  );
}
