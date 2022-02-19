import { Form } from 'ant-design-vue'
import { WeEditorFormFields } from 'wangeditor5-for-vue3'

export default function weFormFields() {
  const formFileds: WeEditorFormFields = {}

  const antFormItem = Form.useInjectFormItemContext()

  if (antFormItem) {
    formFileds.blurField = antFormItem.onFieldBlur
    formFileds.changeField = antFormItem.onFieldChange
  }

  return formFileds
}
