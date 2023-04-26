import { remark } from "remark";
import remarkInlineLinks from "remark-inline-links";

import { parseStoryContents } from "./story/contents";
import { STORY_VOCAL } from "./story/image";
import { StoryContext } from "./utils";
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
  const actions: string[] = [];
  const imports: string[] = [];
  const importUrlMap: Map<string, string> = new Map();
  const importNameMap: Map<string, string> = new Map();

  const ctx: StoryContext = {
    register: new Map(),
    importUrl(url) {
      if (importUrlMap.has(url)) {
        return importUrlMap.get(url)!;
      }
      const name = `story_${imports.length}`;
      imports.push(`import ${name} from "${url}";`);
      const varname = `\0${name}`;
      importUrlMap.set(url, varname);
      return varname;
    },
    importName(name) {
      if (importNameMap.has(name)) {
        return importNameMap.get(name)!;
      }
      const vname = `name_${imports.length}`;
      imports.push(`const ${vname} = "${name}";`);
      const varname = `\0${vname}`;
      importNameMap.set(name, varname);
      return varname;
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

  if (ctx.register.has(STORY_VOCAL)) {
    throw new Error("Orphan vocal detected");
  }

  return [
    `import { deserialize } from "@markdown-story";`,
    ...imports,
    "export default function* (ctx) {",
    ...actions,
    "}",
  ].join("\n");
}

export * from "./types";
