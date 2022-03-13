<template>
  <el-card shadow="never">
    <el-button type="primary" @click="dialogVisible = true">open dialog</el-button>
    <el-button type="primary" @click="drawerVisible = true">open drawer</el-button>
  </el-card>
  <el-dialog v-model="dialogVisible" title="In Dialog" width="1000px" append-to-body>
    <we-editor
      toolbar-style="border-bottom: 1px solid var(--bg-color)"
      editable-style="height: 500px"
      :toolbar-option="dialogToolbar"
      :editable-option="dialogEditable"
    />
  </el-dialog>
  <el-drawer v-model="drawerVisible" title="In Drawer" direction="rtl" size="75%" append-to-body>
    <we-editor
      toolbar-style="border-bottom: 1px solid var(--bg-color)"
      editable-style="height: 700px"
      :toolbar-option="drawerToolbar"
      :editable-option="drawerEditable"
    />
  </el-drawer>
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
