import { ComponentChildren } from "preact";
import { SettingsContext } from "../use/useSettings";
import { useSignal, useSignalEffect } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface SettingsProviderProps {
  children?: ComponentChildren;
}

export function SettingsProvider(props: SettingsProviderProps) {
  const auto = useSignal(false);
  const fastForward = useSignal(false);
  const bgmVolume = useSignal(1);
  const fullscreen = useSignal(false);

  useSignalEffect(() => {
    if (fullscreen.value) {
      !document.fullscreenElement && document.body.requestFullscreen();
    } else {
      document.fullscreenElement && document.exitFullscreen();
    }
  });

  useEffect(() => {
    document.addEventListener("fullscreenchange", () => {
      fullscreen.value = !!document.fullscreenElement;
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{ auto, fastForward, bgmVolume, fullscreen }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
