# 表单验证

`wangeditor5-for-vue3` 的组件支持在其它 UI 框架的表单中使用，同时支持 `blur` 和 `change` 两种 `trigger` 模式。

在提交表单前，或手动触发表单验证前，请使用 [`syncContent`](./use-wang-editor.md#synccontent) 来强制同步 `v-model` 数据，避免数据丢失。更多详情请查看 [`syncContent`](./use-wang-editor.md#synccontent)。

## 目前已支持的 UI 框架

- `element-plus` [查看](https://github.com/clinfc/wangeditor5-for-vue3-example#表单验证)
- `ant-design-vue@^3` [查看](https://github.com/clinfc/wangeditor5-for-vue3/tree/main/example/ant_design#表单验证)
- `naive-ui` [查看](https://github.com/clinfc/wangeditor5-for-vue3/tree/main/example/naive_ui#表单验证)

> 如果你希望能支持某个 UI 库的表单验证，可以前往 [issues](https://github.com/clinfc/wangeditor5-for-vue3/issues) 提交需求

## 表单验证定义规则

### 定义表单验证初始化函数

<CodeGroup>
  <CodeGroupItem title="JS">

```js
function weFormFields() {
  return {
    blurField() {
      // trigger: blur 的具体逻辑
    },
    changeField() {
      // trigger: change 的具体逻辑
    },
  }
}
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```ts
import { WeEditorFormFields } from 'wangeditor5-for-vue3'

function weFormFields() {
  const formFields: WeEditorFormFields = {
    blurField() {
      // trigger: blur 的具体逻辑
    },
    changeField() {
      // trigger: change 的具体逻辑
    },
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

  </CodeGroupItem>
</CodeGroup>

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
import { createApp } from 'vue'
import { weFormFieldInjectionKey } from 'wangeditor5-for-vue3'

const app = createApp(App)

app.provide(weFormFieldInjectionKey, weFormFields)

app.mount('#app')
```

或

```ts
import { defineComponent, provide } from 'vue'
import { weFormFieldInjectionKey } from 'wangeditor5-for-vue3'

export default defineComponent({
  setup() {
    provide(weFormFieldInjectionKey, weFormFields)

    return {}
  },
})
```
