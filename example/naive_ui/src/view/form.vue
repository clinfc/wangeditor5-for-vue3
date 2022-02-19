<style lang="scss">
  .toolbar,
  .editable {
    border: 1px solid #d9d9d9;
    line-height: 1;
  }
</style>

<template>
  <div style="padding: 20px">
    <n-form ref="elForm" :model="ruleForm" :rules="rules" label-placement="left">
      <n-form-item label="文章标题" path="title">
        <n-input v-model:value="ruleForm.title" placeholder="请输入文章标题"></n-input>
      </n-form-item>
      <n-form-item label="文章内容" path="json">
        <we-editor
          toolbar-class="toolbar"
          editable-class="editable"
          :toolbar-option="toolbar"
          :editable-option="editable"
          v-model:json="ruleForm.json"
        />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSubmit">表单验证并控制台打印</n-button>
      </n-form-item>
    </n-form>
  </div>
  <u-prism :content="ruleForm.json" lang="json" />
</template>

<script lang="ts">
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, reactive, ref } from 'vue'
  import UPrism from '../components/u-prism.vue'
  import { FormRules } from 'naive-ui'

  export default defineComponent({
    setup() {
      const elForm = ref<any>(null)

      const ruleForm = reactive({
        title: '',
        json: '',
      })
      const rules: FormRules = {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' },
          { min: 3, max: 15, message: '文章标题字数在 3 - 15 字符', trigger: 'blur' },
        ],
        json: [
          {
            trigger: 'change',
            validator(rule, value: string) {
              if (value.length > 2) {
                return true
              }
              return new Error('文章内容不能为空，trigger: change')
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
        elForm.value.validate((valid: boolean) => {
          if (!valid) return

          console.log('文章标题：')
          console.log(ruleForm.title)
          console.log('文章内容（string）：')
          console.log(ruleForm.json)
          if (ruleForm.json.length > 2) {
            console.log('文章内容（object）：')
            console.log(JSON.parse(ruleForm.json))
          }
        })
      }

      return { ruleForm, rules, toolbar, editable, elForm, onSubmit }
    },
    components: { UPrism },
  })
</script>
