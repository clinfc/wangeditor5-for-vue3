import { createApp } from 'vue'
import router from '@router/router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import { shadowCssRule, WeEditable, WeEditor, WeToolbar } from 'wangeditor5-for-vue3'
import wangeditorFormField from 'wangeditor5-for-vue3/dist/ant-design'
import '@wangeditor/editor/dist/css/style.css'

// 将 wangEditor 的 css 引入为 纯文本/路径
import cssstyle from '@wangeditor/editor/dist/css/style.css'

// 将 wangEditor 的 css 注入到 shadow dom 中
shadowCssRule(cssstyle)

import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(Antd)
app.use(wangeditorFormField)
app.component(WeToolbar.name, WeToolbar)
app.component(WeEditable.name, WeEditable)
app.component(WeEditor.name, WeEditor)

app.mount('#app')
