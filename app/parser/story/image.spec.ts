import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "..";

const heading = `import { deserialize } from "@markdown-story";`;

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
    `ctx.preload(story_1, "image");`,
    `yield deserialize(0, story_1, "fade-in", "cover left to-right");`,
    `yield deserialize(0, story_1, "fade-in");`,
    `yield deserialize(0, story_1, "", "cover left to-right");`,
    `yield deserialize(0, story_1);`,
    `yield deserialize(5, "你们啊，还是太年轻了", name_0);`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("background with references", () => {
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
    `ctx.preload(story_1, "image");`,
    `yield deserialize(0, story_1, "fade-in", "cover top to-bottom");`,
    `yield deserialize(0, story_1, "", "cover top to-bottom");`,
    `yield deserialize(5, "你们啊，还是太年轻了", name_0);`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("foreground", () => {
  const story = parseStory(
    [
      `# Alice`,
      ``,
      `![fg fade-in](./foreground.png "cover left to-right")`,
      `![fg fade-in](./foreground.png)`,
      `![fg](./foreground.png "cover top to-bottom")`,
      `![fg](./foreground.png)`,
      ``,
      `你们啊，还是太年轻了`,
    ].join("\n")
  );

  const result = [
    heading,
    `const name_0 = "Alice";`,
    `import story_1 from "./foreground.png?url";`,
    `export default function* (ctx) {`,
    `ctx.preload(story_1, "image");`,
    `yield deserialize(1, story_1, "fade-in", "cover left to-right");`,
    `yield deserialize(1, story_1, "fade-in");`,
    `yield deserialize(1, story_1, "", "cover top to-bottom");`,
    `yield deserialize(1, story_1);`,
    `yield deserialize(5, "你们啊，还是太年轻了", name_0);`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("foreground with references", () => {
  const story = parseStory(
    [
      `# Alice`,
      ``,
      `![fg fade-in][fg-1]`,
      `![fg][fg-1]`,
      ``,
      `你们啊，还是太年轻了`,
      ``,
      `[fg-1]: ./foreground.png "cover top to-bottom"`,
    ].join("\n")
  );

  const result = [
    heading,
    `const name_0 = "Alice";`,
    `import story_1 from "./foreground.png?url";`,
    `export default function* (ctx) {`,
    `ctx.preload(story_1, "image");`,
    `yield deserialize(1, story_1, "fade-in", "cover top to-bottom");`,
    `yield deserialize(1, story_1, "", "cover top to-bottom");`,
    `yield deserialize(5, "你们啊，还是太年轻了", name_0);`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("bgm", () => {
  const story = parseStory(
    [
      `![bgm](./background-music-1.wav)`,
      `![bgm](./background-music-2.wav)`,
      `![bgm](./background-music-3.wav)`,
      ``,
      `![bgm][bgm-4]`,
      `![bgm][bgm-5]`,
      ``,
      `[bgm-4]: ./background-music-4.wav`,
      `[bgm-5]: ./background-music-5.wav`,
    ].join("\n")
  );

  const result = [
    heading,
    `import story_0 from "./background-music-1.wav?url";`,
    `import story_1 from "./background-music-2.wav?url";`,
    `import story_2 from "./background-music-3.wav?url";`,
    `import story_3 from "./background-music-4.wav?url";`,
    `import story_4 from "./background-music-5.wav?url";`,
    `export default function* (ctx) {`,
    `ctx.preload(story_0, "audio");`,
    `ctx.preload(story_1, "audio");`,
    `ctx.preload(story_2, "audio");`,
    `ctx.preload(story_3, "audio");`,
    `ctx.preload(story_4, "audio");`,
    `yield deserialize(7, story_0);`,
    `yield deserialize(7, story_1);`,
    `yield deserialize(7, story_2);`,
    `yield deserialize(7, story_3);`,
    `yield deserialize(7, story_4);`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("sfx", () => {
  const story = parseStory(
    [
      `![sfx](./sound-effect-1.wav)`,
      `![sfx](./sound-effect-2.wav)`,
      `![sfx](./sound-effect-3.wav)`,
      ``,
      `![sfx][sfx-4]`,
      `![sfx][sfx-5]`,
      ``,
      `[sfx-4]: ./sound-effect-4.wav`,
      `[sfx-5]: ./sound-effect-5.wav`,
    ].join("\n")
  );

  const result = [
    heading,
    `import story_0 from "./sound-effect-1.wav?url";`,
    `import story_1 from "./sound-effect-2.wav?url";`,
    `import story_2 from "./sound-effect-3.wav?url";`,
    `import story_3 from "./sound-effect-4.wav?url";`,
    `import story_4 from "./sound-effect-5.wav?url";`,
    `export default function* (ctx) {`,
    `ctx.preload(story_0, "audio");`,
    `ctx.preload(story_1, "audio");`,
    `ctx.preload(story_2, "audio");`,
    `ctx.preload(story_3, "audio");`,
    `ctx.preload(story_4, "audio");`,
    `yield deserialize(4, story_0);`,
    `yield deserialize(4, story_1);`,
    `yield deserialize(4, story_2);`,
    `yield deserialize(4, story_3);`,
    `yield deserialize(4, story_4);`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("character", () => {
  const story = parseStory(
    [
      `![+alice top-20](./figure/alice.png "w-32")`,
      `![+alice top-30](./figure/alice.png)`,
      ``,
      `![+bob top-30][bob]`,
      `![-bob top-30 fade-out][bob]`,
      ``,
      `[bob]: ./figure/bob.png "w-40"`,
    ].join("\n")
  );

  const result = [
    heading,
    `import story_0 from "./figure/alice.png?url";`,
    `import story_1 from "./figure/bob.png?url";`,
    `export default function* (ctx) {`,
    `ctx.preload(story_0, "image");`,
    `ctx.preload(story_1, "image");`,
    `yield deserialize(2, story_0, "alice", "top-20", "w-32");`,
    `yield deserialize(2, story_0, "alice", "top-30");`,
    `yield deserialize(2, story_1, "bob", "top-30", "w-40");`,
    `yield deserialize(3, story_1, "bob", "top-30 fade-out", "w-40");`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("throws on unknown image", () => {
  assert.throws(() => {
    parseStory(`![](./image.png)`);
  });
});

test.run();
