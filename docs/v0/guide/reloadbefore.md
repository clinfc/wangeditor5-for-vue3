# reloadbefore

在编辑器重载之前，会调用 `reloadbefore` 回调。当 `WeEditableOption.extendCahce` 为 `false` 时，我们可以配置此事件进行数据提交/缓存以防止数据丢失。

```vue
<template>
  <we-toolbar :option="toolbar" :reloadbefore="onToolbarReloadBefore" />
  <we-editable v-model="formData.json" :option="editable" :reloadbefore="onEditableReloadBefore" />
</template>
```

<CodeGroup>
  <CodeGroupItem title="JS">

```vue
<script>
  import axios from 'axios'
  import { WeEditable, WeToolbar, useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    components: { WeToolbar, WeEditable },
    setup() {
      const { editable, toolbar, reloadEditor } = useWangEditor()

      const formData = shallowReactive({
        json: [],
      })

      function onEditableReloadBefore(editableInstance) {
        window.alert('editable 即将重载')
        console.log('editable 即将重载: ' + new Date().toLocaleString())
        // 提交数据
        axios.post('xxx/xxx', formData)
      }

      function onToolbarReloadBefore(toolbarInstance) {
        window.alert('toolbar 即将重载')
        console.log('toolbar 即将重载: ' + new Date().toLocaleString())
      }

      return { editable, toolbar, formData, onEditableReloadBefore, onToolbarReloadBefore }
    },
  })
</script>
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```vue
<script lang="ts">
  import axios from 'axios'
  import { IDomEditor, Toolbar, SlateDescendant } from '@wangeditor/editor'
  import { WeEditable, WeToolbar, useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    components: { WeToolbar, WeEditable },
    setup() {
      const { editable, toolbar, reloadEditor } = useWangEditor()

      const formData = shallowReactive({
        json: [] as SlateDescendant[],
      })

      function onEditableReloadBefore(editableInstance: IDomEditor) {
        window.alert('editable 即将重载')
        console.log('editable 即将重载: ' + new Date().toLocaleString())
        // 提交数据
        axios.post('xxx/xxx', formData)
      }

      function onToolbarReloadBefore(toolbarInstance: Toolbar) {
        window.alert('toolbar 即将重载')
        console.log('toolbar 即将重载: ' + new Date().toLocaleString())
      }

      return { editable, toolbar, formData, onEditableReloadBefore, onToolbarReloadBefore }
    },
  })
</script>
```

  </CodeGroupItem>
</CodeGroup>

## 注意事项

- `WeToolbar` 和 `WeEditable` 的 `reloadbefore` 回调可以通过 `reloadbefore prop` 进行配置
- `WeEditor`/`WeEditorPlus` 需要通过 `toolbar-reloadbefore prop` 和 `editable-reloadbefore prop` 进行配置。
- [会触发重载的配置项](../guide/use-wang-editor.md#会触发重载的配置项)
