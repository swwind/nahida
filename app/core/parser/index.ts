import { remark } from "remark";
import remarkInlineLinks from "remark-inline-links";

import { parseStoryContents } from "./contents";
import { serialize } from "../serialize";
import { Action } from "../types";

export type ImportType = "image" | "audio";

export interface ParseContext {
  name: `\0${string}` | null;
  vocal: `\0${string}` | null;

  import: (url: string, type?: ImportType) => `\0${string}`;
  cache: (name: string) => `\0${string}`;
  append: (code: string) => void;
  yield: (action: Action) => void;
}

function stringify(value: string | boolean | number) {
  if (typeof value === "boolean" || typeof value === "number") {
    return String(value);
  }

  if (value.startsWith("\0")) {
    // is variable
    return value.slice(1);
  } else {
    return JSON.stringify(value);
  }
}

export function parseStory(markdown: string) {
  const imports: string[] = [];
  const preloads: string[] = [];
  const actions: string[] = [];
  const importMap: Map<string, string> = new Map();
  const cacheMap: Map<string, string> = new Map();

  const ctx: ParseContext = {
    name: null,
    vocal: null,
    import(url, type) {
      if (importMap.has(url)) {
        const name = importMap.get(url)!;
        return `\0${name}`;
      }
      const name = `story_${imports.length}`;
      imports.push(`import ${name} from "${url}";`);
      if (type) {
        preloads.push(`ctx.preload(${name}, "${type}");`);
      }
      importMap.set(url, name);
      return `\0${name}`;
    },
    cache(value) {
      if (cacheMap.has(value)) {
        const name = cacheMap.get(value)!;
        return `\0${name}`;
      }
      const name = `name_${imports.length}`;
      imports.push(`const ${name} = "${value}";`);
      cacheMap.set(value, name);
      return `\0${name}`;
    },
    append(code) {
      actions.push(code);
    },
    yield(action) {
      const [type, ...params] = serialize(action);
      actions.push(
        `yield [${type}${params.map((x) => `, ${stringify(x)}`).join("")}];`
      );
    },
  };

  const vfile = remark().use(remarkInlineLinks).processSync(markdown);
  const ast = remark().parse(vfile);

  parseStoryContents(ctx, ast.children);

  if (ctx.vocal) {
    throw new Error("Orphan vocal detected");
  }

  return [
    ...imports,
    "export default function* (ctx) {",
    ...preloads,
    ...actions,
    "}",
  ].join("\n");
}
