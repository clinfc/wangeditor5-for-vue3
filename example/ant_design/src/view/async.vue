<template>
  <div style="padding: 50px; text-align: center">
    <a-button @click="dialogVisible = true">open modal</a-button>
    <a-button @click="drawerVisible = true">open drawer</a-button>
  </div>
  <a-modal v-model:visible="dialogVisible" title="In Modal" width="1000px">
    <we-editor
      toolbar-style="border-bottom: 1px solid var(--bg-color)"
      editable-style="height: 500px"
      :toolbar-option="dialogToolbar"
      :editable-option="dialogEditable"
    />
  </a-modal>
  <a-drawer v-model:visible="drawerVisible" title="In Drawer" placement="right" width="1000px">
    <we-editor
      toolbar-style="border-bottom: 1px solid var(--bg-color)"
      editable-style="height: 700px"
      :toolbar-option="drawerToolbar"
      :editable-option="drawerEditable"
    />
  </a-drawer>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { useWangEditor } from 'wangeditor5-for-vue3'

  export default defineComponent({
    setup() {
      const dialogVisible = ref(false)

      const { editable: dialogEditable, toolbar: dialogToolbar } = useWangEditor({
        config: { placeholder: 'In Modal' },
      })

      const drawerVisible = ref(false)

      const { editable: drawerEditable, toolbar: drawerToolbar } = useWangEditor({
        config: { placeholder: 'In Drawer' },
      })

      return { dialogVisible, dialogEditable, dialogToolbar, drawerVisible, drawerEditable, drawerToolbar }
    },
  })
</script>
