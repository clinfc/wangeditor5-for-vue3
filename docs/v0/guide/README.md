# 快速开始

## 安装

<CodeGroup>
  <CodeGroupItem title="NPM" active>

```sh:no-line-numbers
npm install @wangeditor/editor wangeditor5-for-vue3@0.1.0
```

  </CodeGroupItem>

  <CodeGroupItem title="YARN">

```sh:no-line-numbers
yarn add @wangeditor/editor wangeditor5-for-vue3@0.1.0
```

  </CodeGroupItem>
</CodeGroup>

## 组件注册

### 全局注册

```ts
import { createApp } from 'vue'
import { WeToolbar, WeEditable, WeEditor } from 'wangeditor5-for-vue3'
import '@wangeditor/editor/dist/css/style.css'

// 全局注册 WeToolbar, WeEditable，WeEditor 三个组件
const app = createApp(App)

app.component(WeToolbar.name, WeToolbar)
app.component(WeEditable.name, WeEditable)
app.component(WeEditor.name, WeEditor)

app.mount('#app')
```

### 局部注册

```ts
import { defineComponent } from 'vue'
import { WeEditable, WeToolbar } from 'wangeditor5-for-vue3'
import '@wangeditor/editor/dist/css/style.css'

export default defineComponent({
  components: { WeEditable, WeToolbar }
})
```

或

```ts
import { defineComponent } from 'vue'
import { WeEditor } from 'wangeditor5-for-vue3'
import '@wangeditor/editor/dist/css/style.css'

export default defineComponent({
  components: { WeEditor }
})
```

## 完全示例

### WeToolbar + WeEditable

在 `wangeditor5-for-vue3` 组件库中，菜单栏和编辑区分别提供了独立的组件，可供使用者在特殊场景下使用。

```vue
<template>
  <we-toolbar :option="toolbar" :reloadbefore="onToolbarReloadBefore" />
  <we-editable
    :option="editable"
    v-model="formData.jarr"
    v-model:json="formData.jstr"
    v-model:html="formData.html"
    :reloadbefore="onEditableReloadBefore"
  />
</template>
```

<CodeGroup>
  <CodeGroupItem title="JS">

```vue
<script>
  // 引入 wangeditor5 样式
  import '@wangeditor/editor/dist/css/style.css'

  import { WeEditable, WeToolbar, useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    components: { WeToolbar, WeEditable },
    setup() {
      // 编辑器配置
      const editableOption = {}

      // 菜单栏配置
      const toolbarOption = {}

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
      const formData = shallowReactive({ jarr: [], jstr: '', html: '' })

      function onEditableReloadBefore(inst) {
        console.log('editable 即将重载: ' + new Date().toLocaleString())
      }

      function onToolbarReloadBefore(inst) {
        console.log('toolbar 即将重载: ' + new Date().toLocaleString())
      }

      return { editable, toolbar, formData, onEditableReloadBefore, onToolbarReloadBefore }
    }
  })
</script>
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```vue
<script lang="ts">
  // 引入 wangeditor5 样式
  import '@wangeditor/editor/dist/css/style.css'

  import { IDomEditor, Toolbar, SlateDescendant } from '@wangeditor/editor'
  import { WeEditable, WeEditableOption, WeToolbar, WeToolbarOption, useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    components: { WeToolbar, WeEditable },
    setup() {
      // 编辑器配置
      const editableOption: WeEditableOption = {}

      // 菜单栏配置
      const toolbarOption: WeToolbarOption = {}

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
      const formData = shallowReactive({ jarr: [] as SlateDescendant[], jstr: '', html: '' })

      function onEditableReloadBefore(inst: IDomEditor) {
        console.log('editable 即将重载: ' + new Date().toLocaleString())
      }

      function onToolbarReloadBefore(inst: Toolbar) {
        console.log('toolbar 即将重载: ' + new Date().toLocaleString())
      }

      return { editable, toolbar, formData, onEditableReloadBefore, onToolbarReloadBefore }
    }
  })
</script>
```

  </CodeGroupItem>
</CodeGroup>

### WeEditor

`WeEditor` 组件将 `WeToolbar` 和 `WeEditable` 组件封装在了一个组件中，使用更方便。

```vue
<template>
  <we-editor
    toolbar-class="toolbar"
    editable-class="editable"
    toolbar-style="border: 1px solid #d9d9d9"
    editable-style="border: 1px solid #d9d9d9"
    :toolbar-option="toolbar"
    :editable-option="editable"
    :toolbar-reloadbefore="onToolbarReloadBefore"
    :editable-reloadbefore="onEditableReloadBefore"
    v-model="formData.jarr"
    v-model:json="formData.jstr"
    v-model:html="formData.html"
  />
</template>
```

<CodeGroup>
  <CodeGroupItem title="JS">

```vue
<script>
  // 引入 wangeditor5 样式
  import '@wangeditor/editor/dist/css/style.css'

  import { WeEditor, useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    components: { WeEditor },
    setup() {
      // 编辑器配置
      const editableOption = {}

      // 菜单栏配置
      const toolbarOption = {}

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
      const formData = shallowReactive({ jarr: [], jstr: '', html: '' })

      function onEditableReloadBefore(inst) {
        console.log('editable 即将重载: ' + new Date().toLocaleString())
      }

      function onToolbarReloadBefore(inst) {
        console.log('toolbar 即将重载: ' + new Date().toLocaleString())
      }

      return { editable, toolbar, formData, onEditableReloadBefore, onToolbarReloadBefore }
    }
  })
</script>
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```vue
<script lang="ts">
  // 引入 wangeditor5 样式
  import '@wangeditor/editor/dist/css/style.css'

  import { IDomEditor, Toolbar, SlateDescendant } from '@wangeditor/editor'
  import { WeEditor, WeEditableOption, WeToolbarOption, useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    components: { WeEditor },
    setup() {
      // 编辑器配置
      const editableOption: WeEditableOption = {}

      // 菜单栏配置
      const toolbarOption: WeToolbarOption = {}

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
      const formData = shallowReactive({ jarr: [] as SlateDescendant[], jstr: '', html: '' })

      function onEditableReloadBefore(inst: IDomEditor) {
        console.log('editable 即将重载: ' + new Date().toLocaleString())
      }

      function onToolbarReloadBefore(inst: Toolbar) {
        console.log('toolbar 即将重载: ' + new Date().toLocaleString())
      }

      return { editable, toolbar, formData, onEditableReloadBefore, onToolbarReloadBefore }
    }
  })
</script>
```

  </CodeGroupItem>
</CodeGroup>
