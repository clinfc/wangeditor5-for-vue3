# 快速开始

## 安装

先安装依赖主体

```sh
yarn add vue@next @wangeditor/editor
// or
npm install vue@next @wangeditor/editor
```

然后安装我们的组件

```sh
yarn add wangeditor5-for-vue3
// or
npm install wangeditor5-for-vue3
```

## 组件注册

### 全局注册

```ts
import { createApp } from 'vue'
import { WeToolbar, WeEditable } from 'wangeditor5-for-vue3'
import '@wangeditor/editor/dist/css/style.css'

// 全局注册 WeToolbar, WeEditable 两个组件
createApp(App).component(WeToolbar.name, WeToolbar).component(WeEditable.name, WeEditable).mount('#app')
```

### 局部注册

```ts
import { defineComponent } from 'vue'
import { WeEditable, WeToolbar } from 'wangeditor5-for-vue3'
import '@wangeditor/editor/dist/css/style.css'

export default defineComponent({
  components: { WeEditable, WeToolbar },
})
```

## 完全示例

```html
<template>
  <we-toolbar :option="toolbar" @reloadbefore="onToolbarReloadBefore" />
  <we-editable
    :option="editable"
    v-model="formData.jarr"
    v-model:json="formData.jstr"
    v-model:html="formData.html"
    @reloadbefore="onEditableReloadBefore"
  />
</template>

<script lang="ts">
  import { Descendant } from 'slate'
  import { WeEditable, EditableOption, WeToolbar, ToolbarOption, useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowReactive } from 'vue'
  // 引入 wangeditor5 样式
  import '@wangeditor/editor/dist/css/style.css'

  export default defineComponent({
    components: { WeToolbar, WeEditable },
    setup() {
      // 编辑器配置
      const editableOption: EditableOption = {}

      // 菜单栏配置
      const toolbarOption: ToolbarOption = {}

      // 防抖时长。当会触发重载的配置项发生变化 365ms 后，编辑器会重载
      const reloadDelary = 365

      const { editable, toolbar, getEditable, getToolbar, clearContent, reloadEditor } = useWangEditor(
        editableOption,
        toolbarOption,
        reloadDelary
      )

      // 开启只读模式
      editable.config.readOnly = true

      // 不要使用 reactive/ref，应该使用 shallowReactive/shallowRef 来接收 json array 数据
      const formData = shallowReactive({ jarr: [] as Descendant[], jstr: '', html: '' })

      function onEditableReloadBefore(inst: IDomEditor) {
        console.log('editable 即将重载: ' + new Date().toLocaleString())
      }

      function onToolbarReloadBefore(inst: Toolbar) {
        console.log('toolbar 即将重载: ' + new Date().toLocaleString())
      }

      return { editable, toolbar, formData, onEditableReloadBefore, onToolbarReloadBefore }
    },
  })
</script>
```
