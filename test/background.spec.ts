import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "../app/parser";

const heading = `import { background, foreground, character, removeCharacter, text, select, backgroundMusic, soundEffect } from "@markdown-story";`;

test("background", () => {
  const story = parseStory(
    [
      `# Alice`,
      ``,
      `![bg fade-in](./background.png "cover left to-right")`,
      `![bg fade-in](./background.png)`,
      `![bg](./background.png "cover left to-right")`,
      `![bg](./background.png)`,
      ``,
      `你们啊，还是太年轻了`,
    ].join("\n")
  );

  const result = [
    heading,
    `const name_0 = "Alice";`,
    `import story_1 from "./background.png?url";`,
    `export default function* (ctx) {`,
    `yield background(story_1, "fade-in", "cover left to-right");`,
    `yield background(story_1, "fade-in");`,
    `yield background(story_1, "", "cover left to-right");`,
    `yield background(story_1);`,
    `yield text("你们啊，还是太年轻了", name_0);`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("background-2", () => {
  const story = parseStory(
    [
      `# Alice`,
      ``,
      `![bg fade-in][bg-1]`,
      `![bg][bg-1]`,
      ``,
      `你们啊，还是太年轻了`,
      ``,
      `[bg-1]: ./background.png "cover top to-bottom"`,
    ].join("\n")
  );

  const result = [
    heading,
    `const name_0 = "Alice";`,
    `import story_1 from "./background.png?url";`,
    `export default function* (ctx) {`,
    `yield background(story_1, "fade-in", "cover top to-bottom");`,
    `yield background(story_1, "", "cover top to-bottom");`,
    `yield text("你们啊，还是太年轻了", name_0);`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test.run();
