<template>
  <i-page title="重载事件 reload 和 reloaded">
    <el-tabs v-model="tab">
      <el-tab-pane label="WeEditor" name="first">
        <el-form :inline="true">
          <el-form-item label="editable mode：">
            <el-select v-model="opts1.editable.mode" placeholder="editable mode">
              <el-option value="default" />
              <el-option value="simple" />
            </el-select>
          </el-form-item>
          <el-form-item label="toolbar mode：">
            <el-select v-model="opts1.toolbar.mode" placeholder="toolbar mode">
              <el-option value="default" />
              <el-option value="simple" />
            </el-select>
          </el-form-item>
        </el-form>
        <we-editor :handle="handle1" v-model:json="data.json" @reload="onReload" @reloaded="onReloaded" />
      </el-tab-pane>
      <el-tab-pane label="WeToolbar/WeEditable" name="second">
        <el-form :inline="true">
          <el-form-item label="editable mode：">
            <el-select v-model="opts2.editable.mode" placeholder="editable mode">
              <el-option value="default" />
              <el-option value="simple" />
            </el-select>
          </el-form-item>
          <el-form-item label="toolbar mode：">
            <el-select v-model="opts2.toolbar.mode" placeholder="toolbar mode">
              <el-option value="default" />
              <el-option value="simple" />
            </el-select>
          </el-form-item>
        </el-form>
        <we-toolbar :handle="handle2" @reload="onToolbarReload" @reloaded="onToolbarReloaded" />
        <we-editable
          :handle="handle2"
          v-model:json.string="data.jstr"
          @reload="onEditableReload"
          @reloaded="onEditableReloaded"
        />
      </el-tab-pane>
    </el-tabs>
  </i-page>
</template>

<script lang="ts">
  import { useWangEditor, WeEditableReloadEvent, WeReloadEvent, WeToolbarReloadEvent } from 'wangeditor5-for-vue3'
  import { defineComponent, ref, shallowReactive } from 'vue'
  import { IPage } from 'example-common'
  import { ElMessage } from 'element-plus'
  import 'element-plus/es/components/message/style/css'

  const placeholder =
    '[{"type":"paragraph","children":[{"text":"只要进行了 "},{"text":"v-model:json/v-model:html","code":true},{"text":" 绑定，且 "},{"text":"extendCache","code":true},{"text":" 为 "},{"text":"true","code":true},{"text":"，那么数据就不会丢失！！！"}]}]'

  export default defineComponent({
    components: { IPage },
    setup() {
      const tab = ref('first')

      const { opts: opts1, handle: handle1 } = useWangEditor({ editable: { defaultContent: placeholder } })
      const { opts: opts2, handle: handle2 } = useWangEditor({ editable: { defaultContent: placeholder } })

      const data = shallowReactive({
        json: [] as any[],
        jstr: ''
      })

      function date() {
        const d = new Date()
        return `${d.toLocaleString()} ${d.getMilliseconds()}`
      }

      function onReload(e: WeReloadEvent) {
        const message = `${e.type} - 即将重载（${date()}）`
        console.log(message, e)
        ElMessage(message)
      }

      function onReloaded(e: WeReloadEvent) {
        const message = `${e.type} - 重载结束（${date()}）`
        console.log(message, e)
        ElMessage.success(message)
      }

      function onToolbarReload(e: WeToolbarReloadEvent) {
        const message = `菜单栏 - 即将重载（${date()}）`
        console.log(message, e)
        ElMessage(message)
      }

      function onToolbarReloaded(e: WeToolbarReloadEvent) {
        const message = `菜单栏 - 重载结束（${date()}）`
        console.log(message, e)
        ElMessage.success(message)
      }

      function onEditableReload(e: WeEditableReloadEvent) {
        const message = `编辑区 - 重载结束（${date()}）`
        console.log(message, e)
        ElMessage(message)
      }

      function onEditableReloaded(e: WeEditableReloadEvent) {
        const message = `编辑区 - 重载结束（${date()}）`
        console.log(message, e)
        ElMessage.success(message)
      }

      return {
        tab,
        opts1,
        handle1,
        opts2,
        handle2,
        data,
        onReload,
        onReloaded,
        onToolbarReload,
        onToolbarReloaded,
        onEditableReload,
        onEditableReloaded
      }
    }
  })
</script>
