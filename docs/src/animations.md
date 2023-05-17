# 转场和动画

所有的动画效果大致分为转场 `<transition>` 和动画 `<animation>` 两种。

两者的主要区别是：

- 转场可以主动跳过，必要的时候可以通过点击直接快进到转场结束
- 当快进的时候，所有转场会被直接跳过
- 动画会随转场一起播放，但不可以被快进，也无法追踪播放进度
- 动画可以设置播放次数、是否循环等，转场只能播放一次

例如，背景图片的淡出属于转场，而图片从左到右的缓慢平移属于动画。

此外，为了方便控制各种转场的时间，我们规定：位于同一个段落之内的所有转场都会同时开始播放。

也就是说，下面的样例中，展示了整个转场的时间线。

```markdown
![bg fade-in 5s](./background.png)
![fig fade-in 3s](./background.png)

你说的对
```

时间线：

```
| 0s | 1s | 2s | 3s | 4s | 5s | 6s |
|------------------------| bg fade-in 5s
|--------------| fig fade-in 3s
                         |---------- text
```

## 转场

转场 `<transition>` 的可选内容如下：

| 名称         | 说明               | 默认值   |
| ------------ | ------------------ | -------- |
| `fade-in`    | 淡入动画           |          |
| `fade-out`   | 淡出动画           |          |
| `conic-in`   | 径向淡入动画       |          |
| `conic-out`  | 径向淡出动画       |          |
| `blinds-in`  | 百叶窗淡入动画     |          |
| `blinds-out` | 百叶窗淡出动画     |          |
| `shake`      | 抖动动画           |          |
| `<time>`     | 设置动画时长       | `1s`     |
| `<easing>`   | 设置动画的时间函数 | `linear` |

其中除 shake 动画外，其他动画都相互冲突。

## 动画

动画 `<animation>` 的可选参数如下：

| 名称                     | 说明               | 默认值   |
| ------------------------ | ------------------ | -------- |
| `to <position> / <size>` | 平移动画           |          |
| `<time>`                 | 设置动画时长       | `60s`    |
| `<easing>`               | 设置动画的时间函数 | `linear` |

如果没有任何动画声明，那么动画时长和动画时间函数的设置将会被忽略。

示例：

- 背景会突然出现

  ```markdown
  ![bg](./background/image.png)
  ```

- 首先淡入图片，播放从上到下的动画。

  之后图片逐渐变成从下向上的动画。

  最后图片淡出。

  ```markdown
  ![bg fade-in](./background/image.png "top to bottom")

  ![bg fade-in](./background/image.png "bottom to top")

  ![bg fade-out](./background/image.png "bottom to top")
  ```

此外，可以利用脚注之类的功能对拥有相同图片动画效果的背景图片进行统一声明，并多次引用。

```markdown
![bg fade-in][bg-1]
![bg fade-in][bg-2]
![bg fade-in][bg-1]
![bg fade-in][bg-2]

[bg-1]: ./assets/background/image.png "top to bottom"
[bg-2]: ./assets/background/image.jpg "bottom to top"
```

## 动画时间线

很多时候由于剧情需要，我们需要更加精细化地控制各类背景、人物素材的转场的开始时间和结束时间。
Markdown Story 提供了一套基于段落的转场控制机制。

简单来说，位于同一段落内的所有转场都会被一起播放。

例如

- 下面的样例中，背景的转场和人物立绘的转场会一起开始播放，并且在他们都播放结束之后才会开始显示下面的文本。

  ```markdown
  ![bg fade-out](./background.png)
  ![fig fade-out](./figure/alice.png "alice")

  「你说的对，但是原神」
  ```

- 下面的样例中，会先播放背景的转场。动画完成之后，人物立绘的转场和文本才会一起开始播放。

  ```markdown
  ![bg fade-out](./background.png)

  ![fig fade-out](./figure/alice.png "alice")
  「你说的对，但是原神」
  ```

此外，同一个段落中不允许出现多次 `![bg]()` 和相同人物立绘的 `![fig]()` 声明。

例如，下面是一些错误的语法：

- 出现了多次 `![bg]()` 动画，由于不能同时播放两个动画于一个对象，因此会产生冲突

  ```markdown
  ![bg fade-out](./background/old.png)
  ![bg fade-in](./background/new.png)
  ```

- 出现了对同一个人物立绘的多次动画

  ```markdown
  ![fig move](./figure/alice.png "alice contain / center")
  ![fig fade-out](./figure/alice.png "alice contain / center")
  ```

  由于 `move` 和 `fade-out` 并不是冲突的动画，如果有必要请写成一条指令中。

  ```markdown
  ![fig fade-out move](./figure/alice.png "alice contain / center")
  ```
