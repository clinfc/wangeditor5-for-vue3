<template>
  <a-form layout="inline">
    <a-form-item label="v-model：">
      <a-select v-model:value="select" style="width: 200px">
        <template v-for="(article, index) in articles" :key="article.title">
          <a-select-option :value="index">{{ article.title }}</a-select-option>
        </template>
      </a-select>
    </a-form-item>
  </a-form>
  <we-toolbar class="toolbar" :option="toolbar" />
  <we-editable class="editable" style="width: 100%; height: 500px" :option="editable" v-model="json" />
  <div class="preview-content">
    <u-prism lang="json" :content="jstr" />
  </div>
</template>

<script lang="ts">
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { computed, defineComponent, ref, shallowRef, watch } from 'vue'
  import ARTICLES from '@assets/json/article.json'
  import UPrism from '../components/u-prism.vue'

  export default defineComponent({
    components: { UPrism },
    setup() {
      const articles = shallowRef(ARTICLES)
      const { editable, toolbar } = useWangEditor({ delay: 1000, config: { placeholder: 'v-model' } })

      const json = shallowRef([])

      const jstr = computed(() => JSON.stringify(json.value, null, 2))

      const select = ref(0)

      watch(select, (nv) => {
        const content = articles.value[nv]?.content
        if (content) {
          // @ts-ignore
          json.value = content
        }
      })

      return { editable, toolbar, json, jstr, select, articles }
    },
  })
</script>
