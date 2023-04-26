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
export function deserialize(type, ...action) {
  let index = 0;
  const param = () => action[index++] || "";

  switch (type) {
    case 0:
      return {
        type: "background",
        url: param(),
        parentAnimation: param(),
        imageAnimation: param(),
      };
    case 1:
      return {
        type: "foreground",
        url: param(),
        parentAnimation: param(),
        imageAnimation: param(),
      };
    case 2:
      return {
        type: "character",
        url: param(),
        identity: param(),
        animation: param(),
      };
    case 3:
      return {
        type: "remove-character",
        identity: param(),
      };
    case 4:
      return {
        type: "sfx",
        url: param(),
      };
    case 5:
      return {
        type: "text",
        text: param(),
        name: param(),
        vocal: param(),
      };
    case 6:
      return {
        type: "select",
        options: action,
      };
    case 7:
      return {
        type: "bgm",
        url: param(),
      };
  }
}

`;
