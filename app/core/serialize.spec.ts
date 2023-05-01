import { test } from "uvu";
import * as assert from "uvu/assert";
import { serialize, deserialize, shorten } from "./serialize";
import { Action } from "./types";

test("shorten", () => {
  assert.equal(shorten("alice", "", "bob", "", ""), ["alice", "", "bob"]);
  assert.equal(shorten("alice", "", "bob", ""), ["alice", "", "bob"]);
  assert.equal(shorten("alice", "", "bob"), ["alice", "", "bob"]);

  assert.equal(shorten("alice", "bob", "", ""), ["alice", "bob"]);
  assert.equal(shorten("alice", "bob", ""), ["alice", "bob"]);
  assert.equal(shorten("alice", "bob"), ["alice", "bob"]);

  assert.equal(shorten("", "bob", "", ""), ["", "bob"]);
  assert.equal(shorten("", "bob", ""), ["", "bob"]);
  assert.equal(shorten("", "bob"), ["", "bob"]);

  assert.equal(shorten("bob", "", ""), ["bob"]);
  assert.equal(shorten("bob", ""), ["bob"]);
  assert.equal(shorten("bob"), ["bob"]);

  assert.equal(shorten("", ""), []);
  assert.equal(shorten(""), []);
  assert.equal(shorten(), []);
});

function run(action: Action) {
  const [type, ...params] = serialize(action);
  assert.equal(action, deserialize(type, ...params));
}

test("serialize", () => {
  for (const parentAnimation of ["", "parentAnimation"]) {
    for (const imageAnimation of ["", "imageAnimation"]) {
      run({
        type: "background",
        url: "./test",
        parentAnimation,
        imageAnimation,
      });

      run({
        type: "foreground",
        url: "./test",
        parentAnimation,
        imageAnimation,
      });
    }
  }

  for (const size of ["", "cover", "30% 40%"]) {
    for (const position of ["", "left", "left 20px top 40px"]) {
      run({
        type: "figure",
        url: "./url",
        identity: "alice",
        size,
        position,
      });
    }
  }

  run({ type: "remove-figure", identity: "alice" });

  for (const name of ["", "alice", "bob"]) {
    for (const vocal of ["", "./vocal"]) {
      run({ type: "text", text: "What the fuck", name, vocal });
    }
  }

  run({ type: "sfx", url: "./sfx" });
  run({ type: "bgm", url: "./bgm" });

  run({ type: "select", options: ["must have one"] });
  run({ type: "select", options: ["must have one", "maybe two"] });

  run({ type: "console", visible: true });
  run({ type: "console", visible: false });

  run({ type: "wait", time: 0 });
  run({ type: "wait", time: 114514 });
});

test.run();
