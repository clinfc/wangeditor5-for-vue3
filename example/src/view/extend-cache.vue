<style lang="scss"></style>

<template>
  <div class="default-content">
    <el-form :inline="true">
      <el-form-item>
        <el-checkbox v-model="editable.config.readOnly" label="readOnly" />
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
    <editor-toolbar class="toolbar" :option="toolbar" />
    <editor-editable
      class="editable"
      style="width: 100%; height: 500px"
      :option="editable"
      v-model="formData.json"
      v-model:html="formData.html"
    />
  </div>
  <div class="preview">
    <div class="preview-types">
      <button :disabled="modelType === 'json'" @click="togglePreview">预览 JSON</button>
      <button :disabled="modelType === 'html'" @click="togglePreview">预览 HTML</button>
    </div>
    <div class="preview-content">
      <u-prism :lang="modelType" :content="preview" />
    </div>
  </div>
</template>

<script lang="ts">
  import ARTICLES from '@assets/json/article.json'
  import { Descendant } from 'slate'
  import { useWangEditor } from '@we/wangeditor'
  import { computed, defineComponent, ref, shallowReactive, shallowRef, watch } from 'vue'
  import UPrism from '../components/u-prism.vue'
  import { useRoute } from 'vue-router'

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
          // 进行 v-model/v-model:html 绑定时，extendCache 选项无意义
        },
        null
      )

      const formData = shallowReactive({
        json: [] as Descendant[],
        html: '',
      })

      const modelType = ref<'json' | 'html'>('json')

      const preview = computed(() => {
        return modelType.value === 'json' ? JSON.stringify(formData.json, null, 2) : formData.html
      })

      function togglePreview() {
        modelType.value = modelType.value === 'json' ? 'html' : 'json'
      }

      const select = ref(0)

      watch(select, (nv) => {
        const content = articles.value[nv]?.content
        if (content) {
          editable.defaultContent = content
          // 当编辑器有内容时，defaultContent 变化不会更新编辑器，这时我们需要强制重载编辑器
          // 当进行了 v-model/v-model:html 绑定，且此时 editable.extendCache 为 true，那么即使重载编辑器默认内容依然以 v-model/v-model:html 为准
          reloadEditor()
        }
      })

      watch(
        () => route.params.extendCache,
        (nv) => {
          editable.extendCache = nv === 'true'
          select.value = 0
        },
        { immediate: true }
      )

      return { articles, editable, toolbar, clearContent, formData, select, modelType, preview, togglePreview }
    },
  })
</script>
