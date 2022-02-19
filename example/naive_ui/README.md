# naive-ui + wangeditor5-for-vue3

`wangeditor5-for-vue3` 的 `naive-ui` 使用示例

## 运行

### yarn

```sh
// 安装依赖
yarn

// 安装 wangeditor5-for-vue3
yarn add wangeditor5-for-vue3

// 运行
yarn run dev
```

### npm

```sh
// 安装依赖
npm i

// 安装 wangeditor5-for-vue3
npm i wangeditor5-for-vue3

// 运行
npm run dev
```

## 表单验证

[src/plugins/form-fields.ts](./src/plugins/form-fields.ts)

```ts
// import { useFormItem } from 'naive-ui/lib/_mixins'
// or
import { useFormItem } from 'naive-ui/es/_mixins'

import { WeEditorFormFields } from 'wangeditor5-for-vue3'

export default function initialize() {
  const { nTriggerFormBlur, nTriggerFormChange } = useFormItem({})

  const formFields: WeEditorFormFields = {
    blurField: nTriggerFormBlur,
    changeField: nTriggerFormChange,
  }

  return formFields
}
```

[src/main.ts](./src/main.ts)

```ts
import App from './App.vue'

import { createApp } from 'vue'
import weFormFields from './plugins/form-fields'

const app = createApp(App)

app.config.globalProperties.$weFormFields = weFormFields

app.mount('#app')
```
