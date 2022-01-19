# reloadbefore

在编辑器重载之前，会触发 `reloadbefore` 事件。当 `EditorEditableOption.extendCahce` 为 `false` 时，我们可以配置此事件进行数据提交/缓存以防止数据丢失。

```html
<template>
  <editor-toolbar :option="toolbar" @reloadbefore="onToolbarReloadBefore" />
  <editor-editable v-model="formData.json" :option="editable" @reloadbefore="onEditableReloadBefore" />
</template>

<script lang="ts">
  import axios from 'axiios'
  import { Descendant } from 'slate'
  import { EditorEditable, EditorToolbar, useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    components: { EditorToolbar, EditorEditable },
    setup() {
      const { editable, toolbar, reloadEditor } = useWangEditor()

      const formData = shallowReactive({
        json: [] as Descendant[],
      })

      function onEditableReloadBefore(inst: IDomEditor) {
        window.alert('editable 即将重载')
        console.log('editable 即将重载: ' + new Date().toLocaleString())
        // 提交数据
        axios.post('xxx/xxx', formData)
      }

      function onToolbarReloadBefore(inst: Toolbar) {
        window.alert('toolbar 即将重载')
        console.log('toolbar 即将重载: ' + new Date().toLocaleString())
      }

      return { editable, toolbar, formData, onEditableReloadBefore, onToolbarReloadBefore }
    },
  })
</script>
```
