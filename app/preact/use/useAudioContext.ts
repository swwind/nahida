import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { AudioContext } from "../../parser";

export const AudioContextContext = createContext<AudioContext | null>(null);

export function useAudioController() {
  const audioController = useContext(AudioContextContext);

  if (!audioController) {
    throw new Error("Please nest your component in <StoryProvider />");
  }

  return audioController;
}
