## 文法

Markdown Story 的文法完全基于 Markdown，因此您不需要安装任何特殊的编辑器就可以开始编写您的故事。

### 标题与段落

使用标题来说明当前说话的人物，使用 `---` 分隔符来清空当前说话的人物。

每一段独立文本之间使用两个回车分割。

```markdown
# 纳西妲

「你好呀」

# 我

「……你好」

---

突然有个羽毛球上前向我搭话，我莫名感觉到有些慌乱

定睛一看，才发现是个少女
```

### 背景

若要添加/更换背景，可以使用 `![bg <options>](url "<options>")` 的格式进行声明。

- 如果指定了图片的 URL，那么将会最上层插入一个新的图层

  ```markdown
  <!-- 背景会突然出现 -->

  ![bg](./background/image.png)

  <!-- 背景会有一个淡入的效果 -->

  ![bg fade-in](./background/image.png)
  ```

- 如果没有指定 URL，可以使用 # 做占位符。

  此时所有的操作将会对当前最上层的图片进行修改。

  ```markdown
  <!-- 淡出当前的背景 -->

  ![bg fade-out](#)

  <!-- 对当前图片重新播放从上到下的动画 -->

  ![bg](# "cover to to-bottom")
  ```

其中前半部分的可选参数如下：

| 名称               | 作用             | 可选值                  |
| ------------------ | ---------------- | ----------------------- |
| `fade-in`          | 执行淡入动画     |                         |
| `fade-out`         | 执行淡出动画     |                         |
| `duration-<ms>`    | 设置动画时长     | 整数，默认 1000（1s）   |
| `fill-mode-<mode>` | 设置动画结束操作 | `forwards`, `backwards` |

其中后半部分的可选参数如下：

| 名称               | 作用                                   | 可选值                  |
| ------------------ | -------------------------------------- | ----------------------- |
| `cover`            | 缩放图片以占满整个屏幕                 |                         |
| `contain`          | 缩放图片以不超出整个屏幕               |                         |
| `fill`             | 拉伸图片以占满整个屏幕                 |                         |
| `top`              | 图片上边缘与窗口上边缘对齐             |                         |
| `left`             | 图片左边缘与窗口左边缘对齐             |                         |
| `right`            | 图片右边缘与窗口右边缘对齐             |                         |
| `bottom`           | 图片下边缘与窗口下边缘对齐             |                         |
| `to-top`           | 播放动画使得图片上边缘与窗口上边缘对齐 |                         |
| `to-left`          | 播放动画使得图片左边缘与窗口左边缘对齐 |                         |
| `to-right`         | 播放动画使得图片右边缘与窗口右边缘对齐 |                         |
| `to-bottom`        | 播放动画使得图片下边缘与窗口下边缘对齐 |                         |
| `duration-<ms>`    | 设置动画时长                           | 整数，默认 60000（60s） |
| `fill-mode-<mode>` | 设置动画结束操作                       | `forwards`, `backwards` |

此外，可以利用脚注之类的功能减少手动重复多次写同一张背景的次数。

```markdown
![bg fade-in][bg-1]
![bg fade-in][bg-2]
![bg fade-in][bg-1]
![bg fade-in][bg-2]

[bg-1]: ./assets/background/image.png "cover top to-bottom"
[bg-2]: ./assets/background/image.jpg "cover bottom to-top"
```

### 背景音乐

背景音乐使用 `![bgm <options>](url)` 的语法进行声明。

```markdown
<!-- 会先淡出当前正在播放的背景音乐，之后开始播放当前的音乐 -->

![bgm](./bgm/boundless-bliss.mp3)

<!-- 立即暂停当前播放的音乐 -->

![bgm](#pause)

<!-- 立即播放当前播放的音乐 -->

![bgm](#play)
```

### 控制台操作

```markdown
![console](#hide) 隐藏控制台
![console](#show) 显示控制台
```

这个会自动在编译时替换成 `ctx.console.hide()` 和 `ctx.console.show()`。

### 分支选项

很多时候我们会遇到分支选项的情况，我们使用无序列表来让用户进行一次选择。选择的结果会被写回到 `ctx.selection` 中。

```markdown
- 好啊
- 还是算了
```

上面的样例中，如果用户选择 `好啊`，那么 `ctx.selection` 将会是 `0`；如果用户选择了 `还是算了`，那么 `ctx.selection` 将会是 `1`。

之后可以用有序列表来根据用户的选择执行对应的操作。

```
# 纳西妲

1. 「那我们走吧」
2. 「你好冷淡啊」
```

上文中如果您之前选择 `好啊`，那么纳西妲将会回复您 `「那我们走吧」`；反之纳西妲则会说 `「你好冷淡啊」`。

无序列表中只能包含选择项的文本内容，而有序列表中没有这种限制。只要是在对应有序列表项中的内容都会被执行。

### 流程控制

使用连接进行流程的控制。

```markdown
<!-- 转去执行对应文件的脚本，执行完就回来 -->

[goto](./xxx.md)

<!-- 这个不回来 -->

[end](./xxx.md)
```

### 角色语音

角色语音使用 `![v](url)` 的方式声明，会与下一个文本段落自动绑定。

```markdown
# 纳西妲

![v](./vocal/nahida-1.mp3)
「你说的对，但是原神是……」

![v](./vocal/nahida-2.mp3)
「后面忘了」
```

如果语音不能与任何文本匹配，那么会抛出一个编译错误。

### 音效

对于只需要播放一次的简单音效，使用 `![sfx](url)` 的方式声明。

```markdown
![sfx][open_letter]

[open_letter]: ./sfx/open_letter.mp3
```

### 内嵌代码

可以使用 `<script></script>`、` ``` ` 代码块 和 `` `行内代码` `` 的方式进行内嵌 JavaScript 代码。

````markdown
<script>
  var a = 114514;
</script>

```js
var b = 1919810;
```

# 纳西妲

`if (a > b) {`
「我觉得您说的对」
`} else {`
「我觉得您说的不对」
`}`
````

以上代码会被编译成

```js
export default async function* (ctx) {
  var a = 114514;
  var b = 1919810;
  if (a > b) {
    yield text(/* 纳西妲：「我觉得您说的对」 */);
  } else {
    yield text(/* 纳西妲：「我觉得您说的不对」 */);
  }
}
```

具体我们如何内嵌文本可能会改动，但是目标结构不会改变。

## 运行时上下文

脚本在运行的时候会有一个上下文对象 `ctx` 可以用于更加精细地控制游戏的流程。

### `ctx.audio`

这部分用于控制音频部分的操作。

```js
// 切歌，等价于 `![bgm](./xxx)`
ctx.audio.bgm.change("./xxx"); // Promise<HTMLAudioElement>
ctx.audio.bgm.pause();
ctx.audio.bgm.play();
ctx.audio.bgm.mute();
ctx.audio.bgm.unmute();
// 淡入效果，时长 1000
ctx.audio.bgm.fadeIn();
ctx.audio.bgm.fadeIn(1000);
// 淡出效果，时长 1000
ctx.audio.bgm.fadeIn();
ctx.audio.bgm.fadeIn(1000);

// 播放音效
ctx.audio.sfx.play("./xxx"); // Promise<HTMLAudioElement>
```

### `ctx.console`

用于控制控制台。

```js
// = `![cosole](#hide)`
ctx.console.hide();
// = `![cosole](#show)`
ctx.console.show();
```

### `ctx.selection`

存放用户选择结果，也是分支结构的参照。

```markdown
`ctx.selection = 1;`

1. 不可能执行这条语句
2. 肯定会执行这条语句
3. 不可能执行这条语句
```

上面的代码编译后的结果如下

```js
// ...
ctx.selection = 1;
switch (ctx.selection) {
  case 0: {
    yield /* 不可能执行这条语句 */ void 0;
    break;
  }
  case 1: {
    yield /* 肯定会执行这条语句 */ void 0;
    break;
  }
  case 2: {
    yield /* 不可能执行这条语句 */ void 0;
    break;
  }
}
```

### `ctx.backlog`

历史文本信息

```ts
type Backlog = TextLog[];

type TextLog = {
  text: string;
  name: string; // if no then ""
  vocal: string; // if no then ""
};
```
