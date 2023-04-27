import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "..";

const heading = `import { deserialize } from "@markdown-story";`;

test("headings", () => {
  const story = parseStory(
    [
      `# Alice`,
      ``,
      `你说的对`,
      ``,
      `# Bob`,
      ``,
      `你说的不对`,
      ``,
      `# Alice`,
      ``,
      `![v](./vocal/alice.wav)`,
      `我突然明白了什么`,
      ``,
      `---`,
      ``,
      `我恍然大悟`,
      ``,
      `![v](./vocal/alice2.wav)`,
      `我好像明白了什么`,
    ].join("\n")
  );

  const result = [
    heading,
    `const name_0 = "Alice";`,
    `const name_1 = "Bob";`,
    `import story_2 from "./vocal/alice.wav?url";`,
    `import story_3 from "./vocal/alice2.wav?url";`,
    `export default function* (ctx) {`,
    `yield deserialize(5, "你说的对", name_0);`,
    `yield deserialize(5, "你说的不对", name_1);`,
    `yield deserialize(5, "我突然明白了什么", name_0, story_2);`,
    `yield deserialize(5, "我恍然大悟");`,
    `yield deserialize(5, "我好像明白了什么", "", story_3);`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("heading panic on link in head", () => {
  assert.throws(() => {
    parseStory(`# [alice](./alice.png)`);
  });
});

test("heading panic on multiple child", () => {
  assert.throws(() => {
    parseStory("# text hello `code`");
  });
});

test("throw on empty heading", () => {
  assert.throws(() => {
    parseStory("# ");
  });
});

test.run();
