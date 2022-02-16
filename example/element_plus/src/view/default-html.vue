<template>
  <el-form :inline="true">
    <el-form-item label="defaultHtml：">
      <el-select v-model="select">
        <template v-for="(article, index) in articles" :key="article.title">
          <el-option :label="article.title" :value="index" />
        </template>
      </el-select>
    </el-form-item>
  </el-form>
  <we-toolbar class="toolbar" :option="toolbar" />
  <we-editable class="editable" :option="editable" />
</template>

<script lang="ts">
  import ARTICLES from '@assets/json/article.json'
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, ref, shallowRef, watch } from 'vue'

  export default defineComponent({
    components: {},
    setup() {
      const articles = shallowRef(ARTICLES)

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
        const content = articles.value[nv]?.html
        if (typeof content === 'string') {
          editable.defaultHtml = content
          reloadEditor()
        }
      })

      return { articles, editable, toolbar, select }
    },
  })
</script>
