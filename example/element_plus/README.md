# element-plus + wangeditor5-for-vue3

`wangeditor5-for-vue3` 的 `element-plus` 使用示例

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
import { inject } from 'vue'
import { elFormItemKey } from 'element-plus'
import { WeEditorFormFields } from 'wangeditor5-for-vue3'

export default function weFormFields() {
  const elFormItem = inject(elFormItemKey)

  const formFileds: WeEditorFormFields = {}

  if (elFormItem && typeof elFormItem.validate === 'function') {
    formFileds.blurField = () => {
      elFormItem.validate('blur')
    }
    formFileds.changeField = () => {
      elFormItem.validate('change')
    }
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
