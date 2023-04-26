import { Action } from "./types";

export interface StoryContext {
  register: Map<string, string>;

  importUrl: (url: string) => string;
  importName: (name: string) => string;
  append: (code: string) => void;
  yield: (action: Action) => void;
}

export function s(code: string | string[]) {
  return JSON.stringify(code);
}
