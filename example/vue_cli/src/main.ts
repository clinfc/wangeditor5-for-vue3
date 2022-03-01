import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { weEditorPlusCssRule, WeToolbar, WeEditable, WeEditor, WeEditorPlus } from 'wangeditor5-for-vue3'

import '@wangeditor/editor/dist/css/style.css'

// 由于 WeEditorPlus 在 vue-cli 项目中无法正常使用，因此注释掉的部分可以忽略
// 内联 loader：https://webpack.docschina.org/concepts/loaders/#inline
// extract-tostring-loader：请查看 /loaders/extract-tostring-loader.js 文件
// 将 wangeditor 的 css 引入为文本
// import wecss from '!!extract-tostring-loader!extract-loader!css-loader!@wangeditor/editor/dist/css/style.css'
// weEditorPlusCssRule(wecss)

const app = createApp(App)

app.component(WeToolbar.name, WeToolbar)
app.component(WeEditable.name, WeEditable)
app.component(WeEditor.name, WeEditor)
app.component(WeEditorPlus.name, WeEditorPlus)

app.use(router)
app.mount('#app')
