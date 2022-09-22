<template>
  <i-page title="JSON 类型的的默认数据">
    <el-form :inline="true">
      <el-form-item label="defaultContent：">
        <el-select v-model="select">
          <template v-for="(article, index) in articles" :key="article.title">
            <el-option :label="article.title" :value="index" />
          </template>
        </el-select>
      </el-form-item>
    </el-form>
    <we-toolbar :handle="handle" />
    <we-editable :handle="handle" style="height: 600px" />
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
          defaultContent: articles.value[0].content,
          config: {
            placeholder: '请开始你的表演',
            readOnly: false
          }
          // 未进行 v-model:json/v-model:html 绑定时，extendCache 选项无意义
          // extendCache: false,
        }
      })

      const select = ref(0)

      watch(select, (nv) => {
        const content = articles.value[nv]?.content
        if (content) {
          opts.editable.defaultContent = content
          // 当编辑器有内容时，defaultContent 变化不会更新编辑器，这时我们需要强制重载编辑器
          reloadEditor()
        }
      })

      return { articles, handle, select }
    }
  })
</script>
