<template>
  <we-toolbar class="toolbar" :option="toolbar" />
  <we-editable
    class="editable"
    :option="editable"
    v-model="formData.json"
    v-model:json="formData.jsonStr"
    v-model:html="formData.html"
    :reloadbefore="onReloadBefore"
  />
  <div class="preview">
    <div class="preview-types">
      <el-button :disabled="modelType === 'json'" @click="modelType = 'json'">预览 JSON Array</el-button>
      <el-button :disabled="modelType === 'jstr'" @click="modelType = 'jstr'">预览 JSON String</el-button>
      <el-button :disabled="modelType === 'html'" @click="modelType = 'html'">预览 HTML String</el-button>
    </div>
    <div class="preview-content">
      <u-prism :lang="modelType === 'html' ? 'html' : 'json'" :content="preview" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Descendant } from 'slate'
  import { WeEditableOption, WeToolbarOption, useWangEditor } from 'wangeditor5-for-vue3'
  import { computed, defineComponent, ref, shallowReactive } from 'vue'
  import UPrism from '../components/u-prism.vue'
  import { IDomEditor } from '@wangeditor/editor'

  export default defineComponent({
    components: { UPrism },
    setup() {
      // 编辑器配置
      const editableOption: WeEditableOption = {
        config: {
          placeholder: '请开始你的表演',
        },
        delay: 1000,
      }

      // 菜单栏配置
      const toolbarOption: WeToolbarOption = {}

      // 防抖时长。当配置发生变化 365ms 后，编辑器的销毁重建
      const reloadDelary = 365

      const { editable, toolbar } = useWangEditor(editableOption, toolbarOption, reloadDelary)

      // 注意：是 shallowReactive 而不是 reactive
      const formData = shallowReactive({
        json: [] as Descendant[],
        jsonStr: '',
        html: '',
      })

      const modelType = ref<'json' | 'jstr' | 'html'>('json')

      const preview = computed(() => {
        switch (modelType.value) {
          case 'json':
            return JSON.stringify(formData.json, null, 2)
          case 'jstr':
            return formData.jsonStr
          default:
            return formData.html
        }
      })

      function onReloadBefore(e: IDomEditor) {}

      return { editable, toolbar, formData, modelType, preview, onReloadBefore }
    },
  })
</script>
