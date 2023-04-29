import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "..";

test("html", () => {
  const story = parseStory(
    [
      "<script>",
      "  const alice = 0.1 + 0.2;",
      "</script>",
      "",
      "<!-- nothing -->",
      "",
      "我觉得你说的很对",
    ].join("\n")
  );

  const result = [
    `export default function* (ctx) {`,
    `const alice = 0.1 + 0.2;`,
    `yield [5, "我觉得你说的很对"];`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("throws on unknown html", () => {
  assert.throws(() => {
    parseStory("<p>hello</p>");
  });
});

test.run();
