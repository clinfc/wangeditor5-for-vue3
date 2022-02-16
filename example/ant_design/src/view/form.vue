<style lang="scss">
  .toolbar,
  .editable {
    border: var(--a-input-border, var(--a-border-base));
    line-height: 1;
  }
</style>

<template>
  <div style="padding: 20px">
    <a-form ref="elForm" :model="ruleForm" :rules="rules" @submit="onSubmit" autocomplete="off">
      <a-form-item label="文章标题" name="title">
        <a-input v-model:value="ruleForm.title" placeholder="请输入文章标题"></a-input>
      </a-form-item>
      <a-form-item label="文章内容" name="json">
        <we-toolbar class="toolbar" :option="toolbar" />
        <we-editable class="editable" :option="editable" v-model:json="ruleForm.json" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">表单验证并控制台打印</a-button>
      </a-form-item>
    </a-form>
  </div>
  <u-prism :content="ruleForm.json" lang="json" />
</template>

<script lang="ts">
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { RuleObject } from 'ant-design-vue/es/form'
  import { defineComponent, reactive, ref } from 'vue'
  import UPrism from '../components/u-prism.vue'

  export default defineComponent({
    setup() {
      const elForm = ref<any>(null)

      const ruleForm = reactive({
        title: '',
        json: '',
      })
      const rules = {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' },
          { min: 3, max: 15, message: '文章标题字数在 3 - 15 字符', trigger: 'change' },
        ],
        json: [
          {
            trigger: 'change',
            validator(rule: RuleObject, value: string) {
              if (value.length > 2) {
                return Promise.reject()
              } else {
                return Promise.reject('文章内容不能为空，trigger: change')
              }
            },
          },
          { required: true, message: '文章内容不能为空，trigger: blur', trigger: 'blur' },
        ],
      }

      const { toolbar, editable } = useWangEditor({
        config: { placeholder: '支持表单验证', autoFocus: false },
        delay: 1000,
      })

      function onSubmit() {
        console.log('文章标题：')
        console.log(ruleForm.title)
        console.log('文章内容（string）：')
        console.log(ruleForm.json)
        if (ruleForm.json.length > 2) {
          console.log('文章内容（object）：')
          console.log(JSON.parse(ruleForm.json))
        }
      }

      return { ruleForm, rules, toolbar, editable, elForm, onSubmit }
    },
    components: { UPrism },
  })
</script>
