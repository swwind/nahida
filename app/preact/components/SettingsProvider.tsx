import { ComponentChildren } from "preact";
import { SettingsContext } from "../use/useSettings";
import { useSignal } from "@preact/signals";

interface SettingsProviderProps {
  children?: ComponentChildren;
}

export function SettingsProvider(props: SettingsProviderProps) {
  const auto = useSignal(false);
  const fastForward = useSignal(false);

  const bgmVolume = useSignal(1);

  return (
    <SettingsContext.Provider value={{ auto, fastForward, bgmVolume }}>
      {props.children}
    </SettingsContext.Provider>
  );
}
