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

export type SoundEffectAction = {
  type: "sfx";
  url: string;
};

export type SelectAction = {
  type: "select";
  options: string[];
};

export type BackgroundMusicAction = {
  type: "bgm";
  url: string;
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

export type Context = {
  selection: number;
};

export type Story = (ctx: Context) => Generator<Action, void, void>;
