import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "../parser";

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
      ``,
      `![v](./vocal.wav)`,
      `我总是这么认为`,
      ``,
      `# 纳西妲`,
      ``,
      `![v](./vocal/nahida.wav)`,
      `「你在看什么？」`,
    ].join("\n")
  );

  const result = [
    `import story_0 from "./vocal.wav?url";`,
    `const name_1 = "纳西妲";`,
    `import story_2 from "./vocal/nahida.wav?url";`,
    `export default function* (ctx) {`,
    `ctx.preload(story_0, "audio");`,
    `ctx.preload(story_2, "audio");`,
    `yield [5, "君にしか見えない\\n讨厌总是注视着"];`,
    `yield [5, "何かを見つめる君が嫌いだ\\n盯着别人看的你"];`,
    `yield [5, "見惚れているかのような恋するような\\n讨厌你那看得入迷一般"];`,
    `yield [5, "そんな顔が嫌いだ\\n坠入爱河一般的表情啊"];`,
    `yield [5, "我总是这么认为", "", story_0];`,
    `yield [5, "「你在看什么？」", name_1, story_2];`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test("throws on orphan vocal", () => {
  assert.throws(() => {
    parseStory("![v](./vocal.wav)");
  });
});

test("throws on multiple vocal", () => {
  assert.throws(() => {
    parseStory("![v](./vocal.wav) ![v](./vocal2.wav) 你说的对");
  });
});

test.run();
