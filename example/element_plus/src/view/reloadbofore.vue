<template>
  <el-form :inline="true">
    <el-form-item label="editable mode：">
      <el-select v-model="editable.mode" placeholder="editable mode">
        <el-option value="default" />
        <el-option value="simple" />
      </el-select>
    </el-form-item>
    <el-form-item label="toolbar mode：">
      <el-select v-model="toolbar.mode" placeholder="toolbar mode">
        <el-option value="default" />
        <el-option value="simple" />
      </el-select>
    </el-form-item>
  </el-form>
  <we-editor
    toolbar-class="toolbar"
    editable-class="editable"
    :toolbar-option="toolbar"
    :editable-option="editable"
    :toolbar-reloadbefore="onToolbarloadBefore"
    :editable-reloadbefore="onEditableReloadBefore"
    v-model="jsonData"
  />
</template>

<script lang="ts">
  import { IDomEditor, Toolbar } from '@wangeditor/editor'
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowRef } from 'vue'

  export default defineComponent({
    setup() {
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

      return { editable, toolbar, jsonData, reloadEditor, onEditableReloadBefore, onToolbarloadBefore }
    },
  })
</script>
