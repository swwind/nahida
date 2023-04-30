import { test } from "uvu";
import * as assert from "uvu/assert";
import { parseStory } from "../parser";

test("throws on unknown content", () => {
  assert.throws(() => {
    parseStory(`> hello world`);
  });
});

test.run();
