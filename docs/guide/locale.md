# 多语言/国际化

> `v0.1.0+` 新增

`wangeditor5-for-vue3` 组件库的内部报错信息支持多语言配置，默认支持**简体中文**和**英语**两种语言。

```ts
import type { VComponentLanguage } from 'wangeditor5-for-vue3'
import { i18nAddResources } from '@wangeditor/editor'

const zhTW: VComponentLanguage = {
  vcomponent: {
    initialize: '你必須使用由 “useWangEditor” 函數創建的 ${component} Option！',
    instance: '無法獲取 ${component} 實例！',
  },
}

// 注册繁体中文
i18nAddResources('zh-tw', zhTW)
```

如果你希望在自己的扩展中能像 `wangeditor5-for-vue3` 一样支持模板字面量语法，那么你可以依赖 `wangeditor5-for-vue3` 中的 `tt` 函数进行开发。

_如果你依赖了 `tt` 函数，那么你的私人定制将离不开 `wangeditor5-for-vue3` 组件库，除非你将 `tt` 函数的代码拷贝到你的私人定制中。_

`tt` 函数的第一个参数为 `@wangeditor/editor` 导出的多语言 [t 函数](https://www.wangeditor.com/v5/i18n.html)的参数，第二个到第 n 个参数依次对应模板字符串中的变量。

```ts
import { i18nAddResources } from '@wangeditor/editor'
import { tt } from 'wangeditor5-for-vue3'

// 注册多语言
i18nAddResources('zh-CN', {
  info: 'name：${name}，age：${age}，sex：${sex}',
})

// 使用多语言
const info = tt('info', '匿名', 18, '男') // 'name：匿名，age：18，sex：男'
```
