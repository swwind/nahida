import { Action } from ".";

export enum ActionType {
  BACKGROUND,
  FOREGROUND,
  CHARACTER,
  REMOVE_CHARACTER,
  SOUND_EFFECT,
  TEXT,
  SELECT,
  BACKGROUND_MUSIC,
}

export type SerializedAction = [ActionType, ...string[]];

export function shorten(...params: string[]) {
  while (params.length > 0 && !params[params.length - 1]) {
    params.pop();
  }
  return params;
}

export function serialize(action: Action): SerializedAction {
  switch (action.type) {
    case "background":
      return [
        ActionType.BACKGROUND,
        ...shorten(action.url, action.parentAnimation, action.imageAnimation),
      ];
    case "foreground":
      return [
        ActionType.FOREGROUND,
        ...shorten(action.url, action.parentAnimation, action.imageAnimation),
      ];
    case "character":
      return [
        ActionType.CHARACTER,
        ...shorten(
          action.url,
          action.identity,
          action.parentAnimation,
          action.imageAnimation
        ),
      ];
    case "remove-character":
      return [
        ActionType.REMOVE_CHARACTER,
        ...shorten(
          action.url,
          action.identity,
          action.parentAnimation,
          action.imageAnimation
        ),
      ];
    case "sfx":
      return [
        ActionType.SOUND_EFFECT,
        ...shorten(action.url, action.animation),
      ];
    case "text":
      return [
        ActionType.TEXT,
        ...shorten(action.text, action.name, action.vocal),
      ];
    case "select":
      return [ActionType.SELECT, ...action.options];
    case "bgm":
      return [
        ActionType.BACKGROUND_MUSIC,
        ...shorten(action.url, action.animation),
      ];
  }
}

export function deserialize(type: ActionType, ...action: string[]): Action {
  let index = 0;
  const param = () => action[index++] || "";

  switch (type) {
    case ActionType.BACKGROUND:
      return {
        type: "background",
        url: param(),
        parentAnimation: param(),
        imageAnimation: param(),
      };
    case ActionType.FOREGROUND:
      return {
        type: "foreground",
        url: param(),
        parentAnimation: param(),
        imageAnimation: param(),
      };
    case ActionType.CHARACTER:
      return {
        type: "character",
        url: param(),
        identity: param(),
        parentAnimation: param(),
        imageAnimation: param(),
      };
    case ActionType.REMOVE_CHARACTER:
      return {
        type: "remove-character",
        url: param(),
        identity: param(),
        parentAnimation: param(),
        imageAnimation: param(),
      };
    case ActionType.SOUND_EFFECT:
      return {
        type: "sfx",
        url: param(),
        animation: param(),
      };
    case ActionType.TEXT:
      return {
        type: "text",
        text: param(),
        name: param(),
        vocal: param(),
      };
    case ActionType.SELECT:
      return {
        type: "select",
        options: action,
      };
    case ActionType.BACKGROUND_MUSIC:
      return {
        type: "bgm",
        url: param(),
        animation: param(),
      };
  }
}
