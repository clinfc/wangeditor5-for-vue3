<template>
  <el-card shadow="never">
    <el-button type="primary" @click="dialogVisible = true">open dialog</el-button>
    <el-button type="primary" @click="drawerVisible = true">open drawer</el-button>
  </el-card>
  <el-dialog
    v-model="dialogVisible"
    title="In Dialog"
    width="1000px"
    @open="dialogOpen"
    @opened="dialogOpened"
    append-to-body
  >
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

      const {
        editable: dialogEditable,
        toolbar: dialogToolbar,
        getEditable: dialogGetEditable,
      } = useWangEditor({
        config: { placeholder: 'In Dialog' },
      })

      const drawerVisible = ref(false)

      const { editable: drawerEditable, toolbar: drawerToolbar } = useWangEditor({
        config: { placeholder: 'In Drawer' },
      })

      function dialogOpen() {
        console.log('open event, sync get editable instance!', dialogGetEditable())
        dialogGetEditable(3000).then(
          (inst) => {
            console.log('open event, async get editable instance scuess!', inst)
          },
          (err) => {
            console.log('open event, async get editable instance fail!', err.message)
          }
        )
      }

      function dialogOpened() {
        console.log('opened event, sync get editable instance!', dialogGetEditable())
      }

      return {
        dialogVisible,
        dialogEditable,
        dialogToolbar,
        dialogOpen,
        dialogOpened,
        drawerVisible,
        drawerEditable,
        drawerToolbar,
      }
    },
  })
</script>
