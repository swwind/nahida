export type BackgroundAction = {
  type: "background";
  url: string;
  parentAnimation: string;
  imageAnimation: string;
};

export type ForegroundAction = {
  type: "foreground";
  url: string;
  parentAnimation: string;
  imageAnimation: string;
};

export type CharacterAction = {
  type: "character";
  url: string;
  identity: string;
  parentAnimation: string;
  imageAnimation: string;
};

export type RemoveCharacterAction = {
  type: "remove-character";
  url: string;
  identity: string;
  parentAnimation: string;
  imageAnimation: string;
};

export type TextAction = {
  type: "text";
  text: string;
  name: string;
  vocal: string;
};

export type BackgroundMusicAction = {
  type: "bgm";
  url: string;
  animation: string;
};

export type SoundEffectAction = {
  type: "sfx";
  url: string;
  animation: string;
};

export type SelectAction = {
  type: "select";
  options: string[];
};

export type Action =
  | BackgroundAction
  | ForegroundAction
  | CharacterAction
  | RemoveCharacterAction
  | SoundEffectAction
  | TextAction
  | SelectAction
  | BackgroundMusicAction;

export interface AudioContext {
  bgm: {
    change(url: string): Promise<HTMLAudioElement>;
    play(): void;
    pause(): void;
    mute(): void;
    unmute(): void;
    fadeIn(time?: number): void;
    fadeOut(time?: number): void;
  };

  sfx: {
    play(url: string): Promise<HTMLAudioElement>;
  };
}

export type StoryContext = {
  selection: number;
  console: {
    show: () => void;
    hide: () => void;
  };
  audio: AudioContext;
  preload: (url: string, as: string) => void;
};

export type Story = (ctx: StoryContext) => Generator<Action, void, void>;
