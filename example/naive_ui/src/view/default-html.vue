<template>
  <n-form label-placement="left" label-width="auto">
    <n-form-item label="defaultHtml：">
      <n-select v-model:value="select" :options="options"></n-select>
    </n-form-item>
  </n-form>
  <we-toolbar class="toolbar" :option="toolbar" />
  <we-editable class="editable" :option="editable" />
</template>

<script lang="ts">
  import ARTICLES from '../assets/json/article.json'
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, ref, shallowRef, watch } from 'vue'

  export default defineComponent({
    components: {},
    setup() {
      const articles = shallowRef(ARTICLES)

      const options = articles.value.map(({ title }, index) => ({ label: title, value: index }))

      const { editable, toolbar, reloadEditor } = useWangEditor(
        {
          defaultHtml: articles.value[0].html,
          config: {
            placeholder: '请开始你的表演',
            readOnly: false,
          },
          // 未进行 v-model/v-model:json/v-model:html 绑定时，extendCache 选项无意义
          // extendCache: false,
        },
        null
      )

      const select = ref(0)

      watch(select, (nv) => {
        const content = articles.value[nv].html
        if (typeof content === 'string') {
          editable.defaultHtml = content
          // 当编辑器有内容时，defaultContent 变化不会更新编辑器，这时我们需要强制重载编辑器
          reloadEditor()
        }
      })

      return { articles, options, editable, toolbar, select }
    },
  })
</script>
