# 文法

Markdown Story 的文法完全基于 Markdown，因此您不需要对您的编辑器进行任何配置就可以开始编写您的故事。

## 标题与段落

使用标题来说明当前说话的人物，使用 `---` 分隔符来清空当前说话的人物。

每一段独立文本之间使用两个回车分割。

```markdown
# 纳西妲

「你好呀」

# 我

「……」

「……你好」

---

突然有个羽毛球上前向我搭话，我莫名感觉到有些慌乱

定睛一看，才发现是个少女
```

上面的样例中，所有位于 `# 我` 和 `---` 之间的文本都会被当作 `我` 说的。

## 背景

若要添加/更换背景，可以使用 `![bg <animation-1>](url "<animation-2>")` 的格式进行声明。

### 转场动画

其中 `<animation-1>` 部分是转场动画，可选参数如下：

| 名称            | 作用               | 默认值 |
| --------------- | ------------------ | ------ |
| `fade-in`       | 执行淡入动画       |        |
| `fade-out`      | 执行淡出动画       |        |
| `conic-in`      | 执行径向淡入动画   |        |
| `conic-out`     | 执行径向淡出动画   |        |
| `blinds-in`     | 执行百叶窗淡入动画 |        |
| `blinds-out`    | 执行百叶窗淡出动画 |        |
| `duration-<ms>` | 设置动画时长       | `1000` |

- 如果指定的 URL 与当前图片**相同**，那么转场动画会直接应用于当前的图片。
- 如果指定的 URL 与当前图片**不同**，那么将会插入一张新图片并开始转场动画，并在动画结束之后移除之前的背景图片。
- 如果没有指定任何转场动画效果，那么图片就会突然出现。

示例：

- 背景会突然出现

  ```markdown
  ![bg](./background/image.png)
  ```

- 背景会有一个淡入的效果

  ```markdown
  ![bg fade-in](./background/image.png)
  ```

### 图片动画

其中 `<animation-2>` 部分是图片的动画效果，其中可选参数如下：

| 名称            | 作用                     | 默认值 |
| --------------- | ------------------------ | ------ |
| `cover`         | 缩放图片以占满整个屏幕   |        |
| `contain`       | 缩放图片以不超出整个屏幕 |        |
| `fill`          | 拉伸图片以占满整个屏幕   |        |
| `<scale>%`      | 以指定的比例缩放图片     |        |
| `top`           | 图片上对齐               |        |
| `left`          | 图片左对齐               |        |
| `right`         | 图片右对齐               |        |
| `bottom`        | 图片下对齐               |        |
| `to-top`        | 播放动画使得图片上对齐   |        |
| `to-left`       | 播放动画使得图片左对齐   |        |
| `to-right`      | 播放动画使得图片右对齐   |        |
| `to-bottom`     | 播放动画使得图片下对齐   |        |
| `duration-<ms>` | 设置动画时长             | 60000  |

示例：

- 背景缩放以占满整个屏幕，并且播放从上到下的动画，动画时长 30 秒

  ```markdown
  ![bg](./background/image.png "cover top to-bottom duration-30000")
  ```

- 背景缩放以不超出屏幕

  ```markdown
  ![bg](./background/image.png "contain")
  ```

此外，可以利用脚注之类的功能对拥有相同图片动画效果的背景图片进行统一声明，并多次引用。

```markdown
![bg fade-in][bg-1]
![bg fade-in][bg-2]
![bg fade-in][bg-1]
![bg fade-in][bg-2]

[bg-1]: ./assets/background/image.png "cover top to-bottom"
[bg-2]: ./assets/background/image.jpg "cover bottom to-top"
```

## 人物立绘

人物立绘使用 `![fig](url "<name> [<size>] [/ <position>]")` 的方式来进行初始化声明。

- `<name>` 用于唯一确定立绘的人物名称，以便后续操作的时候方便区分目标。
- `<size>` 用于指定立绘的大小，将会被直接传递给 `background-size` 属性。
- `<position>` 用于指定立绘的位置，将会被直接传递给 `background-position` 属性。

当需要对人物立绘进行更新的时候，只需要给予相同的人物名称即可。

示例：

- 放一张纳西妲的立绘，缩放 30%，位于左起 20%，上起 40% 的位置。

  ```markdown
  ![fig](./figure/nahida-stand.png "nahida 30% / 20% 40%")
  ```

- 放一张纳西妲的立绘，缩放以不超出屏幕范围，位于画面的正中央

  ```markdown
  ![fig](./figure/nahida-stand.png "nahida contain")
  ```

- 放一张纳西妲的立绘，并在 3 秒钟之后移动到画面左侧

  ```markdown
  ![fig](./figure/nahida-stand.png "nahida contain")
  ![console](#wait "3000")
  ![fig](./figure/nahida-stand.png "nahida contain / left")
  ```

当需要移除立绘的时候，使用 `![fig](#remove "<name>")` 操作。

示例：

- 移除纳西妲的立绘

  ```markdown
  ![fig](./figure/nahida-stand.png "nahida")
  ![fig](#remove "nahida")
  ```

## 背景音乐

背景音乐使用 `![bgm](url)` 的语法进行声明。

引擎会先淡出当前正在播放的背景音乐，之后开始播放当前的音乐。

```markdown
![bgm](./bgm/boundless-bliss.mp3)
```

## 控制台操作

- 隐藏控制台

  ```markdown
  ![console](#hide)
  ```

- 显示控制台

  ```markdown
  ![console](#show)
  ```

- 原地等待若干时间（毫秒）

  ```markdown
  ![console](#wait "2000")
  ```

## 流程控制

使用链接元素进行流程的控制。

- 跳转到其他剧情文件

  ```markdown
  [goto](./xxx.md)
  ```

- 跳转到其他剧情文件并结束游戏

  ```markdown
  [end](./xxx.md)
  ```

## 分支选项

我们使用无序列表来迫使用户做出一次选择。

无序列表中只能包含纯文本内容。

```markdown
- 好啊
- 还是算了
```

之后可以用有序列表来根据用户的选择执行对应的操作。

有序列表中可以包含任何可解析的标签，当用户在上一次选择某条分支之后，程序会自动执行对应分支内的代码。

```markdown
1. [goto](./happy_end.md)
2. [goto](./bad_end.md)
```

上文中如果您之前选择 `好啊`，那么将会跳转到 `./happy_end.md` 中的剧情，否则会跳转到 `./bad_end.md` 中的剧情。

## 角色语音

角色语音使用 `![v](url)` 的方式声明，会与下一个文本段落自动绑定。

```markdown
# 纳西妲

![v](./vocal/nahida-1.mp3)
「你说的对，但是原神是……」

![v](./vocal/nahida-2.mp3)
「后面忘了」
```

如果语音不能与任何文本匹配，那么会抛出一个编译错误。

## 音效

对于只需要播放一次的简单音效，使用 `![sfx](url)` 的方式声明。

```markdown
![sfx][open_letter]

[open_letter]: ./sfx/open_letter.mp3
```

## 内嵌代码

可以使用 `<script></script>` 标签、代码块，以及行内代码的方式进行内嵌 JavaScript 代码。

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
    yield /* 纳西妲：「我觉得您说的对」 */ [];
  } else {
    yield /* 纳西妲：「我觉得您说的不对」 */ [];
  }
}
```

关于程序运行时的上下文对象 `ctx`，可以查看关于 `ctx` 的有关文档。
