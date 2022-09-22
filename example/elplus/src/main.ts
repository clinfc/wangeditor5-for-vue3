import { createApp } from 'vue'

import App from './App.vue'
import wangeditor from './plugins/wangeditor'
import router from './router/router'

const app = createApp(App)

app.use(wangeditor)
app.use(router)

app.mount('#app')
