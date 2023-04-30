# 运行时上下文

当您在内嵌 JavaScript 代码的时候会有一个上下文对象，方便您进行一些比较复杂的操作。

## `ctx.selection`

存放用户选择结果，也是分支结构的参照。

```markdown
`ctx.selection = 1;`

1. 前面忘了
2. 但是原神是一款由米哈游自主研发的
3. 后面忘了
```

上面的代码编译后的结果如下

```js
// ...
ctx.selection = 1;
switch (ctx.selection) {
  case 0: {
    yield /* 前面忘了 */ [];
    break;
  }
  case 1: {
    yield /* 但是原神是一款由米哈游自主研发的 */ [];
    break;
  }
  case 2: {
    yield /* 后面忘了 */ [];
    break;
  }
}
```

## `ctx.audio`

这部分用于控制音频部分的操作。

```js
// 切歌，等价于 `![bgm](./xxx)`，当开始播放的时候 resolve
ctx.audio.bgm.change("./xxx"); // Promise<HTMLAudioElement>
ctx.audio.bgm.pause();
ctx.audio.bgm.play();
ctx.audio.bgm.mute();
ctx.audio.bgm.unmute();
// 淡入效果，默认时长 1000（毫秒）
ctx.audio.bgm.fadeIn();
ctx.audio.bgm.fadeIn(1000);
// 淡出效果，默认时长 1000（毫秒）
ctx.audio.bgm.fadeOut();
ctx.audio.bgm.fadeOut(1000);

// 播放音效，等价于 `![sfx](./xxx)`，当开始播放的时候 resolve
ctx.audio.sfx.play("./xxx"); // Promise<HTMLAudioElement>
```
