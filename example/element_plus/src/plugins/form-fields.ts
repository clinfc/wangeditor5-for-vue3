import { inject } from 'vue'
import { elFormItemKey } from 'element-plus'
import { WeEditorFormFields } from 'wangeditor5-for-vue3'

export default function weFormFields() {
  const elFormItem = inject(elFormItemKey)

  const formFileds: WeEditorFormFields = {}

  if (elFormItem && typeof elFormItem.validate === 'function') {
    formFileds.blurField = () => {
      elFormItem.validate('blur')
    }
    formFileds.changeField = () => {
      elFormItem.validate('change')
    }
  }

  return formFileds
}
