# ant-design-vue + wangeditor5-for-vue3

`wangeditor5-for-vue3` 的 `ant-design-vue` 使用示例

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
import { Form } from 'ant-design-vue'
import { WeEditorFormFields } from 'wangeditor5-for-vue3'

export default function weFormFields() {
  const formFileds: WeEditorFormFields = {}

  const antFormItem = Form.useInjectFormItemContext()

  if (antFormItem) {
    formFileds.blurField = antFormItem.onFieldBlur
    formFileds.changeField = antFormItem.onFieldChange
  }

  return formFileds
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
