import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "..";

test("html", () => {
  const story = parseStory(
    [
      "```js",
      "function add(a, b) {",
      "  return a + b;",
      "}",
      "const alice = add(0.1, 0.2);",
      "```",
      "",
      "我觉得你说的很对",
    ].join("\n")
  );

  const result = [
    `export default function* (ctx) {`,
    `function add(a, b) {`,
    `  return a + b;`,
    `}`,
    `const alice = add(0.1, 0.2);`,
    `yield [5, "我觉得你说的很对"];`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test.run();
