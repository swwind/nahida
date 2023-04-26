import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "../app/parser";

const heading = `import { background, foreground, character, removeCharacter, text, select, backgroundMusic, soundEffect } from "@markdown-story";`;

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
      `# `,
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
    `yield text("你说的对", name_0);`,
    `yield text("你说的不对", name_1);`,
    `yield text("我突然明白了什么", name_0, story_2);`,
    `yield text("我恍然大悟");`,
    `yield text("我好像明白了什么", "", story_3);`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("text", () => {
  const story = parseStory(
    [
      `君にしか見えない`,
      `讨厌总是注视着`,
      ``,
      `何かを見つめる君が嫌いだ`,
      `盯着别人看的你`,
      ``,
      `見惚れているかのような恋するような`,
      `讨厌你那看得入迷一般`,
      ``,
      `そんな顔が嫌いだ`,
      `坠入爱河一般的表情啊`,
    ].join("\n")
  );

  const result = [
    heading,
    `export default function* (ctx) {`,
    `yield text("君にしか見えない\\n讨厌总是注视着");`,
    `yield text("何かを見つめる君が嫌いだ\\n盯着别人看的你");`,
    `yield text("見惚れているかのような恋するような\\n讨厌你那看得入迷一般");`,
    `yield text("そんな顔が嫌いだ\\n坠入爱河一般的表情啊");`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

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
    heading,
    `export default function* (ctx) {`,
    `yield select(["君にしか見えない","何かを見つめる君が嫌いだ","見惚れているかのような恋するような","そんな顔が嫌いだ"]);`,
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
    heading,
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
    `yield text("你说的对，但是原神是一款由米哈游自主研发的");`,
    `break;`,
    `}`,
    `}`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

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

test("image", () => {
  const story = parseStory(
    [
      `![bg](./background/bg-1.png)`,
      `![fg](./foreground/fg-1.png)`,
      `![v](./vocal/vocal.wav)`,
      `![bgm](./bgm/bgm.mp3)`,
      `![+alice][alice-stand]`,
      `![+alice][alice-sit]`,
      `![+alice][alice-sit]`,
      `![-alice][alice-sit]`,
      `你们说的对`,
      ``,
      `[alice-stand]: ./char/alice/stand.png`,
      `[alice-sit]: ./char/alice/sit.png`,
    ].join("\n")
  );

  const result = [
    heading,
    `import story_0 from "./background/bg-1.png?url";`,
    `import story_1 from "./foreground/fg-1.png?url";`,
    `import story_2 from "./vocal/vocal.wav?url";`,
    `import story_3 from "./bgm/bgm.mp3?url";`,
    `import story_4 from "./char/alice/stand.png?url";`,
    `import story_5 from "./char/alice/sit.png?url";`,
    `export default function* (ctx) {`,
    `yield background(story_0);`,
    `yield foreground(story_1);`,
    `yield backgroundMusic(story_3);`,
    `yield character(story_4, "alice");`,
    `yield character(story_5, "alice");`,
    `yield character(story_5, "alice");`,
    `yield removeCharacter("alice");`,
    `yield text("你们说的对", "", story_2);`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("code", () => {
  const story = parseStory(
    [
      `<script>`,
      `  var a = 114514;`,
      `</script>`,
      ``,
      `\`\`\`js`,
      `var b = 1919810;`,
      `\`\`\``,
      ``,
      `\`if (a > b) {\``,
      `你说的对`,
      `\`}\``,
    ].join("\n")
  );

  const result = [
    heading,
    `export default function* (ctx) {`,
    `var a = 114514;`,
    `var b = 1919810;`,
    `if (a > b) {`,
    `yield text("你说的对");`,
    `}`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test.run();
