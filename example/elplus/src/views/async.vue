<template>
  <i-page title="在弹窗中使用">
    <el-card shadow="never">
      <el-button type="primary" @click="dialogVisible = true">open dialog</el-button>
      <el-button type="primary" @click="drawerVisible = true">open drawer</el-button>
    </el-card>
    <el-dialog v-model="dialogVisible" title="In Dialog" width="1000px" append-to-body>
      <we-editor :handle="dialogHandle" />
    </el-dialog>
    <el-drawer v-model="drawerVisible" title="In Drawer" direction="rtl" size="75%" append-to-body>
      <we-editor :handle="drawerHandle" />
    </el-drawer>
  </i-page>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { IPage } from 'example-common'

  export default defineComponent({
    components: { IPage },
    setup() {
      const dialogVisible = ref(false)

      const { handle: dialogHandle } = useWangEditor({
        editable: {
          config: { placeholder: 'In Dialog' }
        }
      })

      const drawerVisible = ref(false)

      const { handle: drawerHandle } = useWangEditor({
        editable: {
          config: { placeholder: 'In Drawer' }
        }
      })

      return {
        dialogVisible,
        dialogHandle,
        drawerVisible,
        drawerHandle
      }
    }
  })
</script>
