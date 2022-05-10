# 样式处理

我们先来看一下 `WeEditorPlus` 组件渲染完成后的 `Shadow DOM` 结构

![DOM Tree](/images/shadow.png)

上图是浏览器渲染后得到的完整 DOM 树结构，而我们需要配置的是用红线框出来那部分的样式。

我们可以通过[**全局样式注入**](#全局样式注入)或[**组件样式注入**](#组件样式注入)的方式注入样式规则，然后通过配置 `WeEditorPlus` 的 `containerClass`、`containerStyle`、`toolbarClass`、`toolbarStyle`、`editableClass` 和 `editableStyle` 这六个 `prop` 来动态设置样式。

## 样式注入

### 全局样式注入

```ts
import { weEditorPlusCssRule } from 'wangeditor5-for-vue3'

// 注入 css 文本
weEditorPlusCssRule(`.box { font-size: 18px; color: red; }`)

// 注入 css 文件路径
weEditorPlusCssRule(`xxx/xxx/xxx.css`)
```

### 组件样式注入

组件样式注入主要是通过设置 `WeEditorPlus` 组件的 `cssRule` 属性来实现

```vue
<template>
  <we-editor :css-rule="rule" />
</template>
```

<CodeGroup>
  <CodeGroupItem title="JS">

```js
// 可以是 css 文本
const rule = `.toolbar { border: 1px solid #d9d9d9; }`

// 可以是一个对象
const rule = {
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
const rule = [
  `.toolbar { border: 1px solid #d9d9d9; }`,
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

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```ts
import { WeCssRuleList } from 'wangeditor5-for-vue3'

// 可以是 css 文本
const rule: WeCssRuleList = `.toolbar { border: 1px solid #d9d9d9; }`

// 可以是一个对象
const rule: WeCssRuleList = {
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
const rule: WeCssRuleList = [
  `.toolbar { border: 1px solid #d9d9d9; }`,
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

  </CodeGroupItem>
</CodeGroup>
