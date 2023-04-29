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
    <div class="w-full h-full bg-white menu">
      <div class="w-full h-full flex flex-col justify-center items-center gap-10 bg-[url(/src/assets/images/background/bg-2.png)] bg-cover bg-center">
        <h1 class="text-5xl text-white title">我与纳西妲的禁断之恋</h1>
        <div class="flex flex-col gap-4 text-sm text-white">
          <button
            class="bg-black bg-opacity-20 hover:bg-opacity-30 py-2 rounded transition-colors px-4"
            onClick={() => router.push("game")}
          >
            开始游戏
          </button>
          <button
            class="bg-black bg-opacity-20 hover:bg-opacity-30 py-2 rounded transition-colors px-4"
            onClick={() => alert("并没有可以读取的存档喵~")}
          >
            读取存档
          </button>
          <button
            class="bg-black bg-opacity-20 hover:bg-opacity-30 py-2 rounded transition-colors px-4"
            onClick={() => alert("并没有可以设置的东西喵~")}
          >
            设置
          </button>
        </div>
      </div>
    </div>
  );
}
