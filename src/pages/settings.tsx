import { useRouter, useSettings } from "@/preact";
import "./settings.scss?scope";

export function Settings() {
  const settings = useSettings();
  const router = useRouter();

  return (
    <div class="settings">
      <div class="container">
        <h1 class="title">设置～</h1>

        <div>
          <div>窗口设置</div>
          <div class="space-x-2">
            <button
              class="button"
              onClick={() => (settings.fullscreen.value = true)}
              disabled={settings.fullscreen.value}
            >
              全屏
            </button>
            <button
              class="button"
              onClick={() => (settings.fullscreen.value = false)}
              disabled={!settings.fullscreen.value}
            >
              窗口
            </button>
          </div>
        </div>

        <div>
          <button class="button" onClick={() => router.pop()}>
            返回
          </button>
        </div>
      </div>
    </div>
  );
}
