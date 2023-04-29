import { ComponentChildren } from "preact";
import { AudioContextContext } from "../use/useAudioContext";
import { useSignal } from "@preact/signals";
import { animate } from "../animate";

interface AudioContextProviderProps {
  children?: ComponentChildren;
}

export function AudioContextProvider(props: AudioContextProviderProps) {
  const bgmAudio = useSignal<HTMLAudioElement | null>(null);
  const bgmAnimatePromise = useSignal<Promise<void>>(Promise.resolve());

  return (
    <AudioContextContext.Provider
      value={{
        bgm: {
          change(url) {
            const promise = Promise.all([
              // do previous animation and fadeout animation sequencely
              bgmAnimatePromise.value.then(() => {
                // play volume fade out animation
                return bgmAudio.value && bgmAudio.value.volume > 0
                  ? animateAudioFadeOut(bgmAudio.value, 1000)
                  : Promise.resolve();
              }),
              // load audio along side them
              loadAudio(url),
            ]).then(([_, audio]) => {
              bgmAudio.value = audio;
              audio.loop = true;
              audio.play();
              return audio;
            });

            bgmAnimatePromise.value = promise as unknown as Promise<void>;

            return promise;
          },
          play() {
            bgmAudio.value?.play();
          },
          pause() {
            bgmAudio.value?.pause();
          },
          mute() {
            if (bgmAudio.value) {
              bgmAudio.value.muted = true;
            }
          },
          unmute() {
            if (bgmAudio.value) {
              bgmAudio.value.muted = false;
            }
          },
          fadeIn(time = 1000) {
            bgmAnimatePromise.value = bgmAnimatePromise.value.then(() =>
              bgmAudio.value
                ? animateAudioFadeIn(bgmAudio.value, time)
                : Promise.resolve()
            );
          },
          fadeOut(time = 1000) {
            bgmAnimatePromise.value = bgmAnimatePromise.value.then(() =>
              bgmAudio.value
                ? animateAudioFadeOut(bgmAudio.value, time)
                : Promise.resolve()
            );
          },
        },

        sfx: {
          play(url) {
            const promise = loadAudio(url);
            promise.then((audio) => audio.play());
            return promise;
          },
        },
      }}
    >
      {props.children}
    </AudioContextContext.Provider>
  );
}

function loadAudio(url: string) {
  return new Promise<HTMLAudioElement>((resolve, reject) => {
    const audio = new Audio(url);
    audio.addEventListener("canplay", () => resolve(audio));
    audio.addEventListener("error", (err) => reject(err));
  });
}

function animateAudioFadeIn(audio: HTMLAudioElement, time: number) {
  return animate((volume) => (audio.volume = volume), 0, 1, time);
}

function animateAudioFadeOut(audio: HTMLAudioElement, time: number) {
  return animate((volume) => (audio.volume = volume), 1, 0, time);
}
