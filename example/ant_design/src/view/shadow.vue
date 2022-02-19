<template>
  <we-editor-plus
    container-class="container"
    container-style="border: 1px solid #d9d9d9"
    toolbar-class="toolbar"
    editable-class="editable"
    :toolbar-option="toolbar"
    :editable-option="editable"
    :css-rule="cssRule"
    :toolbar-reloadbefore="onToolbarloadBefore"
    :editable-reloadbefore="onEditableReloadBefore"
    v-model="formData.json"
    v-model:json="formData.jsonStr"
    v-model:html="formData.html"
  />
  <div class="preview">
    <div class="preview-types">
      <a-button :disabled="modelType === 'json'" @click="modelType = 'json'">预览 JSON Array</a-button>
      <a-button :disabled="modelType === 'jstr'" @click="modelType = 'jstr'">预览 JSON String</a-button>
      <a-button :disabled="modelType === 'html'" @click="modelType = 'html'">预览 HTML String</a-button>
    </div>
    <div class="preview-content">
      <u-prism :lang="modelType === 'html' ? 'html' : 'json'" :content="preview" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Descendant } from 'slate'
  import { WeCssRuleList, WeEditableOption, WeToolbarOption, useWangEditor } from 'wangeditor5-for-vue3'
  import { computed, defineComponent, ref, shallowReactive } from 'vue'
  import UPrism from '../components/u-prism.vue'
  import { IDomEditor, Toolbar } from '@wangeditor/editor'

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

      const cssRule: WeCssRuleList = {
        '.container': {
          backgroundColor: '#999',
        },
        '.editable': {
          height: '500px',
        },
        '.border': {
          border: '1px solid #d9d9d9',
        },
      }

      function onEditableReloadBefore(inst: IDomEditor) {
        window.alert('editable 即将重载: ' + new Date().toLocaleString())
        console.log('editable 即将重载: ' + new Date().toLocaleString())
      }

      function onToolbarloadBefore(inst: Toolbar) {
        window.alert('toolbar 即将重载: ' + new Date().toLocaleString())
        console.log('toolbar 即将重载: ' + new Date().toLocaleString())
      }

      return { editable, toolbar, formData, modelType, preview, cssRule, onEditableReloadBefore, onToolbarloadBefore }
    },
  })
</script>
