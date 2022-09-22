<template>
  <i-page title="HTML 字符串类型的默认数据">
    <el-form :inline="true">
      <el-form-item label="defaultHtml：">
        <el-select v-model="select">
          <template v-for="(article, index) in articles" :key="article.title">
            <el-option :label="article.title" :value="index" />
          </template>
        </el-select>
      </el-form-item>
    </el-form>
    <we-editor :handle="handle" :editableAttrs="{ style: 'height: 600px' }" />
  </i-page>
</template>

<script lang="ts">
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, ref, shallowRef, watch } from 'vue'
  import { articleList, IPage } from 'example-common'

  export default defineComponent({
    components: { IPage },
    setup() {
      const articles = shallowRef(articleList)

      const { opts, handle, reloadEditor } = useWangEditor({
        editable: {
          defaultHtml: articles.value[0].html,
          config: {
            placeholder: '请开始你的表演',
            readOnly: false
          }
          // 未进行 v-model/v-model:json/v-model:html 绑定时，extendCache 选项无意义
          // extendCache: false,
        }
      })

      const select = ref(0)

      watch(select, (nv) => {
        const content = articles.value[nv]?.html
        if (typeof content === 'string') {
          opts.editable.defaultHtml = content
          reloadEditor()
        }
      })

      return { articles, handle, select }
    }
  })
</script>
