<template>
  <i-page :title="title">
    <div class="default-content">
      <el-form :inline="true">
        <el-form-item label="readOnly：">
          <el-radio-group v-model="opts.editable.config.readOnly">
            <el-radio :label="true">true</el-radio>
            <el-radio :label="false">false</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="defaultContent：">
          <el-select v-model="select">
            <template v-for="(article, index) in articles" :key="article.title">
              <el-option :label="article.title" :value="index" />
            </template>
          </el-select>
          <span v-if="opts.editable.extendCache">
            切换前先
            <span style="cursor: pointer; color: red" @click="clearContent">清除缓存</span>
            <span v-show="opts.editable.config.readOnly" style="color: #cccccc; padding: 0 5px">
              （只读模式下，无法清除缓存）
            </span>
          </span>
        </el-form-item>
      </el-form>
    </div>
    <we-editor v-model:json="formData.json" v-model:html="formData.html" :handle="handle" />
    <br />
    <el-card shadow="never">
      <el-button :disabled="modelType === 'json'" @click="modelType = 'json'">预览 JSON Array</el-button>
      <el-button :disabled="modelType === 'html'" @click="modelType = 'html'">预览 HTML String</el-button>
    </el-card>
    <br />
    <i-prism :lang="modelType === 'html' ? 'html' : 'json'" :content="preview" />
  </i-page>
</template>

<script lang="ts">
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { computed, defineComponent, ref, shallowReactive, shallowRef, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { SlateDescendant } from '@wangeditor/editor'
  import { articleList, IPage, IPrism } from 'example-common'

  export default defineComponent({
    components: { IPage, IPrism },
    setup() {
      const route = useRoute()
      const articles = shallowRef(articleList)

      const { opts, handle, clearContent, reloadEditor } = useWangEditor({
        editable: {
          defaultContent: articles.value[0].content,
          config: {
            placeholder: '请开始你的表演',
            readOnly: false
          }
        }
      })

      const formData = shallowReactive({
        json: [] as SlateDescendant[],
        html: ''
      })

      const modelType = ref<'json' | 'html'>('json')

      const preview = computed(() => {
        switch (modelType.value) {
          case 'json':
            return JSON.stringify(formData.json, null, 2)
          default:
            return formData.html
        }
      })

      const select = ref(0)

      watch(select, (nv) => {
        const content = articles.value[nv]?.content
        if (content) {
          opts.editable.defaultContent = content
          // 当编辑器有内容时，defaultContent 变化不会更新编辑器，这时我们需要强制重载编辑器
          // 当进行了 v-model:json/v-model:html 绑定，且此时 editable.extendCache 为 true，那么即使重载编辑器默认内容依然以 v-model:json/v-model:html 为准
          reloadEditor()
        }
      })

      watch(
        () => route.path,
        (nv) => {
          opts.editable.extendCache = /true$/.test(nv)
        },
        { immediate: true }
      )

      const title = computed(() => {
        return `编辑器重载时，默认内容以 ${opts.editable.extendCache ? 'v-mode' : 'defaultContent'} 数据为准`
      })

      return { articles, opts, handle, formData, select, modelType, preview, title, clearContent }
    }
  })
</script>
