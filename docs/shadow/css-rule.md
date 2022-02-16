# 样式处理

我们先来看一下 `WeEditor` 组件渲染完成后的 DOM 结构

![DOM Tree](/images/shadow.png)

上图是浏览器渲染后得到的完整 DOM 树结构，而我们需要配置的是用红线框出来那部分的样式。默认情况下已经对**菜单栏节点**、**编辑区节点**和**菜单栏和编辑区的公共父节点**都赋值了 `class` 值，但是对应的 `class` 并没有样式规则，需要使用这自己定义样式规则。

我们可以通过**全局样式注入**或**组件样式注入**的方式直接定义样式，同时 `WeEditor` 组件还支持通过 `toolbarClass`、`toolbarStyle`、`editableClass` 和 `editableStyle` 这四个 `prop` 来动态设置样式。

## 样式注入

样式注入分为**全局样式注入**和**组件样式注入**

### 全局样式注入

```ts
import { shadowCssRule } from 'wangeditor5-for-vue3'

// 注入 css 文本
shadowCssRule(`.box { font-size: 18px; color: red; }`)

// 注入 css 文件路径
shadowCssRule(`xxx/xxx/xxx.css`)
```

### 组件样式注入

组件样式注入主要是通过设置 `WeEditor` 组件的 `cssRule` 属性来实现

```html
<template>
  <we-editor :css-rule="rule" />
</template>
```

```ts
// 可以是 css 文本
const rule: CssRuleList = `.toolbar { border: 1px solid #d9d9d9; }`

// 可以是 css 文件的路径
const rule: CssRuleList = `xxx/xxx/xxx.css`

// 可以是一个对象
const rule: CssRuleList = {
  '.container': {
    zIndex: 100,
  },
  '.toolbar': {
    color: 'pink',
  },
  '.editable': {
    height: '500px',
  },
}

// 还可以是一个数组
const rule: CssRuleList = [
  `.toolbar { border: 1px solid #d9d9d9; }`,
  `xxx/xxx/xxx.css`,
  {
    '.container': {
      zIndex: 100,
    },
    '.toolbar': {
      color: 'pink',
    },
    '.editable': {
      height: '500px',
    },
  },
]
```

## prop 属性

`toolbarClass`、和 `editableClass` 定义的类名必须是已经注入过 `css` 规则的，否则并不会生效，因为未注入 `css` 规则的类名就是个空类名。
