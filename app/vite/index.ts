import type { Plugin } from "vite";
import { createFilter } from "rollup-pluginutils";
import { parseStory } from "../core";

type Options = {
  include?: string;
  exclude?: string;
};

export function markdownStory(options?: Options): Plugin {
  const include = options?.include ?? "src/**/*.md";
  const exclude = options?.exclude ?? "node_modules/**";

  const filter = createFilter(include, exclude);

  return {
    name: "markdown-story-plugin",
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
