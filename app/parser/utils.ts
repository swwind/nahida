import { Action } from "./types";

export interface StoryContext {
  name: `\0${string}` | null;
  vocal: `\0${string}` | null;

  import: (url: string) => `\0${string}`;
  cache: (name: string) => `\0${string}`;
  append: (code: string) => void;
  yield: (action: Action) => void;
}
