# 表单验证

`wangeditor5-for-vue3` 的 `EditorEditable` 组件支持在其它 UI 框架的表单中使用，同时支持 `blur` 和 `change` 两种 `trigger` 模式。

**目前已内置支持的 UI 框架有：**

- [element-plus](https://element-plus.gitee.io/#/zh-CN)
- [ant-design-vue@^3](https://next.antdv.com/)

## element-plus

```ts
import { createApp } from 'vue'
import wangeditor from 'wangeditor5-for-vue3'
import wangeditorFormField from 'wangeditor5-for-vue3/dist/element-plus'
import '@wangeditor/editor/dist/css/style.css'

const app = createApp(App)

// 注册 EditorToolbar 和 EditorEditable 组件
app.use(wangeditor)
// 注册 element-plus 的表单验证模块
app.use(wangeditorFormField)

app.mount('#app')
```

> [element-plus 的表单验证使用示例](https://github.com/clinfc/wangeditor5-for-vue3/tree/main/example/element-plus/src/view/form.vue)

## ant-design-vue@^3

```ts
import { createApp } from 'vue'
import wangeditor from 'wangeditor5-for-vue3'
import wangeditorFormField from 'wangeditor5-for-vue3/dist/ant-design'
import '@wangeditor/editor/dist/css/style.css'

const app = createApp(App)

// 注册 EditorToolbar 和 EditorEditable 组件
app.use(wangeditor)
// 注册 ant-design-vue 的表单验证模块
app.use(wangeditorFormField)

app.mount('#app')
```

> [ant-design-vue 的表单验证使用示例](https://github.com/clinfc/wangeditor5-for-vue3/tree/main/example/ant-design/src/view/form.vue)

## 自定义表单验证

### 定义表单验证初始化函数

```ts
import { EditorFormFields } from 'wangeditor5-for-vue3'

function initialize() {
  const formField: EditorFormFields = {}

  formFiled.blurField = () => {
    // trigger: blur 的具体逻辑
  }
  formFiled.changeField = () => {
    // trigger: change 的具体逻辑
  }

  return formField
}
```

```ts
interface EditorFormFields {
  blurField?: () => void
  changeField?: () => void
}
```

### 注入表单验证初始化函数

#### 全局挂载

```ts
import { createApp } from 'vue'

const app = createApp(App)

app.config.globalProperties.$wangeditorFormFieldInitialize = initialize

app.mount('#app')
```

#### provide

```ts
import { provide } from 'vue'
import { wangeditorFormFieldInjectionKey } from 'wangeditor5-for-vue3'

export default defineComponent({
  components: { UPrism },
  setup() {
    provide(wangeditorFormFieldInjectionKey, initialize)

    return {}
  },
})
```

> 如果你希望能内置支持某个 UI 库的表单验证，可以前往 [issues](https://github.com/clinfc/wangeditor5-for-vue3/issues) 提交需求
