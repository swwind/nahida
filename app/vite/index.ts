import type { Plugin } from "vite";
import { createFilter } from "rollup-pluginutils";
import { parseStory } from "../parser";

type Options = {
  include?: string;
  exclude?: string;
};

const virtualId = `@markdown-story`;
const resolveVirtualId = `\0${virtualId}`;

export function markdownStory(options?: Options): Plugin {
  const include = options?.include ?? "src/**/*.md";
  const exclude = options?.exclude ?? "node_modules/**";
  const filter = createFilter(include, exclude);

  return {
    name: "markdown-story-plugin",
    resolveId(id) {
      if (id === virtualId) {
        return resolveVirtualId;
      }
    },
    load(id) {
      if (id === resolveVirtualId) {
        return inlineStory;
      }
    },
    transform(markdown, id) {
      if (!filter(id) || !id.endsWith(".md")) {
        return null;
      }

      const esModule = parseStory(markdown);

      return {
        code: esModule,
        map: null,
        moduleSideEffects: false,
      };
    },
  };
}

const inlineStory = `
export const background = (url, parentAnimation = "", imageAnimation = "") => ({ type: "background", url, parentAnimation, imageAnimation });
export const foreground = (url, parentAnimation = "", imageAnimation = "") => ({ type: "foreground", url, parentAnimation, imageAnimation });
export const character = (url, identity, animation = "") => ({ type: "character", url, identity, animation });
export const removeCharacter = (identity) => ({ type: "remove-character", identity });
export const text = (text, name = "", vocal = "") => ({ type: "text", text, name, vocal });
export const select = (options) => ({ type: "select", options });
export const backgroundMusic = (url) => ({ type: "bgm", url });
export const soundEffect = (url) => ({ type: "sfx", url });
`;
