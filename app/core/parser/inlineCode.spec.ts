import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "../parser";

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
    `export default function* (ctx) {`,
    `const a = 114514;`,
    `const b = 114514;`,
    `const c = a + b;`,
    `if (a > b) {`,
    `yield [5, "我觉得你说的很对"];`,
    `}`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test.run();
