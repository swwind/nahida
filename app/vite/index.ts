import type { Plugin } from "vite";
import { createFilter } from "rollup-pluginutils";
import { parseStory } from "../parser";

type Options = {
  include?: string;
  exclude?: string;

  deserializeSource?: string;
};

const virtualId = `@markdown-story`;

export function markdownStory(options?: Options): Plugin {
  const include = options?.include ?? "src/**/*.md";
  const exclude = options?.exclude ?? "node_modules/**";
  const deserializeSource =
    options?.deserializeSource ?? "markdown-story/parser";

  const filter = createFilter(include, exclude);

  return {
    name: "markdown-story-plugin",
    resolveId(id) {
      if (id === virtualId) {
        return {
          id: deserializeSource,
          external: false,
        };
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
