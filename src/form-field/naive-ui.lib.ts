import { App } from 'vue'
import { useFormItem } from 'naive-ui/lib/_mixins'
import { EditorFormField } from '../core/types'

function initialize() {
  const { nTriggerFormBlur, nTriggerFormChange } = useFormItem({})

  const formField: EditorFormField = {
    blurField: nTriggerFormBlur,
    changeField: nTriggerFormChange,
  }

  return formField
}

export default function weFormFieldInitialize(app: App) {
  app.config.globalProperties.$weFormFieldInitialize = initialize
}
