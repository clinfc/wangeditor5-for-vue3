<template>
  <n-form label-placement="left" label-width="auto">
    <n-form-item label="editable mode：">
      <n-select v-model:value="editable.mode" :options="options" placeholder="editable mode"></n-select>
    </n-form-item>
    <n-form-item label="toolbar mode：">
      <n-select v-model:value="toolbar.mode" :options="options" placeholder="toolbar mode"></n-select>
    </n-form-item>
    <n-form-item>
      <n-button @click="reloadEditor">重载编辑器</n-button>
    </n-form-item>
  </n-form>
  <we-toolbar style="border-bottom: 1px solid var(--bg-color)" :option="toolbar" :reloadbefore="onToolbarloadBefore" />
  <we-editable style="height: 750px" v-model="jsonData" :option="editable" :reloadbefore="onEditableReloadBefore" />
</template>

<script lang="ts">
  import { IDomEditor, Toolbar } from '@wangeditor/editor'
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowRef } from 'vue'

  export default defineComponent({
    setup() {
      const options = [
        { label: 'default', value: 'default' },
        { label: 'simple', value: 'simple' },
      ]
      const { editable, toolbar, reloadEditor } = useWangEditor()

      editable.defaultContent =
        '[{"type":"paragraph","children":[{"text":"只要进行了 "},{"text":"v-model/v-model:json/v-model:html","code":true},{"text":" 绑定，且 "},{"text":"extendCache","code":true},{"text":" 为 "},{"text":"true","code":true},{"text":"，那么数据就不会丢失！！！"}]}]'

      const jsonData = shallowRef<any[]>([])

      function onEditableReloadBefore(inst: IDomEditor) {
        window.alert('editable 即将重载: ' + new Date().toLocaleString())
        console.log('editable 即将重载: ' + new Date().toLocaleString())
      }

      function onToolbarloadBefore(inst: Toolbar) {
        window.alert('toolbar 即将重载: ' + new Date().toLocaleString())
        console.log('toolbar 即将重载: ' + new Date().toLocaleString())
      }

      return { options, editable, toolbar, jsonData, reloadEditor, onEditableReloadBefore, onToolbarloadBefore }
    },
  })
</script>
