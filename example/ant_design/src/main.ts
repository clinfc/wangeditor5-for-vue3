import { createApp } from 'vue'
import router from '@router/router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import {
  weEditorPlusCssRule,
  WeEditable,
  WeEditor,
  WeEditorPlus,
  WeToolbar,
  registToggleMode,
} from 'wangeditor5-for-vue3'
import weFormFields from './plugins/form-fields'

registToggleMode()

// 将 wangEditor 的 css 引入为 纯文本/路径
import cssstyle from '@wangeditor/editor/dist/css/style.css'
// 将 wangEditor 的 css 注入到 shadow dom 中
weEditorPlusCssRule(cssstyle)

import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(Antd)

app.config.globalProperties.$weFormFields = weFormFields
app.component(WeToolbar.name, WeToolbar)
app.component(WeEditable.name, WeEditable)
app.component(WeEditor.name, WeEditor)
app.component(WeEditorPlus.name, WeEditorPlus)

app.mount('#app')
