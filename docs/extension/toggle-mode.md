# toggle-mode

> `v0.0.9+` 新增

用于切换编辑器的模式，可以对**编辑器**、**菜单栏**和**编辑区**的 `mode` 进行切换。_在此文中的**编辑器**代指**菜单栏**和**编辑区**的构成的整体。_

> [wangEditor 文档：mode 模式](https://www.wangeditor.com/v5/getting-started.html#mode-%E6%A8%A1%E5%BC%8F)

## 快速开始

```ts
import { createApp } from 'vue'
import { registToggleMode } from 'wangeditor5-for-vue3'
import App from './App.vue'

registToggleMode()

createApp(App).mount('#app')
```

## registToggleMode

```ts
declare function registToggleMode(options?: RegistToggleModeOptions): void
```

## RegistToggleModeOptions

> 细节请查看 [toggle-mode types](https://github.com/clinfc/wangeditor5-for-vue3/tree/main/src/toggle-mode/types.ts)

```ts
interface RegistToggleModeOptions {
  /**
   * 自定义的多语言集合
   */
  locale?: ToggleLocale
  /**
   * 注册到默认菜单栏的显示格式。为 false 时，将取消注册到全局菜单栏配置。
   */
  menu?: ToggleModeMenuKey | false
  /**
   * 是否在注册的菜单栏前面添加分割线
   */
  divider?: boolean
  /**
   * 当切换方式为整体进行切换时，切换的模式是以哪一个为准。toolbar：以菜单栏为准；editable：以编辑区为准；auto：各自独立切换，相互不影响。
   */
  standard?: Standrad
}
```

### menu

用于配置 `toggle-mode` 菜单添加到全局默认菜单栏时的具体方式。

```ts
type ToggleModeMenuKey = 'toggleModeButton' | 'toggleModeSelect'
```

- `toggleModeButton`

  添加到全局默认菜单栏中的为一个按钮菜单，此菜单只支持切换**编辑器**的 `mode` 模式。

- `toggleModeSelect`

  添加到全局默认菜单栏中的为一个下拉列表菜单，此菜单的下拉项分别对应**编辑器**、**菜单栏**和**编辑区**的 `mode` 切换选项。

- `false`

  不添加到全局菜单栏配置中，如果用户要使用 `toggle-mode` 菜单，需要在 `WeToolbarOption.config.toolbarKeys` 中进行配置才会生效。

### divider

这个配置项是 `menu` 的附属配置，意在控制是否在 `toggle-mode` 菜单前添加分割线 `|`。默认值：`true`。

### standard

```ts
type Standrad = 'toolbar' | 'editable' | 'auto'
```

当进行**编辑器**级别的 `mode` 切换时，如若此时的**菜单栏**和**编辑区**的 `mode` 类型不一致，我们需要以那一个的值为准。默认值：`auto`。

- `toolbar`

  以**菜单栏**为准。例如：此时菜单栏的 `mode` 为 `default`，编辑区的 `mode` 为 `simple`，那么切换后的菜单栏和编辑区的 `mode` 统一为 `simple`。

- `editable`

  以**编辑区**为准。例如：此时菜单栏的 `mode` 为 `default`，编辑区的 `mode` 为 `simple`，那么切换后的菜单栏和编辑区的 `mode` 统一为 `default`。

- `auto`

  各自独立切换，相互不影响。例如：此时菜单栏的 `mode` 为 `default`，编辑区的 `mode` 为 `simple`，那么切换后的菜单栏和编辑区的 `mode` 分别为 `simple` 和 `default`。

### locale

这是多语言配置，如果你不喜欢默认的配置，那么你可以定义自己想要的，或者在这里添加其它的语言支持（会与默认配置进行合并）。默认支持 `en` 和 `zh-CN` 两种语言。

## 多语言/国际化

### 声明

```ts
import type { ToggleModeLanguage } from 'wangeditor5-for-vue3'

const zhTW: ToggleModeLanguage = {
  mode: {
    title: '切換模式',
    editor: '${mode} 編輯器',
    toolbar: '${mode} 菜單欄',
    editable: '${mode} 編輯區',
    standardAuto: '切換編輯器模式',
  },
}
```

### 注册

**方法一**：使用 `@wangeditor/editor` 内置的多语言注册函数进行注册。

```ts
import { i18nAddResources } from '@wangeditor/editor'

i18nAddResources('zh-tw', zhTW)
```

**方法二**：使用 `wangeditor5-for-vue3` 的 `registToggleMode` 函数，在我们注册 `toggle-mode` 菜单的时候，将新增的多语言放置在多语言配置项中即可多语言的注册。

```ts
import { registToggleMode } from 'wangeditor5-for-vue3'

registToggleMode({
  locale: {
    'zh-tw': zhTW,
  },
})
```
