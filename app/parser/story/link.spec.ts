import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "..";

const heading = `import { deserialize } from "@markdown-story";`;

test("link", () => {
  const story = parseStory(
    [
      `[goto](./sayonara.md)`,
      `[end](./byebye.md)`,
      `[end][badend]`,
      ``,
      `[badend]: ./badend.md`,
    ].join("\n")
  );

  const result = [
    heading,
    `import story_0 from "./sayonara.md";`,
    `import story_1 from "./byebye.md";`,
    `import story_2 from "./badend.md";`,
    `export default function* (ctx) {`,
    `yield *story_0(ctx);`,
    `yield *story_1(ctx);`,
    `return;`,
    `yield *story_2(ctx);`,
    `return;`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("throws on unknown link", () => {
  assert.throws(() => {
    parseStory("[](./story.md)");
  });
});

test.run();
