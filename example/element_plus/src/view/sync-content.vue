<template>
  <el-form ref="ruleForm" label-position="top" :model="formData" :rules="formRule">
    <el-form-item label="文章" prop="json">
      <we-editor
        toolbar-class="toolbar"
        editable-class="editable"
        :toolbar-option="toolbar"
        :editable-option="editable"
        v-model:json="formData.json"
        v-model:html="formData.html"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交表单</el-button>
    </el-form-item>
  </el-form>
  <br />
  <u-prism style="--u-scroll-height: 300px" lang="json" :content="formData.json" />
</template>

<script lang="ts">
  import { FormInstance, FormRules } from 'element-plus'
  import { defineComponent, reactive, Ref, ref } from 'vue'
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import UPrism from '../components/u-prism.vue'

  export default defineComponent({
    components: { UPrism },
    setup() {
      const ruleForm = ref<any>(null) as Ref<FormInstance>

      const formData = reactive({
        json: '',
        html: '',
      })

      const formRule: FormRules = {
        json: [{ required: true, message: '内容不能为空', trigger: 'change' }],
      }

      const { editable, toolbar, syncContent } = useWangEditor({
        delay: 5000,
        config: {
          placeholder: '无操作 5s 后才会同步表单数据，表单提交前使用 syncContent API 强制同步数据，确保数据不被丢失',
        },
      })

      // 表单提交
      function submit() {
        syncContent()
        ruleForm.value.validate((valid) => {
          if (!valid) return
          console.log({ ...formData })
        })
      }

      return { ruleForm, formData, formRule, editable, toolbar, submit }
    },
  })
</script>
