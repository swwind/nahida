import { Action } from "./types";

export type ImportType = "image" | "audio";

export interface ParseContext {
  name: `\0${string}` | null;
  vocal: `\0${string}` | null;

  import: (url: string, type?: ImportType) => `\0${string}`;
  cache: (name: string) => `\0${string}`;
  append: (code: string) => void;
  yield: (action: Action) => void;
}
