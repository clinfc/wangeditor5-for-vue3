import App from './App.vue'
import '@wangeditor/editor/dist/css/style.css'

import { createApp } from 'vue'
import wangeditor from '@we/wangeditor'
import router from '@router/router'
import {
  ElButton,
  ElCheckbox,
  ElCol,
  ElDialog,
  ElDrawer,
  ElForm,
  ElFormItem,
  ElOption,
  ElRow,
  ElSelect,
} from 'element-plus'

const app = createApp(App)
app.use(router)

app.use(wangeditor)

app.config.globalProperties.$ELEMENT = { size: 'mini' }
app.component(ElButton.name, ElButton)
app.component(ElForm.name, ElForm)
app.component(ElFormItem.name, ElFormItem)
app.component(ElOption.name, ElOption)
app.component(ElSelect.name, ElSelect)
app.component(ElDialog.name, ElDialog)
app.component(ElDrawer.name, ElDrawer)
app.component(ElCheckbox.name, ElCheckbox)
app.component(ElRow.name, ElRow)
app.component(ElCol.name, ElCol)

app.mount('#app')
