import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { AudioContext } from "@/core";

export const AudioContextContext = createContext<AudioContext | null>(null);

export function useAudioContext() {
  const audioContext = useContext(AudioContextContext);

  if (!audioContext) {
    throw new Error("Please nest your component in <StoryProvider />");
  }

  return audioContext;
}
