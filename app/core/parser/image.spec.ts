import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "../parser";

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
    `const name_0 = "Alice";`,
    `import story_1 from "./background.png?url";`,
    `export default function* (ctx) {`,
    `ctx.preload(story_1, "image");`,
    `yield [0, story_1, "fade-in", "cover left to-right"];`,
    `yield [0, story_1, "fade-in"];`,
    `yield [0, story_1, "", "cover left to-right"];`,
    `yield [0, story_1];`,
    `yield [5, "你们啊，还是太年轻了", name_0];`,
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
    `const name_0 = "Alice";`,
    `import story_1 from "./background.png?url";`,
    `export default function* (ctx) {`,
    `ctx.preload(story_1, "image");`,
    `yield [0, story_1, "fade-in", "cover top to-bottom"];`,
    `yield [0, story_1, "", "cover top to-bottom"];`,
    `yield [5, "你们啊，还是太年轻了", name_0];`,
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
    `const name_0 = "Alice";`,
    `import story_1 from "./foreground.png?url";`,
    `export default function* (ctx) {`,
    `ctx.preload(story_1, "image");`,
    `yield [1, story_1, "fade-in", "cover left to-right"];`,
    `yield [1, story_1, "fade-in"];`,
    `yield [1, story_1, "", "cover top to-bottom"];`,
    `yield [1, story_1];`,
    `yield [5, "你们啊，还是太年轻了", name_0];`,
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
    `const name_0 = "Alice";`,
    `import story_1 from "./foreground.png?url";`,
    `export default function* (ctx) {`,
    `ctx.preload(story_1, "image");`,
    `yield [1, story_1, "fade-in", "cover top to-bottom"];`,
    `yield [1, story_1, "", "cover top to-bottom"];`,
    `yield [5, "你们啊，还是太年轻了", name_0];`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("console and wait", () => {
  const story = parseStory(
    [
      `![console](#show)`,
      `![console](#hide)`,
      `![console](#wait)`,
      `![console](#wait "2000")`,
    ].join("\n")
  );

  const result = [
    `export default function* (ctx) {`,
    `yield [9, true];`,
    `yield [9];`,
    `yield [8, 1000];`,
    `yield [8, 2000];`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("console invalid actions", () => {
  assert.throws(() => {
    parseStory(`![console](#nahida)`);
  });
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
    `yield [7, story_0];`,
    `yield [7, story_1];`,
    `yield [7, story_2];`,
    `yield [7, story_3];`,
    `yield [7, story_4];`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("bgm actions", () => {
  const story = parseStory(
    [
      `![bgm](#play)`,
      `![bgm](#pause)`,
      `![bgm](#mute)`,
      `![bgm](#unmute)`,
      `![bgm](#fade-in)`,
      `![bgm](#fade-in "2000")`,
      `![bgm](#fade-out)`,
      `![bgm](#fade-out "3000")`,
    ].join("\n")
  );

  const result = [
    `export default function* (ctx) {`,
    `ctx.audio.bgm.play();`,
    `ctx.audio.bgm.pause();`,
    `ctx.audio.bgm.mute();`,
    `ctx.audio.bgm.unmute();`,
    `ctx.audio.bgm.fadeIn();`,
    `ctx.audio.bgm.fadeIn(2000);`,
    `ctx.audio.bgm.fadeOut();`,
    `ctx.audio.bgm.fadeOut(3000);`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("bgm invalid actions", () => {
  assert.throws(() => {
    parseStory(`![bgm](#nahida)`);
  });
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
    `yield [4, story_0];`,
    `yield [4, story_1];`,
    `yield [4, story_2];`,
    `yield [4, story_3];`,
    `yield [4, story_4];`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("figure", () => {
  const story = parseStory(
    [
      `![fig](./figure/alice.png "alice")`,
      `![fig](./figure/alice.png "alice 30%")`,
      `![fig](./figure/alice.png "alice contain / left")`,
      `![fig](./figure/alice.png "alice cover / left 20px top 40px")`,
      `![fig](./figure/alice.png "alice / center")`,
      `![fig](#remove "alice")`,
    ].join("\n")
  );

  const result = [
    `import story_0 from "./figure/alice.png?url";`,
    `export default function* (ctx) {`,
    `ctx.preload(story_0, "image");`,
    `yield [2, story_0, "alice"];`,
    `yield [2, story_0, "alice", "30%"];`,
    `yield [2, story_0, "alice", "contain", "left"];`,
    `yield [2, story_0, "alice", "cover", "left 20px top 40px"];`,
    `yield [2, story_0, "alice", "", "center"];`,
    `yield [3, "alice"];`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("throws on unknown figure action", () => {
  assert.throws(() => {
    parseStory(`![fig](#nahida)`);
  });
});

test("throws on unknown figure without name", () => {
  assert.throws(() => {
    parseStory(`![fig](./figure/alice.png)`);
  });
});

test("throws on unknown figure action without name", () => {
  assert.throws(() => {
    parseStory(`![fig](#remove)`);
  });
});

test("throws on unknown image", () => {
  assert.throws(() => {
    parseStory(`![](./image.png)`);
  });
});

test.run();
