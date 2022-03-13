# useWangEditor

经过 `useWangEditor` 处理后，返回的 `editable` 和 `toolbar` 分别对应**编辑器**和**菜单栏**的配置项，不过此时的配置项对象具备了响应式特性，我们可以直接修改 `editable`/`toolbar` 对应属性来**更新**或**重载**编辑器。

如果传入的 `editableOption` 和 `toolbarOption` 是响应式数据，内部将自动解除与之前的关联，也就意味着经过 `useWangEditor` 处理后得到的 `editable` 和 `toolbar` 配置对象，即使内容发生变化也不会触发之前的依赖更新！！！

## useWangEditor 的类型

```ts
/**
 * vue hook，用于实现编辑器配置项的动态绑定
 * @param {Object} editableOption 编辑器主体部分的配置
 * @param {Object} toolbarOption 菜单栏配置
 * @param {Number} reloadDelay 防抖时长，用于重载的延迟控制，默认值：500，单位：毫秒
 */
declare function useWangEditor(
  editableOption: WeEditableOption | null = null,
  toolbarOption: WeToolbarOption | null = null,
  reloadDelay: number
): {
  editable: Required<WeEditableOption>
  toolbar: Required<WeToolbarOption>
  getEditable: {
    (): IDomEditor | undefined
    (timeout: number): Promise<IDomEditor>
  }
  getToolbar: {
    (): Toolbar | undefined
    (timeout: number): Promise<Toolbar>
  }
  clearContent: () => void
  reloadEditor: () => void
}
```

## WeEditableOption

```ts
import { IEditorConfig, SlateDescendant } from '@wangeditor/editor'

/**
 * 编辑器配置项
 */
export interface WeEditableOption {
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
   * true：v-model > v-model:json > v-model:html > defaultContent > defaultHtml。
   * false: defaultContent > defaultHtml > v-model > v-model:json > v-model:html。
   */
  extendCache?: boolean
}
```

### WeEditableOption.extendCache

当 `v-model`/`v-model:json`/`v-model:html` 与 `WeEditableOption.defaultContent`/`WeEditableOption.defaultHtml` 同时使用的时候，我们可以使用 `WeEditableOption.extendCache` 配置项来控制重载后编辑器的默认内容。

当 `WeEditableOption.extendCahce` 为 `true` 时，编辑器**创建**/**重载**时显示内容的优先级为：`v-model` > `v-model:json` > `v-model:html` > `WeEditableOption.defaultContent` > `WeEditableOption.defaultHtml`。

当 `WeEditableOption.extendCache` 为 `false` 时，编辑器**创建**/**重载**时显示内容的优先级为：`WeEditableOption.defaultContent` > `WeEditableOption.defaultHtml` > `v-model` > `v-model:json` > `v-model:html`。

> `false` 模式下可能会造成数据的丢失，因此在编辑器重载前一定要做好数据的保存工作，我们可以配合 `reloadbefore` 事件来进行数据的保存。

### 编辑器默认内容

`WeEditableOption.defaultContent`/`WeEditableOption.defaultHtml` 的变更默认情况下是不会触发编辑器的重载的。在编辑器已创建的情况下，如果需要将 `WeEditableOption.defaultContent`/`WeEditableOption.defaultHtml` 内容直接显示出来，我们需要通过 `reloadEditor` API 来强制重载编辑器。并且我们需要注意 `WeEditableOption.extendCache` 对编辑器创建时默认内容的影响。

> `defaultContent` 和 `defaultHtml` 不建议同时使用。如果需要切换使用，可以一个赋值为 null 另一个赋值真正的值。如：你需要从 `defaultContent` 切换到 `defaultHtml`，可以先赋值 `WeEditableOption.defaultContent = null`，然后再赋值 `WeEditableOption.defaultHtml = '<h1>标题一</h1><p>段落</p>'` 即可。

```ts
const { editable, toolbar, reloadEditor } = useWangEditor()

onMounted(() => {
  setTimeout(() => {
    // 当你进行了 v-model/v-model:json/v-model:html 绑定时，
    // 如果你想在编辑器重载后将 defaultContent 显示为编辑器的默认内容，
    // 那么你需要设置 extendCache 为 false，这会导致编辑器内容的丢失，
    // 可以合理搭配 reloadbefore 事件进行处理
    editable.extendCache = false

    // 然后再修改配置
    editable.defaultContent = [{ type: 'header1', children: [{ text: '标题一' }] }]

    // 同时还支持字符串形式的 JSON
    editable.defaultContent = '[{"type":"header1","children":[{"text":"标题一"}]}]'

    // or：配置 HTML 字符串
    editable.defaultHtml = '<h1>标题一</h1><p>段落</p>'

    // 最后，你还需要强制重载编辑器
    reloadEditor()
  }, 5000)
})
```

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

## 动态修改配置

修改 `editable` 或 `toolbar` 的属性即可。

```ts
const { editable, toolbar } = useWangEditor()

editable.config.placeholder = '新的 placeholder'

// 切换为只读模式
editable.config.readOnly = true

toolbar.mode = 'simple'
```

## API

### clearContent

不仅会清除编辑器内容，还会同步 `v-model/v-model:json/v-model:html` 数据

```ts
const { clearContent } = useWangEditor()

clearContent()
```

受 `@wangeditor/editor` 内部限制，`WeEditableOption.config.readOnly` 为 `true` 时，执行 `clearContent()` 是无法清除内容的。
如果你仍希望进行编辑器内容清除，可以考虑使用 `reloadEditor()` 搭配 `WeEditableOption.defaultContent`/`WeEditableOption.defaultHtml` 进行实现。

```ts
const { editable, reloadEditor } = useWangEditor({ config: { readOnly: true } })

function customClearContent() {
  // 如果使用了 v-model 进行双向绑定，一定要注意此配置项一定要设置为 false
  editable.extendCache = false

  editable.defaultContent = null
  reloadEditor()
}

customClearContent()
```

> **为什么不通过修改 v-model/v-model:json/v-model:html 来清空数据**：
>
> 不是每一个用户都对富文本数据格式了如指掌，也不是每个用户都能区分不同响应式 API 间的区别 _（本作者也不敢说自己每个响应式 API 都懂）_ ，总会出现千奇百怪的问题。

### getToolbar

获取菜单栏实例

#### 同步模式

当我们不传入参数或传入的不是一个数字时，此时为同步模式。

```ts
const { getToolbar } = useWangEditor()

const toolbarInstance: Toolbar | undefined = getToolbar()
if (toolbarInstance) {
  // do somthing
} else {
  // do somthing
}
```

#### 异步模式

当我们传入一个数字时，传入的是异步超时时间。单位：毫秒。

> `v0.0.5+` 新增

```ts
const { getToolbar } = useWangEditor()

getToolbar(3000)
  .then((inst: Toolbar) => {
    // do somthing
  })
  .catch((e: Error) => {
    // do somthing
  })
```

### getEditable

获取编辑器实例

#### 同步模式

当我们不传入参数或传入的不是一个数字时，此时为同步模式。

```ts
const { getEditable } = useWangEditor()

const editableInstance: IDomEditor | undefined = getEditable()
if (editableInstance) {
  console.log(editableInstance.children)
} else {
  console.error('编辑器未实例化')
}
```

#### 异步模式

当我们传入一个数字时，传入的是异步超时时间。单位：毫秒。

> `v0.0.5+` 新增

```ts
const { getEditable } = useWangEditor()

getEditable(3000)
  .then((inst: IDomEditor) => {
    // do somthing
  })
  .catch((e: Error) => {
    // do somthing
  })
```

### reloadEditor

重载编辑器（销毁并重新创建）。

> 重载分为编辑器重载和菜单栏重载，编辑器重载会自动触发菜单栏重载，而菜单栏重载却不会触发编辑器重载。

#### 会触发重载的配置项

- 菜单栏
  - `WeToolbarOption` 的所有属性
- 编辑器
  - `WeEditableOption.mode`
  - `WeEditableOption.config.customPaste`
  - `WeEditableOption.config.decorate`
  - `WeEditableOption.config.hoverbarKeys`
  - `WeEditableOption.config.maxLength`
  - `WeEditableOption.config.EXTEND_CONF`
  - `WeEditableOption.config.MENU_CONF`

> `WeEditableOption` 的其它配置项虽不会触发重载，但是支持动态配置

```ts
const { reloadEditor } = useWangEditor()

// 强制重载编辑器
reloadEditor()
```
