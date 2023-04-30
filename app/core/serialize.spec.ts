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

  for (const parentAnimation of ["", "animate", "animate animate"]) {
    for (const imageAnimation of ["", "w-32", "w-32 h-32"]) {
      run({
        type: "character",
        url: "./url",
        identity: "alice",
        parentAnimation,
        imageAnimation,
      });

      run({
        type: "remove-character",
        url: "./url",
        identity: "alice",
        parentAnimation,
        imageAnimation,
      });
    }
  }

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
