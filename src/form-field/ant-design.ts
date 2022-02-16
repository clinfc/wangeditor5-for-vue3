import { Form } from 'ant-design-vue'
import { App } from 'vue'
import { EditorFormField } from '../core/types'

function initialize() {
  const formFiled: EditorFormField = {}

  const antFormItem = Form.useInjectFormItemContext()

  if (antFormItem) {
    formFiled.blurField = antFormItem.onFieldBlur
    formFiled.changeField = antFormItem.onFieldChange
  }

  return formFiled
}

export default function weFormField(app: App) {
  app.config.globalProperties.$weFormFieldInitialize = initialize
}
