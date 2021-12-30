<template>
  <div style="padding: 50px; text-align: center">
    <el-button @click="dialogVisible = true">open dialog</el-button>
    <el-button @click="drawerVisible = true">open drawer</el-button>
  </div>
  <el-dialog v-model="dialogVisible" title="in dialog" width="1000px" append-to-body>
    <editor-toolbar style="border-bottom: 1px solid var(--bg-color)" :option="dialogToolbar" />
    <editor-editable style="height: 500px" :option="dialogEditable" />
  </el-dialog>
  <el-drawer v-model="drawerVisible" title="in drawer" direction="rtl" size="75%" append-to-body>
    <editor-toolbar style="border-bottom: 1px solid var(--bg-color)" :option="drawerToolbar" />
    <editor-editable style="height: 750px" :option="drawerEditable" />
  </el-drawer>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { useWangEditor } from '@we/wangeditor'

  export default defineComponent({
    setup() {
      const dialogVisible = ref(false)

      const { editable: dialogEditable, toolbar: dialogToolbar } = useWangEditor({
        config: { placeholder: 'in dialog' },
      })

      const drawerVisible = ref(false)

      const { editable: drawerEditable, toolbar: drawerToolbar } = useWangEditor({
        config: { placeholder: 'in drawer' },
      })

      return { dialogVisible, dialogEditable, dialogToolbar, drawerVisible, drawerEditable, drawerToolbar }
    },
  })
</script>
