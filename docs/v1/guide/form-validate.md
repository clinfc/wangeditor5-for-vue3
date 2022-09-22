# 表单验证

`wangeditor5-for-vue3` 的组件支持在其它 UI 框架的表单中使用，同时支持 `blur` 和 `change` 两种 `trigger` 模式。

在提交表单前，或手动触发表单验证前，请使用 [`syncContent`](./use-wang-editor.md#synccontent) 来强制同步 `v-model` 数据，避免数据丢失。更多详情请查看 [`syncContent`](./use-wang-editor.md#synccontent)。

## 表单验证触发函数配置

### 定义表单验证初始化函数

<CodeGroup>
  <CodeGroupItem title="JS">

```js
function formFieldInit() {
  return {
    blur() {
      // trigger: blur 的具体逻辑
    },
    change() {
      // trigger: change 的具体逻辑
    }
  }
}
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```ts
import { WeFormField, WeFormFieldInit } from 'wangeditor5-for-vue3'

// 方式一
function formFieldInit(): Partial<WeFormField> {
  return {
    blur() {
      // trigger: blur 的具体逻辑
    },
    change() {
      // trigger: change 的具体逻辑
    }
  }
}

// 方式二
const formFieldInit: WeFormFieldInit = () => {
  return {
    blur() {
      // trigger: blur 的具体逻辑
    },
    change() {
      // trigger: change 的具体逻辑
    }
  }
}
```

```ts
/**
 * 表单验证触发函数
 */
declare type WeFormField = {
  blur: () => void
  change: () => void
}

/**
 * 初始化“表单验证触发函数”的函数
 */
declare type WeFormFieldInit = () => Partial<WeFormField>
```

  </CodeGroupItem>
</CodeGroup>

### 注入表单验证初始化函数

#### 全局注册

请见 [全局注册](./README.md#全局注册)

#### 局部注册

```ts
import { useWangEditor } from 'wangeditor5-for-vue3'

const { handle } = useWangEditor(null, formFieldInit)
```
