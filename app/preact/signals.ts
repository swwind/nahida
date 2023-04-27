import { signal } from "@preact/signals";

export const name = signal("");
export const text = signal("");
export const show = signal(true);

export const bgmAudio = signal<HTMLAudioElement | null>(null);

export const bgUrl = signal("");

export const selections = signal<string[] | null>(null);
