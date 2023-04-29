import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "..";

test("options", () => {
  const story = parseStory(
    [
      `- 君にしか見えない`,
      `- 何かを見つめる君が嫌いだ`,
      `- 見惚れているかのような恋するような`,
      `- そんな顔が嫌いだ`,
    ].join("\n")
  );

  const result = [
    `export default function* (ctx) {`,
    `yield [6, "君にしか見えない", "何かを見つめる君が嫌いだ", "見惚れているかのような恋するような", "そんな顔が嫌いだ"];`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("branch", () => {
  const story = parseStory(
    [
      `1. [goto](./sayonara.md)`,
      `2. [end](./byebye.md)`,
      `3. <!-- do nothing -->`,
      `4. 你说的对，但是原神是一款由米哈游自主研发的`,
    ].join("\n")
  );

  const result = [
    `import story_0 from "./sayonara.md";`,
    `import story_1 from "./byebye.md";`,
    `export default function* (ctx) {`,
    `switch (ctx.selection) {`,
    `case 0: {`,
    `yield *story_0(ctx);`,
    `break;`,
    `}`,
    `case 1: {`,
    `yield *story_1(ctx);`,
    `return;`,
    `break;`,
    `}`,
    `case 2: {`,
    `break;`,
    `}`,
    `case 3: {`,
    `yield [5, "你说的对，但是原神是一款由米哈游自主研发的"];`,
    `break;`,
    `}`,
    `}`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("throws on unknown stmts in unordered list", () => {
  assert.throws(() => {
    parseStory("- [end](./baidu.md)");
  });
});

test.run();
