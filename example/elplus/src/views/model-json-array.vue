<template>
  <i-page title="数据类型为 JSON Array 的双向绑定">
    <el-form :inline="true">
      <el-form-item label="v-model：">
        <el-select v-model="select">
          <template v-for="(article, index) in articles" :key="article.title">
            <el-option :label="article.title" :value="index" />
          </template>
        </el-select>
      </el-form-item>
    </el-form>
    <we-editor :handle="handle" v-model:json="json" />
    <div>
      <i-prism lang="json" :content="jstr" />
    </div>
  </i-page>
</template>

<script lang="ts">
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { computed, defineComponent, ref, shallowRef, watch } from 'vue'
  import { articleJsonList, IPage, IPrism } from 'example-common'

  export default defineComponent({
    components: { IPage, IPrism },
    setup() {
      const articles = shallowRef(articleJsonList)

      const { handle } = useWangEditor({ editable: { delay: 1000, config: { placeholder: 'v-model' } } })

      const json = shallowRef([] as any[])

      const jstr = computed(() => JSON.stringify(json.value, null, 2))

      const select = ref(0)

      watch(select, (nv) => {
        const content = articles.value[nv]?.content
        if (content !== undefined) {
          json.value = content
        }
      })

      return { articles, handle, json, jstr, select }
    }
  })
</script>
