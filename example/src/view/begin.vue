<template>
  <editor-toolbar class="toolbar" :option="toolbar" />
  <editor-editable
    class="editable"
    :option="editable"
    v-model="formData.json"
    v-model:html="formData.html"
    @reloadbefore="onReloadBefore"
  />
  <div class="preview">
    <div class="preview-types">
      <el-button :disabled="modelType === 'json'" @click="onPreview('json')">预览 JSON</el-button>
      <el-button :disabled="modelType === 'html'" @click="onPreview('html')">预览 HTML</el-button>
    </div>
    <div class="preview-content">
      <u-prism :lang="modelType" :content="preview" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Descendant } from 'slate'
  import { EditorEditableOption, EditorToolbarOption, useWangEditor } from '@we/wangeditor'
  import { computed, defineComponent, ref, shallowReactive } from 'vue'
  import UPrism from '../components/u-prism.vue'
  import { IDomEditor } from '@wangeditor/editor'

  export default defineComponent({
    components: { UPrism },
    setup() {
      // 编辑器配置
      const editableOption: EditorEditableOption = {
        config: {
          placeholder: '请开始你的表演',
        },
        delay: 1000,
      }

      // 菜单栏配置
      const toolbarOption: EditorToolbarOption = {}

      // 防抖时长。当配置发生变化 365ms 后，编辑器的销毁重建
      const reloadDelary = 365

      const { editable, toolbar } = useWangEditor(editableOption, toolbarOption, reloadDelary)

      // 注意：是 shallowReactive 而不是 reactive
      const formData = shallowReactive({
        json: [] as Descendant[],
        html: '',
      })

      const modelType = ref<'json' | 'html'>('json')

      const preview = computed(() => {
        return modelType.value === 'json' ? JSON.stringify(formData.json, null, 2) : formData.html
      })

      function onPreview(value: 'json' | 'html') {
        modelType.value = value
      }

      function onReloadBefore(e: IDomEditor) {}

      return { editable, toolbar, formData, modelType, preview, onPreview, onReloadBefore }
    },
  })
</script>
