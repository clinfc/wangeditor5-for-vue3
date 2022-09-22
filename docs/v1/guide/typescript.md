# TypeScript

## WeOptions

```ts
/**
 * 编辑器配置项
 */
declare type WeOptions<T extends boolean = true> = {
  /** 重载的延迟时间，默认值：500，单位：毫秒 */
  reloadDelay: number
  toolbar: T extends true ? Required<WeToolbarOption> : WeToolbarOption
  editable: T extends true ? Required<WeEditableOption> : WeEditableOption
}
```

另见 [useWangEditor](./use-wang-editor.md) 或 [createWeGlobalConfig](./global-config.md)。

## WeToolbarOption

```ts
import { IToolbarConfig } from '@wangeditor/editor'

/**
 * 菜单栏的配置项
 */
export interface WeToolbarOption {
  mode?: 'default' | 'simple'
  config?: Partial<IToolbarConfig>
}
```

### mode

菜单栏的模式，更多详情请查看 [mode 模式](https://www.wangeditor.com/v5/getting-started.html#mode-%E6%A8%A1%E5%BC%8F)。

### config

这是菜单栏的具体配置，详细的配置项以 `wangEditor v5` 官方文档为准（认准文档中的 `toolbarConfig` 关键字）。[前往查看](https://www.wangeditor.com/v5/toolbar-config.html)。

## WeEditableOption

```ts
import { IEditorConfig, SlateDescendant } from '@wangeditor/editor'

/**
 * 编辑器配置项
 */
declare interface WeEditableOption {
  /** 编辑器模式 */
  mode?: 'default' | 'simple'
  /** 编辑器初始化的默认内容（json array 或 json string），优先级高于 defaultHtml */
  defaultContent?: SlateDescendant[] | string | null
  /** 编辑器初始化的默认内容（html string），优先级低于 defaultContent */
  defaultHtml?: string | null
  /** 编辑器配置 */
  config?: Partial<IEditorConfig>
  /** v-model 数据同步的防抖时长，默认值：3000，单位：毫秒 */
  delay?: number
  /**
   * 编辑器创建时默认内容的优先级排序，默认值：true。
   * true：v-model:json > v-model:html > defaultContent > defaultHtml。
   * false: defaultContent > defaultHtml > v-model:json > v-model:html。
   */
  extendCache?: boolean
}
```

### mode

编辑器的模式，更多详情请查看 [mode 模式](https://www.wangeditor.com/v5/getting-started.html#mode-%E6%A8%A1%E5%BC%8F)。

### extendCache

当 `v-model:json`/`v-model:json.string`/`v-model:html` 与 `defaultContent`/`defaultHtml` 同时使用的时候，我们可以使用 `extendCache` 配置项来控制重载后编辑器的默认内容。

当 `extendCahce` 为 `true` 时，编辑器**创建**/**重载**时显示内容的优先级为：`v-model:json`/`v-model:json.string` > `v-model:html` > `defaultContent` > `defaultHtml`。

当 `extendCache` 为 `false` 时，编辑器**创建**/**重载**时显示内容的优先级为：`defaultContent` > `defaultHtml` > `v-model:json`/`v-model:json.string` > `v-model:html`。

> `false` 模式下可能会造成数据的丢失，因此在编辑器重载前一定要做好数据的保存工作，我们可以配合 `reload` 事件来进行数据的保存。

### defaultContent 和 defaultHtml

`defaultContent`/`defaultHtml` 的变更默认情况下是不会触发编辑器的重载的。在编辑器已创建的情况下，如果需要将 `defaultContent`/`defaultHtml` 内容直接显示出来，我们需要通过 [reloadEditor](./use-wang-editor.md#reloadeditor) API 来强制重载编辑器。并且我们需要注意 `extendCache` 对编辑器创建时默认内容的影响。

> `defaultContent` 和 `defaultHtml` 不建议同时使用。如果需要切换使用，可以一个赋值为 `null` 另一个赋值真正的值。如：你需要从 `defaultContent` 切换到 `defaultHtml`，可以先赋值 `defaultContent = null`，然后再赋值 `defaultHtml = '<h1>标题一</h1><p>段落</p>'` 即可。

```ts
const { opts, reloadEditor } = useWangEditor()

onMounted(() => {
  setTimeout(() => {
    // 当你进行了 v-model:json/v-model:json.string/v-model:html 绑定时，
    // 如果你想在编辑器重载后将 defaultContent 显示为编辑器的默认内容，
    // 那么你需要设置 extendCache 为 false，这会导致编辑器内容的丢失，
    // 可以合理搭配 reload 事件进行处理
    opts.editable.extendCache = false

    // 然后再修改配置
    opts.editable.defaultContent = [{ type: 'header1', children: [{ text: '标题一' }] }]

    // 同时还支持字符串形式的 JSON
    opts.editable.defaultContent = '[{"type":"header1","children":[{"text":"标题一"}]}]'

    // or：配置 HTML 字符串
    opts.editable.defaultHtml = '<h1>标题一</h1><p>段落</p>'

    // 最后，你还需要强制重载编辑器
    reloadEditor()
  }, 5000)
})
```

### config

这是编辑器的具体配置，详细的配置项以 `wangEditor v5` 官方文档为准（认准文档中的 `editorConfig` 关键字）。[前往查看](https://www.wangeditor.com/v5/editor-config.html)。

### delay

由于内部为了节约资源，对 v-model 进行了防抖处理，此参数为防抖时间的配置项。当 `delay` 的值大于零时才具有防抖效果，否则内容一切变化都将同步给 `v-model`。支持动态配置。

当 `delay > 0` 时，我们可以使用 [`syncContent`](./use-wang-editor.md#synccontent) 来强制同步 `v-model` 数据，避免数据不一致。

## Volar

如果您使用 `Volar`，请在 `tsconfig.json` 中通过 `compilerOptions.type` 指定全局组件类型。

```json
{
  "compilerOptions": {
    "types": ["wangeditor5-for-vue3/global"]
  }
}
```
