<style lang="scss"></style>

<template>
  <div class="default-content">
    <el-form :inline="true">
      <el-form-item label="readOnly：">
        <el-radio-group v-model="editable.config.readOnly">
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
        <span v-if="editable.extendCache">
          切换前先
          <span style="cursor: pointer; color: red" @click="clearContent">清除缓存</span>
          <span v-show="editable.config.readOnly" style="color: #cccccc; padding: 0 5px">
            （只读模式下，无法清除缓存）
          </span>
        </span>
      </el-form-item>
    </el-form>
  </div>
  <we-editor
    toolbar-class="toolbar"
    editable-class="editable"
    :toolbar-option="toolbar"
    :editable-option="editable"
    v-model="formData.json"
    v-model:json="formData.jstr"
    v-model:html="formData.html"
  />
  <br />
  <el-card shadow="never">
    <el-button :disabled="modelType === 'json'" @click="modelType = 'json'">预览 JSON Array</el-button>
    <el-button :disabled="modelType === 'jstr'" @click="modelType = 'jstr'">预览 JSON String</el-button>
    <el-button :disabled="modelType === 'html'" @click="modelType = 'html'">预览 HTML String</el-button>
  </el-card>
  <br />
  <u-prism style="--u-scroll-height: 300px" :lang="modelType === 'html' ? 'html' : 'json'" :content="preview" />
</template>

<script lang="ts">
  import ARTICLES from '@assets/json/article.json'
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { computed, defineComponent, ref, shallowReactive, shallowRef, watch } from 'vue'
  import UPrism from '../components/u-prism.vue'
  import { useRoute } from 'vue-router'
  import { SlateDescendant } from '@wangeditor/editor'

  export default defineComponent({
    components: { UPrism },
    setup() {
      const route = useRoute()
      const articles = shallowRef(ARTICLES)

      const { editable, toolbar, clearContent, reloadEditor } = useWangEditor(
        {
          defaultContent: articles.value[0].content,
          config: {
            placeholder: '请开始你的表演',
            readOnly: false,
          },
          // 进行 v-model/v-model:json/v-model:html 绑定时，extendCache 选项无意义
        },
        null
      )

      const formData = shallowReactive({
        json: [] as SlateDescendant[],
        jstr: '',
        html: '',
      })

      const modelType = ref<'json' | 'jstr' | 'html'>('json')

      const preview = computed(() => {
        switch (modelType.value) {
          case 'json':
            return JSON.stringify(formData.json, null, 2)
          case 'jstr':
            return formData.jstr
          default:
            return formData.html
        }
      })

      const select = ref(0)

      watch(select, (nv) => {
        const content = articles.value[nv]?.content
        if (content) {
          editable.defaultContent = content
          // 当编辑器有内容时，defaultContent 变化不会更新编辑器，这时我们需要强制重载编辑器
          // 当进行了 v-model/v-model:json/v-model:html 绑定，且此时 editable.extendCache 为 true，那么即使重载编辑器默认内容依然以 v-model/v-model:json/v-model:html 为准
          reloadEditor()
        }
      })

      watch(
        () => route.path,
        (nv) => {
          editable.extendCache = /true$/.test(nv)
        },
        { immediate: true }
      )

      return { articles, editable, toolbar, clearContent, formData, select, modelType, preview }
    },
  })
</script>
