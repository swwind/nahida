import { remark } from "remark";
import remarkInlineLinks from "remark-inline-links";

import { parseStoryContents } from "./story/contents";
import { STORY_VOCAL } from "./story/image";
import { StoryContext, s } from "./utils";

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
      importUrlMap.set(url, name);
      return name;
    },
    importName(name) {
      if (importNameMap.has(name)) {
        return importNameMap.get(name)!;
      }
      const varname = `name_${imports.length}`;
      imports.push(`const ${varname} = "${name}";`);
      importNameMap.set(name, varname);
      return varname;
    },
    append(code) {
      actions.push(code);
    },
    yield(a) {
      switch (a.type) {
        case "background":
          if (a.imageAnimation) {
            actions.push(
              `yield background(${a.url}, ${s(a.parentAnimation)}, ${s(
                a.imageAnimation
              )});`
            );
          } else if (a.parentAnimation) {
            actions.push(
              `yield background(${a.url}, ${s(a.parentAnimation)});`
            );
          } else {
            actions.push(`yield background(${a.url});`);
          }
          break;
        case "foreground":
          if (a.imageAnimation) {
            actions.push(
              `yield foreground(${a.url}, ${s(a.parentAnimation)}, ${s(
                a.imageAnimation
              )});`
            );
          } else if (a.parentAnimation) {
            actions.push(
              `yield foreground(${a.url}, ${s(a.parentAnimation)});`
            );
          } else {
            actions.push(`yield foreground(${a.url});`);
          }
          break;
        case "character":
          if (a.animation) {
            actions.push(
              `yield character(${a.url}, ${s(a.identity)}, ${s(a.animation)});`
            );
          } else {
            actions.push(`yield character(${a.url}, ${s(a.identity)});`);
          }
          break;
        case "remove-character":
          actions.push(`yield removeCharacter(${s(a.identity)});`);
          break;
        case "text":
          if (a.vocal) {
            actions.push(
              `yield text(${s(a.text)}, ${a.name || `""`}, ${a.vocal});`
            );
          } else if (a.name) {
            actions.push(`yield text(${s(a.text)}, ${a.name});`);
          } else {
            actions.push(`yield text(${s(a.text)});`);
          }
          break;
        case "select":
          actions.push(`yield select(${s(a.options)});`);
          break;
        case "bgm":
          actions.push(`yield backgroundMusic(${a.url});`);
          break;
        case "sfx":
          actions.push(`yield soundEffect(${a.url});`);
          break;
      }
    },
  };

  const vfile = remark().use(remarkInlineLinks).processSync(markdown);
  const ast = remark().parse(vfile);

  parseStoryContents(ctx, ast.children);

  if (ctx.register.has(STORY_VOCAL)) {
    throw new Error("Orphan vocal detected");
  }

  return [
    `import { background, foreground, character, removeCharacter, text, select, backgroundMusic, soundEffect } from "@markdown-story";`,
    ...imports,
    "export default function* (ctx) {",
    ...actions,
    "}",
  ].join("\n");
}

export * from "./types";
