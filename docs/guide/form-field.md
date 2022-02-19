# 表单验证

`wangeditor5-for-vue3` 的组件支持在其它 UI 框架的表单中使用，同时支持 `blur` 和 `change` 两种 `trigger` 模式。

## 目前已支持的 UI 框架

- `element-plus` [查看](https://github.com/clinfc/wangeditor5-for-vue3/tree/main/example/element_plus#表单验证)
- `ant-design-vue@^3` [查看](https://github.com/clinfc/wangeditor5-for-vue3/tree/main/example/ant_design#表单验证)
- `naive-ui` [查看](https://github.com/clinfc/wangeditor5-for-vue3/tree/main/example/naive_ui#表单验证)

> 如果你希望能支持某个 UI 库的表单验证，可以前往 [issues](https://github.com/clinfc/wangeditor5-for-vue3/issues) 提交需求

## 表单验证定义规则

### 定义表单验证初始化函数

```ts
import { WeEditorFormFields } from 'wangeditor5-for-vue3'

function weFormFields() {
  const formFields: WeEditorFormFields = {}

  formFileds.blurField = () => {
    // trigger: blur 的具体逻辑
  }
  formFileds.changeField = () => {
    // trigger: change 的具体逻辑
  }

  return formFields
}
```

```ts
interface WeEditorFormFields {
  blurField?: () => void
  changeField?: () => void
}
```

### 注入表单验证初始化函数

#### 全局挂载

```ts
import { createApp } from 'vue'

const app = createApp(App)

app.config.globalProperties.$weFormFields = weFormFields

app.mount('#app')
```

#### provide

```ts
import { defineComponent, provide } from 'vue'
import { weFormFieldInjectionKey } from 'wangeditor5-for-vue3'

export default defineComponent({
  components: { UPrism },
  setup() {
    provide(weFormFieldInjectionKey, weFormFields)

    return {}
  },
})
```
