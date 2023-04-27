import { animate } from "./animate";

export function animateAudioFadeIn(audio: HTMLAudioElement, time: number) {
  return animate((volume) => (audio.volume = volume), 0, 1, time);
}

export function animateAudioFadeOut(audio: HTMLAudioElement, time: number) {
  return animate((volume) => (audio.volume = volume), 1, 0, time);
}

export function preloadAudio(url: string) {
  return new Promise<HTMLAudioElement>((resolve, reject) => {
    const audio = new Audio(url);
    audio.addEventListener("canplay", () => resolve(audio));
    audio.addEventListener("error", (err) => reject(err));
  });
}
