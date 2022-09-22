<template>
  <i-page title="数据类型为 HTML String 的双向绑定">
    <el-form :inline="true">
      <el-form-item label="v-model：">
        <el-select v-model="select">
          <template v-for="(article, index) in articles" :key="article.title">
            <el-option :label="article.title" :value="index" />
          </template>
        </el-select>
      </el-form-item>
    </el-form>
    <we-editor :handle="handle" v-model:html="html" />
    <div class="preview-content">
      <i-prism lang="html" :content="html" />
    </div>
  </i-page>
</template>

<script lang="ts">
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, ref, shallowRef, watch } from 'vue'
  import { articleList, IPage, IPrism } from 'example-common'

  export default defineComponent({
    components: { IPage, IPrism },
    setup() {
      const articles = shallowRef(articleList)

      const { handle } = useWangEditor({ editable: { delay: 1000, config: { placeholder: 'v-model' } } })

      const html = ref('')

      const select = ref(0)

      watch(select, (nv) => {
        const data = articles.value[nv]?.html
        if (data !== undefined) {
          html.value = data
        }
      })

      return { articles, handle, html, select }
    }
  })
</script>
