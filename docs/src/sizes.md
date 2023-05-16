# 定位和大小

在背景图片和人物立绘的地方都可以看到 `<position>` 和 `<size>` 的参数。

本文具体解释这两个参数的取值和行为。

## 定位

```
<position> ::=
  | <horizontal>
  | <vertical>
  | <horizontal> <vertical>
  | <vertical> <horizontal>
  | <percent>
  | <percent> <percent>

<horizontal> ::=
  | left
  | center
  | right

<vertical> ::=
  | top
  | center
  | bottom
```

- 水平方向的 `0%` 与 `left` 相同，`100%` 与 `right` 相同。
- 垂直方向的 `0%` 与 `top` 相同，`100%` 与 `bottom` 相同。

注意如果图片高度与窗口高度相同，那么垂直方向的任何百分比都将失效。

## 大小

```
<size> ::=
  | contain
  | cover
  | fill
  | ( <percent> | auto ) [ <percent> | auto ]

<percent> ::= <number> %
```

如果没有指定 `<size>`，则对于背景默认设置为 `cover`，对于人物立绘默认设置为 `contain`。

- `contain`：将图片缩放，使得其保持最大不会超过屏幕大小的尺寸
- `cover`：将图片缩放，使得其保持最小能覆盖整个屏幕大小的尺寸
- `fill`：拉伸图片使得长宽与屏幕大小相等
- `<percent>`：指定图片宽度与屏幕宽度的百分比，高度等比例缩放
- `<percent> auto`：指定图片宽度与屏幕宽度的百分比，高度等比例缩放
- `<percent> <percent>`：指定图片宽高和屏幕宽高的百分比
- `auto <percent>`：指定图片高度与屏幕高度的百分比，宽度等比例缩放
