<template>
  <we-editor
    toolbar-class="toolbar"
    editable-class="editable"
    :toolbar-option="toolbar"
    :editable-option="editable"
    v-model:json="data"
  />
</template>

<script lang="ts">
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    setup() {
      const data = ref('')

      const { toolbar, editable } = useWangEditor({
        config: { placeholder: '支持表单验证', autoFocus: false },
        delay: 1000,
      })

      return { data, toolbar, editable }
    },
  })
</script>
