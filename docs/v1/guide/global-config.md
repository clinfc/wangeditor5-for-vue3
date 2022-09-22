# createWeGlobalConfig

创建 `wangEditor` 编辑器的全局配置的 `vue.use` 注册函数。另见 [全局注册](./README.md#全局注册)。

```ts
import { Plugin } from 'vue'

declare function createWeGlobalConfig(config: WeGlobalConfig): Plugin
```

```ts
declare interface WeGlobalConfig {
  opts?: Partial<WeOptions<false>>
  attrs?: WeGlobalAttrs
  formFieldInit?: WeFormFieldInit
}
```

```ts
declare interface WeGlobalAttrs {
  editor?: Record<string, any>
  toolbar?: Record<string, any>
  editable?: Record<string, any>
}
```

- [WeOption](./typescript.md#weoptions)
- [WeFormFieldInit](./form-validate.md#定义表单验证初始化函数)
