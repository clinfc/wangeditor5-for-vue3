<style lang="scss">
  .toolbar,
  .editable {
    border: var(--el-input-border, var(--el-border-base));
    line-height: 1;
  }
</style>

<template>
  <div style="padding: 20px">
    <el-form ref="elForm" :model="ruleForm" :rules="rules" label-width="80px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="ruleForm.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="json">
        <we-editor
          toolbar-class="toolbar"
          editable-class="editable"
          :toolbar-option="toolbar"
          :editable-option="editable"
          v-model:json="ruleForm.json"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">表单验证并控制台打印</el-button>
      </el-form-item>
    </el-form>
  </div>
  <u-prism :content="ruleForm.json" lang="json" />
</template>

<script lang="ts">
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { FormRulesMap } from 'element-plus/es/components/form/src/form.type'
  import { defineComponent, reactive, ref } from 'vue'
  import UPrism from '../components/u-prism.vue'

  export default defineComponent({
    setup() {
      const elForm = ref<any>(null)

      const ruleForm = reactive({
        title: '',
        json: '',
      })
      const rules: FormRulesMap = {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' },
          { min: 3, max: 15, message: '文章标题字数在 3 - 15 字符', trigger: 'blur' },
        ],
        json: [
          {
            trigger: 'change',
            validator(rule, value: string, cb) {
              if (value.length > 2) {
                cb()
              } else {
                cb('文章内容不能为空，trigger: change')
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
