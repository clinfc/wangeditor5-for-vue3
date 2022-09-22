import '@wangeditor/editor/dist/css/style.css'
import '@assets/wangeditor.scss'
import { App } from 'vue'
import { createWeGlobalConfig, WeToolbar, WeEditable, WeEditor } from 'wangeditor5-for-vue3'
import { useFormItem } from 'element-plus'

export default function (app: App) {
  app.use(WeToolbar)
  app.use(WeEditable)
  app.use(WeEditor)
  app.use(
    createWeGlobalConfig({
      // 组件的 attribute 配置
      attrs: {
        toolbar: {
          class: 'el-we-toolbar' // WeToolbar 根节点的 class attribute
        },
        editable: {
          class: 'el-we-editable' // WeEditable 根节点的 class attribute
        },
        editor: {
          class: 'el-we-editor' // WeEditor 根节点的 class attribute
        }
      },
      // 编辑器的全局公共配置
      opts: {
        editable: {
          config: {
            placeholder: '请输入'
          }
        }
      },
      // 表单验证逻辑的初始化函数
      formFieldInit() {
        const { formItem } = useFormItem()

        return {
          blur() {
            formItem?.validate('blur').catch(debugWarn)
          },
          change() {
            formItem?.validate('change').catch(debugWarn)
          }
        }
      }
    })
  )
}

function debugWarn(error: Error) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(error)
  }
}
