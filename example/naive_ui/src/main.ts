import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import naive from 'naive-ui'
import 'vfonts/Lato.css'

import { shadowCssRule, WeEditable, WeEditor, WeToolbar } from 'wangeditor5-for-vue3'

import '@wangeditor/editor/dist/css/style.css'

// 用于 shadow 模式
import westyle from '@wangeditor/editor/dist/css/style.css'

shadowCssRule(westyle)

const app = createApp(App)

app.use(router).use(naive)

app.component(WeToolbar.name, WeToolbar)
app.component(WeEditable.name, WeEditable)
app.component(WeEditor.name, WeEditor)

app.mount('#app')
