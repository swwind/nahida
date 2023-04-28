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

export interface ConsoleContext {
  /** show console */
  show(): void;
  /** hide console */
  hide(): void;
}

export interface AudioContext {
  bgm: {
    /** change BGM track, this will fade out previous track before change to new one */
    change(url: string): Promise<HTMLAudioElement>;
    /** instant play track */
    play(): void;
    /** instant pause track */
    pause(): void;
    /** instant mute track */
    mute(): void;
    /** instant unmute track */
    unmute(): void;
    /** fade in volume */
    fadeIn(time?: number): void;
    /** fade out volume */
    fadeOut(time?: number): void;
  };
  sfx: {
    /** play sound effect */
    play(url: string): Promise<HTMLAudioElement>;
  };
}

export type StoryContext = {
  selection: number;
  console: ConsoleContext;
  audio: AudioContext;
  preload: (url: string, as: string) => void;
};

export type Story = (ctx: StoryContext) => AsyncGenerator<Action, void, void>;
