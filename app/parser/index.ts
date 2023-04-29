import { remark } from "remark";
import remarkInlineLinks from "remark-inline-links";

import { parseStoryContents } from "./story/contents";
import { ParseContext } from "./utils";
import { serialize } from "./serialize";

function stringify(text: string) {
  if (text.startsWith("\0")) {
    // is variable
    return text.slice(1);
  } else {
    return JSON.stringify(text);
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
      const [type, params] = serialize(action);
      actions.push(
        `yield deserialize(${type}${params
          .map((x) => `, ${stringify(x)}`)
          .join("")});`
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
    `import { deserialize } from "@markdown-story";`,
    ...imports,
    "export default async function* (ctx) {",
    ...preloads,
    ...actions,
    "}",
  ].join("\n");
}

export * from "./types";
export { serialize, deserialize } from "./serialize";
