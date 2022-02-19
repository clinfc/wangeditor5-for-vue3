import App from './App.vue'
import router from '@router/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { weEditorPlusCssRule, WeEditable, WeEditor, WeEditorPlus, WeToolbar } from 'wangeditor5-for-vue3'

// 用于支持表单验证
import weFormFields from './plugins/form-fields'

// 用于 shadow 模式
import westyle from '@wangeditor/editor/dist/css/style.css'
weEditorPlusCssRule(westyle)

const app = createApp(App)

app.config.globalProperties.$ELEMENT = { size: 'mini' }
app.use(ElementPlus)

app.use(router)

app.config.globalProperties.$weFormFields = weFormFields
app.component(WeToolbar.name, WeToolbar)
app.component(WeEditable.name, WeEditable)
app.component(WeEditor.name, WeEditor)
app.component(WeEditorPlus.name, WeEditorPlus)

app.mount('#app')
