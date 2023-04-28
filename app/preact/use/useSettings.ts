import { Signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export interface Settings {
  /** Auto mode */
  auto: Signal<boolean>;
  /** Fast forward mode */
  fastForward: Signal<boolean>;

  /** bgm volume */
  bgmVolume: Signal<number>;
}

export const SettingsContext = createContext<Settings | null>(null);

export function useSettings() {
  const settings = useContext(SettingsContext);

  if (!settings) {
    throw new Error("Please nest your component in <StoryProvider />");
  }

  return settings;
}
