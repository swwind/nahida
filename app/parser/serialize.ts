import { Action } from ".";

enum SerializeType {
  BACKGROUND,
  FOREGROUND,
  CHARACTER,
  REMOVE_CHARACTER,
  SOUND_EFFECT,
  TEXT,
  SELECT,
  BACKGROUND_MUSIC,
}

export function shorten(...params: string[]) {
  let last = 0;
  for (let index = 0; index < params.length; ++index) {
    if (params[index]) {
      last = index + 1;
    }
  }
  return params.slice(0, last);
}

export function serialize(action: Action): [SerializeType, string[]] {
  switch (action.type) {
    case "background":
      return [
        SerializeType.BACKGROUND,
        shorten(action.url, action.parentAnimation, action.imageAnimation),
      ];
    case "foreground":
      return [
        SerializeType.FOREGROUND,
        shorten(action.url, action.parentAnimation, action.imageAnimation),
      ];
    case "character":
      return [
        SerializeType.CHARACTER,
        shorten(action.url, action.identity, action.animation),
      ];
    case "remove-character":
      return [SerializeType.REMOVE_CHARACTER, shorten(action.identity)];
    case "sfx":
      return [SerializeType.SOUND_EFFECT, shorten(action.url)];
    case "text":
      return [
        SerializeType.TEXT,
        shorten(action.text, action.name, action.vocal),
      ];
    case "select":
      return [SerializeType.SELECT, action.options];
    case "bgm":
      return [SerializeType.BACKGROUND_MUSIC, shorten(action.url)];
  }
}

export function deserialize(type: SerializeType, ...action: string[]): Action {
  let index = 0;
  const param = () => action[index++] || "";

  switch (type) {
    case SerializeType.BACKGROUND:
      return {
        type: "background",
        url: param(),
        parentAnimation: param(),
        imageAnimation: param(),
      };
    case SerializeType.FOREGROUND:
      return {
        type: "foreground",
        url: param(),
        parentAnimation: param(),
        imageAnimation: param(),
      };
    case SerializeType.CHARACTER:
      return {
        type: "character",
        url: param(),
        identity: param(),
        animation: param(),
      };
    case SerializeType.REMOVE_CHARACTER:
      return {
        type: "remove-character",
        identity: param(),
      };
    case SerializeType.SOUND_EFFECT:
      return {
        type: "sfx",
        url: param(),
      };
    case SerializeType.TEXT:
      return {
        type: "text",
        text: param(),
        name: param(),
        vocal: param(),
      };
    case SerializeType.SELECT:
      return {
        type: "select",
        options: action,
      };
    case SerializeType.BACKGROUND_MUSIC:
      return {
        type: "bgm",
        url: param(),
      };
  }
}
