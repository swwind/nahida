import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "..";

const heading = `import { deserialize } from "@markdown-story";`;

test("thematic break", () => {
  const story = parseStory(
    [
      `# Alice`,
      ``,
      `你说的对`,
      ``,
      `---`,
      ``,
      `——爱丽丝如此认为`,
      ``,
      `# Bob`,
      ``,
      `你说的不对`,
      ``,
      `---`,
      ``,
      `——鲍勃却不这么认为`,
    ].join("\n")
  );

  const result = [
    heading,
    `const name_0 = "Alice";`,
    `const name_1 = "Bob";`,
    `export default function* (ctx) {`,
    `yield deserialize(5, "你说的对", name_0);`,
    `yield deserialize(5, "——爱丽丝如此认为");`,
    `yield deserialize(5, "你说的不对", name_1);`,
    `yield deserialize(5, "——鲍勃却不这么认为");`,
    `}`,
  ].join("\n");

  assert.equal(story, result);
});

test.run();
