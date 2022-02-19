<template>
  <div style="padding: 50px; text-align: center">
    <n-button @click="dialogVisible = true">open dialog</n-button>
    <n-button @click="drawerVisible = true">open drawer</n-button>
  </div>
  <n-modal v-model:show="dialogVisible" title="In Dialog" style="width: 1000px">
    <we-editor
      toolbar-style="border-bottom: 1px solid var(--bg-color)"
      editable-style="height: 500px"
      :toolbar-option="dialogToolbar"
      :editable-option="dialogEditable"
    />
  </n-modal>
  <n-drawer v-model:show="drawerVisible" title="In Drawer" placement="right" :width="800">
    <we-editor
      toolbar-style="border-bottom: 1px solid var(--bg-color)"
      editable-style="height: 700px"
      :toolbar-option="drawerToolbar"
      :editable-option="drawerEditable"
    />
  </n-drawer>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { useWangEditor } from 'wangeditor5-for-vue3'

  export default defineComponent({
    setup() {
      const dialogVisible = ref(false)

      const { editable: dialogEditable, toolbar: dialogToolbar } = useWangEditor({
        config: { placeholder: 'In Dialog' },
      })

      const drawerVisible = ref(false)

      const { editable: drawerEditable, toolbar: drawerToolbar } = useWangEditor({
        config: { placeholder: 'In Drawer' },
      })

      return { dialogVisible, dialogEditable, dialogToolbar, drawerVisible, drawerEditable, drawerToolbar }
    },
  })
</script>
