# 快速开始

## 组件注册

### 全局注册

```ts
import App from './App.vue'

import { createApp } from 'vue'
import { weEditorPlusCssRule, WeEditorPlus } from 'wangeditor5-for-vue3'

// 将 wangEditor 的 css 文件引入为 纯文本/路径
import wecss from '@wangeditor/editor/dist/css/style.css' // vite

// 注入到 shadow dom 中。
// 注入的样式是全局性的（注入的 css 会影响后续创建的每一个编辑器）
weEditorPlusCssRule(wecss)

const app = createApp(App)

app.component(WeEditorPlus.name, WeEditorPlus)

app.mount('#app')
```

### 局部注册

```ts
import { defineComponent } from 'vue'
import { weEditorPlusCssRule, WeEditorPlus } from 'wangeditor5-for-vue3'

import wecss from '@wangeditor/editor/dist/css/style.css' // vite

weEditorPlusCssRule(wecss)

export default defineComponent({
  components: { WeEditorPlus },
})
```

## 使用示例

```html
<template>
  <we-editor-plus
    container-class="container"
    container-style="border: 1px solid #d9d9d9"
    toolbar-class="border"
    editable-class="border"
    toolbar-style="color: red"
    editable-style="font-size: 18px"
    :toolbar-option="toolbar"
    :editable-option="editable"
    :toolbar-reloadbefore="onToolbarloadBefore"
    :editable-reloadbefore="onEditableReloadBefore"
    :css-rule="cssRule"
    v-model="formData.json"
    v-model:json="formData.jsonStr"
    v-model:html="formData.html"
  />
</template>
```

```ts
import { WeCssRuleList, WeEditableOption, WeToolbarOption, useWangEditor } from 'wangeditor5-for-vue3'
import { computed, defineComponent, ref, shallowReactive } from 'vue'
import { IDomEditor, Toolbar, SlateDescendant } from '@wangeditor/editor'

export default defineComponent({
  components: { UPrism },
  setup() {
    // useWangEditor() 的使用和常规模式下的使用时一样的
    const { editable, toolbar, getEditable, getToolbar, clearContent, reloadEditor } = useWangEditor()

    // 注意：是 shallowReactive 而不是 reactive
    const formData = shallowReactive({
      json: [] as SlateDescendant[],
      jsonStr: '',
      html: '',
    })

    // 组件级的样式注入
    const cssRule: WeCssRuleList = {
      '.editable': {
        height: '500px',
      },
      '.border': {
        border: '1px solid #999',
      },
    }

    function onEditableReloadBefore(inst: IDomEditor) {
      console.log('editable 即将重载: ' + new Date().toLocaleString())
    }

    function onToolbarloadBefore(inst: Toolbar) {
      console.log('toolbar 即将重载: ' + new Date().toLocaleString())
    }

    return { editable, toolbar, formData, cssRule, onEditableReloadBefore, onToolbarloadBefore }
  },
})
```

## props

`WeEditorPlus` 继承了 [`WeEditor`](../guide/props.md#weeditor) 的所有 [`props`](../guide/README.md#props) 属性，同时还存在以下 `props` 属性。

| prop             | 描述                                         | 类型            |
| :--------------- | :------------------------------------------- | :-------------- |
| `containerClass` | 菜单栏与编辑区公共父容器的 `class attribute` | `String`        |
| `containerStyle` | 菜单栏与编辑区公共父容器的 `style attribute` | `String`        |
| `cssRule`        | 组件级的样式注入                             | `WeCssRuleList` |

## 兼容性

`WeEditorPlus` 组件在 `Firefox` 浏览器和 `vue-cli` 项目中无法正常使用。
