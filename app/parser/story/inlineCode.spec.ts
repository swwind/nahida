import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "..";

const heading = `import { deserialize } from "@markdown-story";`;

test("inline code", () => {
  const story = parseStory(
    [
      "`const a = 114514;`",
      "`const b = 114514;` `const c = a + b;`",
      "",
      "`if (a > b) {` 我觉得你说的很对 `}`",
    ].join("\n")
  );

  const result = [
    heading,
    `export default async function* (ctx) {`,
    `const a = 114514;`,
    `const b = 114514;`,
    `const c = a + b;`,
    `if (a > b) {`,
    `yield deserialize(5, "我觉得你说的很对");`,
    `}`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test.run();
