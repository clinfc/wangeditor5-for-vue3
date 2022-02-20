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
</template>

<script lang="ts">
  import { Descendant } from 'slate'
  import { WeEditableOption, WeToolbarOption, useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowReactive } from 'vue'
  import { IDomEditor } from '@wangeditor/editor'

  export default defineComponent({
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

      function onReloadBefore(e: IDomEditor) {
        console.log('reload  before', e)
      }

      return { editable, toolbar, formData, onReloadBefore }
    },
  })
</script>
