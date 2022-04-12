# WeToolbarOption

```ts
import { IToolbarConfig } from '@wangeditor/editor'

/**
 * 菜单栏的配置项
 */
export interface WeToolbarOption {
  mode?: 'default' | 'simple'
  config?: Partial<IToolbarConfig>
  /** 对菜单栏实例使用 markRaw 进行标记，默认值：true */
  markRaw?: boolean
}
```

## mode

菜单栏的模式，更多详情请查看 [mode 模式](https://www.wangeditor.com/v5/getting-started.html#mode-%E6%A8%A1%E5%BC%8F)。

## config

这是菜单栏的具体配置，详细的配置项以 wangEditor v5 官方文档为准（认准文档中的 toolbarConfig 关键字）。[前往查看](https://www.wangeditor.com/v5/toolbar-config.html)。

## markRaw

是否使用 composition api 中的 `markRaw` 对菜单栏实例进行标记。标记后的好处是可以杜绝响应式特性造成的未知 bug。[查看 markRaw 详情](https://staging-cn.vuejs.org/api/reactivity-advanced.html#markraw)。
