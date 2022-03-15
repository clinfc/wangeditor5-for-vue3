import { useFormItem } from 'element-plus'
import { WeEditorFormFields } from 'wangeditor5-for-vue3'

export default function weFormFields() {
  const formFileds: WeEditorFormFields = {}

  const { formItem } = useFormItem()
  if (formItem && typeof formItem.validate == 'function') {
    formFileds.blurField = () => {
      formItem.validate('blur')
    }
    formFileds.changeField = () => {
      formItem.validate('change')
    }
  }

  return formFileds
}

// 如果上面这一套无法正常运行，请使用下面这一套。下面这一套为 ElementPlus 旧版本的使用方式。
// import { inject } from 'vue'
// import { elFormItemKey } from 'element-plus'
// import { WeEditorFormFields } from 'wangeditor5-for-vue3'

// export default function weFormFields() {
//   const elFormItem = inject(elFormItemKey)

//   const formFileds: WeEditorFormFields = {}

//   if (elFormItem && typeof elFormItem.validate === 'function') {
//     formFileds.blurField = () => {
//       elFormItem.validate('blur')
//     }
//     formFileds.changeField = () => {
//       elFormItem.validate('change')
//     }
//   }

//   return formFileds
// }
