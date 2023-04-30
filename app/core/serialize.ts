import { Action } from "./types";

export enum ActionType {
  BACKGROUND,
  FOREGROUND,
  CHARACTER,
  REMOVE_CHARACTER,
  SOUND_EFFECT,
  TEXT,
  SELECT,
  BACKGROUND_MUSIC,
  WAIT,
  CONSOLE,
}

export type SerializedAction = [ActionType, ...(string | number | boolean)[]];

export function shorten(...params: (string | number | boolean)[]) {
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
    case "wait":
      return [ActionType.WAIT, ...shorten(action.time)];
    case "console":
      return [ActionType.CONSOLE, ...shorten(action.visible)];
  }
}

export function deserialize(
  type: ActionType,
  ...action: (string | number | boolean)[]
): Action {
  let index = 0;
  const string = () => (action[index++] || "") as string;
  const number = () => (action[index++] || 0) as number;
  const boolean = () => (action[index++] || false) as boolean;
  const array = () => action as string[];

  switch (type) {
    case ActionType.BACKGROUND:
      return {
        type: "background",
        url: string(),
        parentAnimation: string(),
        imageAnimation: string(),
      };
    case ActionType.FOREGROUND:
      return {
        type: "foreground",
        url: string(),
        parentAnimation: string(),
        imageAnimation: string(),
      };
    case ActionType.CHARACTER:
      return {
        type: "character",
        url: string(),
        identity: string(),
        parentAnimation: string(),
        imageAnimation: string(),
      };
    case ActionType.REMOVE_CHARACTER:
      return {
        type: "remove-character",
        url: string(),
        identity: string(),
        parentAnimation: string(),
        imageAnimation: string(),
      };
    case ActionType.SOUND_EFFECT:
      return {
        type: "sfx",
        url: string(),
        animation: string(),
      };
    case ActionType.TEXT:
      return {
        type: "text",
        text: string(),
        name: string(),
        vocal: string(),
      };
    case ActionType.SELECT:
      return {
        type: "select",
        options: array(),
      };
    case ActionType.BACKGROUND_MUSIC:
      return {
        type: "bgm",
        url: string(),
        animation: string(),
      };
    case ActionType.WAIT:
      return { type: "wait", time: number() };
    case ActionType.CONSOLE:
      return { type: "console", visible: boolean() };
  }
}
