<template>
  <we-editor-plus
    toolbar-class="toolbar border"
    editable-class="editable border"
    :css-rule="cssRule"
    :toolbar-option="toolbar"
    :editable-option="editable"
    v-model="formData.json"
    v-model:json="formData.jsonStr"
    v-model:html="formData.html"
  />
  <br />
  <el-card shadow="never">
    <el-button :disabled="modelType === 'json'" @click="modelType = 'json'">预览 JSON Array</el-button>
    <el-button :disabled="modelType === 'jstr'" @click="modelType = 'jstr'">预览 JSON String</el-button>
    <el-button :disabled="modelType === 'html'" @click="modelType = 'html'">预览 HTML String</el-button>
  </el-card>
  <br />
  <u-prism :lang="modelType === 'html' ? 'html' : 'json'" :content="preview" />
</template>

<script lang="ts">
  import { WeCssRuleList, WeEditableOption, WeToolbarOption, useWangEditor } from 'wangeditor5-for-vue3'
  import { computed, defineComponent, ref, shallowReactive } from 'vue'
  import { SlateDescendant } from '@wangeditor/editor'
  import UPrism from '../components/u-prism.vue'

  export default defineComponent({
    components: { UPrism },
    setup() {
      // 编辑器配置
      const editableOption: WeEditableOption = {
        config: {
          placeholder: 'shadow 模式',
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
        json: [] as SlateDescendant[],
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

      const cssRule: WeCssRuleList = {
        '.editable': {
          height: '500px',
        },
        '.border': {
          border: '1px solid #e5e5e5',
        },
      }

      return { editable, toolbar, formData, modelType, preview, cssRule }
    },
  })
</script>
