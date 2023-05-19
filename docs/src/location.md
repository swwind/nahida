# 定位和大小

在背景图片和人物立绘的地方都可以看到 `<position>` 和 `<size>` 的参数。

本文具体解释这两个参数的取值和行为。

## 定位

```
<position> ::=
  | <position-1>
  | <position-2>
  | <position-3>
  | <position-4>

<position-1> ::=
  | <position-x>
  | <position-y>
  | center
  | <percentage>

<position-x> ::= left | right
<position-y> ::= top | bottom
<percentage> ::= <float32> %

<position-2> ::=
  | <position-x> <position-y>
  | <position-y> <position-x>
  | ( <percentage> | center ) <position-y>
  | <position-x> ( <percentage> | center )
  | ( <percentage> | center ) ( <percentage> | center )

<position-3> ::=
  | ( <position-x> | center ) <position-y> <percentage>
  | ( <position-y> | center ) <position-x> <percentage>
  | <position-x> <percentage> ( <position-y> | center )
  | <position-y> <percentage> ( <position-x> | center )

<position-4> ::=
  | <position-x> <percentage> <position-y> <percentage>
  | <position-y> <percentage> <position-x> <percentage>
```

- 水平方向的 `0%` 与 `left` 相同，`100%` 与 `right` 相同。
- 垂直方向的 `0%` 与 `top` 相同，`100%` 与 `bottom` 相同。

注意如果图片高度与窗口高度相同，那么垂直方向的任何百分比都没有区别。

可以参考 CSS 标准中的 [background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) 属性。

## 大小

```
<size> ::=
  | contain
  | cover
  | fill
  | ( <percentage> | auto )
  | ( <percentage> | auto ) ( <percentage> | auto )
```

如果没有指定 `<size>`，则默认设置为 `auto`。

- `contain`：将图片缩放，使得其保持最大不会超过屏幕大小的尺寸
- `cover`：将图片缩放，使得其保持最小能覆盖整个屏幕大小的尺寸
- `fill`：拉伸图片使得长宽与屏幕大小相等
- `auto`：相当于 `contain`
- `auto auto`：相当于 `contain`
- `<percent>`：指定图片宽度与屏幕宽度的百分比，高度等比例缩放
- `<percent> auto`：指定图片宽度与屏幕宽度的百分比，高度等比例缩放
- `auto <percent>`：指定图片高度与屏幕高度的百分比，宽度等比例缩放
- `<percent> <percent>`：指定图片宽高和屏幕宽高的百分比

可以参考 CSS 标准中的 [background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) 属性，不同的是此处的百分比是相对于屏幕大小的。
