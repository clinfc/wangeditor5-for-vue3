import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import naive from 'naive-ui'
import 'vfonts/Lato.css'

import { weEditorPlusCssRule, WeEditable, WeEditor, WeEditorPlus, WeToolbar } from 'wangeditor5-for-vue3'
import weFormFields from './plugins/form-fields'

// 将 wangEditor 的 css 引入为 纯文本/路径
import cssstyle from '@wangeditor/editor/dist/css/style.css'
// 将 wangEditor 的 css 注入到 shadow dom 中
weEditorPlusCssRule(cssstyle)

const app = createApp(App)

app.use(router).use(naive)

app.config.globalProperties.$weFormFields = weFormFields
app.component(WeToolbar.name, WeToolbar)
app.component(WeEditable.name, WeEditable)
app.component(WeEditor.name, WeEditor)
app.component(WeEditorPlus.name, WeEditorPlus)

app.mount('#app')
