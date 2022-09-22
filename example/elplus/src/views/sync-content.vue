<template>
  <i-page title="手动同步 v-model 数据">
    <el-form ref="ruleForm" label-position="top" :model="formData" :rules="formRule">
      <el-form-item label="文章" prop="json">
        <we-editor :handle="handle" v-model:json.string="formData.json" v-model:html="formData.html" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交表单</el-button>
      </el-form-item>
    </el-form>
    <br />
    <i-prism lang="json" :content="formData.json" />
  </i-page>
</template>

<script lang="ts">
  import { FormInstance, FormRules } from 'element-plus'
  import { defineComponent, reactive, Ref, ref } from 'vue'
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { IPage, IPrism } from 'example-common'

  export default defineComponent({
    components: { IPage, IPrism },
    setup() {
      const ruleForm = ref<any>(null) as Ref<FormInstance>

      const formData = reactive({
        json: '',
        html: ''
      })

      const formRule: FormRules = {
        json: [{ required: true, message: '内容不能为空', trigger: 'change' }]
      }

      const { handle, syncContent } = useWangEditor({
        editable: {
          delay: 5000,
          config: {
            placeholder: '无操作 5s 后才会同步表单数据，表单提交前使用 syncContent API 强制同步数据，确保数据不被丢失'
          }
        }
      })

      // 表单提交
      function submit() {
        syncContent()
        ruleForm.value.validate((valid) => {
          console.log({ valid, ...formData })
        })
      }

      return { ruleForm, formData, formRule, handle, submit }
    }
  })
</script>
