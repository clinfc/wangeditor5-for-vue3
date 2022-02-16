<template>
  <n-form label-placement="left" label-width="auto">
    <n-form-item label="v-model:json：">
      <n-select v-model:value="select" :options="options"></n-select>
    </n-form-item>
  </n-form>
  <we-toolbar class="toolbar" :option="toolbar" />
  <we-editable class="editable" style="width: 100%; height: 500px" :option="editable" v-model:json="jstr" />
  <div class="preview-content">
    <u-prism lang="json" :content="jstr" />
  </div>
</template>

<script lang="ts">
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, ref, shallowRef, watch } from 'vue'
  import ARTICLES from '../assets/json/article.json'
  import UPrism from '../components/u-prism.vue'

  export default defineComponent({
    components: { UPrism },
    setup() {
      const articles = shallowRef(ARTICLES)

      const options = articles.value.map(({ title }, index) => ({ label: title, value: index }))

      const { editable, toolbar } = useWangEditor({ delay: 1000, config: { placeholder: 'v-model:json' } })

      const jstr = ref('')

      const select = ref(0)

      watch(select, (nv) => {
        const content = articles.value[nv].content
        if (content) {
          jstr.value = JSON.stringify(content)
        }
      })

      return { editable, toolbar, jstr, select, articles, options }
    },
  })
</script>
