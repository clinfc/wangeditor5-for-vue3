<template>
  <div>
    <we-toolbar class="toolbar" :option="we1.toolbar" />
    <we-editable class="editable" :option="we1.editable" />
  </div>
  <br />
  <we-editor
    toolbar-class="toolbar"
    editable-class="editable"
    :toolbar-option="we2.toolbar"
    :editable-option="we2.editable"
  />
</template>

<script lang="ts">
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent } from 'vue'
  import UPrism from '../components/u-prism.vue'

  export default defineComponent({
    components: { UPrism },
    setup() {
      return {
        we1: useWangEditor({
          config: {
            placeholder: 'WeToolbar + WeEditable',
          },
        }),
        we2: useWangEditor({
          config: {
            placeholder: 'WeEditor',
          },
        }),
      }
    },
  })
</script>
