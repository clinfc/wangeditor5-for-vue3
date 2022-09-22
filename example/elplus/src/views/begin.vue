<template>
  <i-page title="基础示例">
    <div>
      <we-toolbar :handle="we1" />
      <we-editable :handle="we1" />
    </div>
    <br />
    <we-editor :handle="we2" />
  </i-page>
</template>

<script lang="ts">
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent } from 'vue'
  import { IPage } from 'example-common'

  export default defineComponent({
    name: 'Begin',
    components: { IPage },
    setup() {
      const { handle: we1 } = useWangEditor({
        editable: {
          config: {
            placeholder: 'WeToolbar + WeEditable'
          }
        }
      })

      const { handle: we2 } = useWangEditor({
        editable: {
          config: {
            placeholder: 'WeEditor'
          }
        }
      })
      return { we1, we2 }
    }
  })
</script>
