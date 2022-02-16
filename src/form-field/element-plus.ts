import { App, inject } from 'vue'
import { elFormItemKey } from 'element-plus'
import { EditorFormField } from '../core/types'

function initialize() {
  const elFormItem = inject(elFormItemKey)

  const formFiled: EditorFormField = {}

  if (elFormItem && typeof elFormItem.validate === 'function') {
    formFiled.blurField = () => {
      elFormItem.validate('blur')
    }
    formFiled.changeField = () => {
      elFormItem.validate('change')
    }
  }

  return formFiled
}

export default function wangeditorFormField(app: App) {
  app.config.globalProperties.$weFormFieldInitialize = initialize
}
