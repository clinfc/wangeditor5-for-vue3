# 快速开始

## 组件注册

### 全局注册

```ts
import App from './App.vue'

import { createApp } from 'vue'
import { shadowCssRule, WeEditor } from 'wangeditor5-for-vue3'

// 将 wangEditor 的 css 文件引入为 纯文本/路径
import westyle from '@wangeditor/editor/dist/css/style.css' // vite

// 注入到 shadow dom 中
shadowCssRule(westyle)

// shadowCssRule 方法注入的样式是全局性的（注入的 css 会影响后续创建的每一个编辑器）
createApp(App).component(WeEditor.name, WeEditor).mount('#app')
```

### 局部注册

```ts
import { defineComponent } from 'vue'
import { shadowCssRule, WeEditor } from 'wangeditor5-for-vue3'

import westyle from '@wangeditor/editor/dist/css/style.css' // vite

shadowCssRule(westyle)

export default defineComponent({
  components: { WeEditor },
})
```

## 使用示例

```html
<template>
  <we-editor
    :toolbar-option="toolbar"
    :editable-option="editable"
    :toolbar-reloadbefore="onToolbarloadBefore"
    :editable-reloadbefore="onEditableReloadBefore"
    :css-rule="cssRule"
    toolbar-class="border"
    editable-class="border"
    toolbar-style="color: red"
    editable-style="font-size: 18px"
    v-model="formData.json"
    v-model:json="formData.jsonStr"
    v-model:html="formData.html"
  />
</template>
```

```ts
import { Descendant } from 'slate'
import { CssRuleList, EditableOption, ToolbarOption, useWangEditor } from 'wangeditor5-for-vue3'
import { computed, defineComponent, ref, shallowReactive } from 'vue'
import { IDomEditor, Toolbar } from '@wangeditor/editor'

export default defineComponent({
  components: { UPrism },
  setup() {
    // useWangEditor() 的使用和常规模式下的使用时一样的
    const { editable, toolbar, getEditable, getToolbar, clearContent, reloadEditor } = useWangEditor()

    // 注意：是 shallowReactive 而不是 reactive
    const formData = shallowReactive({
      json: [] as Descendant[],
      jsonStr: '',
      html: '',
    })

    // 组件级的样式注入
    const cssRule: CssRuleList = {
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

## API

| 参数                   | 描述                       | 类型                           |
| :--------------------- | :------------------------- | :----------------------------- |
| `toolbarOption`        | 菜单栏配置项               | `Required<ToolbarOption>`      |
| `toolbarClass`         | 菜单栏的 `class attribute` | `String`                       |
| `toolbarStyle`         | 菜单栏的 `style attribute` | `String`                       |
| `toolbarReloadbefore`  | 菜单栏重载前回调函数       | `(toolbar: Toolbar) => void`   |
| `editableOption`       | 编辑区配置项               | `Required<EditableOption>`     |
| `editableClass`        | 编辑区的 `class attribute` | `String`                       |
| `editableStyle`        | 编辑区的 `style attribute` | `String`                       |
| `editableReloadbefore` | 编辑区重载前回到函数       | `(editor: IDomEditor) => void` |
| `cssRule`              | 组件级的样式注入           | `CssRuleList`                  |
