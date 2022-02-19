// import { useFormItem } from 'naive-ui/lib/_mixins'
// or
import { useFormItem } from 'naive-ui/es/_mixins'

import { WeEditorFormFields } from 'wangeditor5-for-vue3'

export default function initialize() {
  const { nTriggerFormBlur, nTriggerFormChange } = useFormItem({})

  const formFields: WeEditorFormFields = {
    blurField: nTriggerFormBlur,
    changeField: nTriggerFormChange,
  }

  return formFields
}
