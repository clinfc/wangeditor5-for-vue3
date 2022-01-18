# useWangEditor

经过 `useWangEditor` 处理后，返回的 `editable` 和 `toolbar` 分别对应**编辑器**和**菜单栏**的配置项，不过此时的配置项对象具备了响应式特性，我们可以直接修改 `editable`/`toolbar` 对应属性来**更新**或**重载**编辑器。

如果传入的 `editableOption` 和 `toolbarOption` 是响应式数据，内部将自动解除与之前的关联，也就意味着经过 `useWangEditor` 处理后得到的 `editable` 和 `toolbar` 配置对象，即使内容发生变化也不会触发之前的依赖更新！！！

## useWangEditor 的类型

```ts
/**
 * vue hook，用于实现编辑器配置项的动态绑定
 * @param {Object} editableOption 编辑器主体部分的配置
 * @param {Object} toolbarOption 菜单栏配置
 * @param {Number} reloadDelay 防抖时长，用于重载的延迟控制，单位：毫秒
 */
declare function useWangEditor(
  editableOption: EditorEditableOption | null = null,
  toolbarOption: EditorToolbarOption | null = null,
  reloadDelay: number = 365
): {
  editable: Required<EditorEditableOption>
  toolbar: Required<EditorToolbarOption>
  getEditable: () => IDomEditor | undefined
  getToolbar: () => Toolbar | undefined
  clearContent: () => void
  reloadEditor: () => void
}
```

### EditorEditableOption

```ts
/**
 * 编辑器配置项
 */
interface EditorEditableOption {
  /** 编辑器模式 */
  mode?: 'default' | 'simple'
  /** 编辑器初始化的默认内容 */
  defaultContent?: Descendant[] | string | null
  /** 编辑器配置，具体配置以官方为准 */
  config?: Partial<IEditorConfig>
  /** v-model/v-model:json/v-model:html 数据同步的防抖时长，默认值：3650，单位：毫秒 */
  delay?: number
  /**
   * 编辑器创建时默认内容的优先级排序，默认值：true。
   * true：v-model > v-model:json > v-model:html > defaultContent。
   * false: defaultContent > v-model > v-model:json > v-model:html。
   */
  extendCache?: boolean
}
```

#### EditorEditableOption.extendCache

当 `v-model`/`v-model:json`/`v-model:html` 与 `defaultContent` 同时使用的时候，我们可以使用 `extendCache` 配置项来控制重载后编辑器的默认内容。

当 `EditorEditableOption.extendCahce` 为 `true` 时，编辑器**创建**/**重载**时显示内容的优先级为：`v-model` > `v-model:json` > `v-model:html` > `defaultContent`。

当 `EditorEditableOption.extendCache` 为 `false` 时，编辑器**创建**/**重载**时显示内容的优先级为：`defaultContent` > `v-model` > `v-model:json` > `v-model:html`。`false` 模式下可能会造成数据的丢失，因此在编辑器重载前一定要做好数据的保存工作，我们可以配合 `reloadbefore` 事件来进行数据的保存。

#### EditorEditableOption.defaultContent

`EditorEditableOption.defaultContent` 的变更默认情况下是不会触发编辑器的重载的，如果需要将 `EditorEditableOption.defaultContent` 内容直接显示出来，我们需要通过 `reloadEditor` 来强制重载编辑器。并且我们需要注意 `EditorEditableOption.extendCache` 对重载后编辑器默认内容的影响。

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
    editable. = [{ type: 'header1', children: [{ text: '标题一' }] }]

    // 同时还支持字符串形式的 JSON
    editable.defaultContent = '[{"type":"header1","children":[{"text":"标题一"}]}]'

    // 针对 HTML 字符串也做了兼容（不推荐使用，有缺陷）
    editable.defaultContent = '<h1>标题一</h1><p>段落</p>'

    // 最后，你还需要强制重载编辑器
    reloadEditor()
  }, 5000)
})
```

### EditorToolbarOption

```ts
/**
 * 菜单栏的配置项
 */
interface EditorToolbarOption {
  mode?: 'default' | 'simple'
  config?: Partial<IToolbarConfig>
}
```

## 动态修改配置

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

受 `@wangeditor/editor` 内部限制，`EditorEditableOption.config.readOnly` 为 `true` 时，执行 `clearContent()` 是无法清除内容的。
如果你仍希望进行编辑器内容清除，可以考虑使用 `reloadEditor()` 搭配 `EditorEditableOption.defaultContent` 进行实现。

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

### getToolbar

获取菜单栏实例

```ts
const { getToolbar } = useWangEditor()

const toolbarInstance: Toolbar | undefined = getToolbar()
if (toolbarInstance) {
  // do somthing
} else {
  // do somthing
}
```

### getEditable

获取编辑器实例

```ts
const { getEditable } = useWangEditor()

const editableInstance: IDomEditor | undefined = getEditable()
if (editableInstance) {
  console.log(editableInstance.children)
} else {
  console.error('编辑器未实例化')
}
```

### reloadEditor

重载编辑器和菜单栏

`EditorEditableOption.mode`、`EditorEditableOption.config.hoverbarKeys`、`EditorEditableOption.config.maxLength`、`EditorEditableOption.config.customPaste` 这几个配置项的变更会触发编辑器的重载，其它的 `EditorEditableOption` 配置项仅支持动态配置，但并不会触发重载，这能避免不必要的资源消耗。如果你需要强制重载编辑器，还提供了 `reloadEditor` API 来供使用者手动触发。

和 `EditorEditableOption` 不同的是，`EditorToolbarOption` 的的任意选项发生变化，都会触发菜单栏的重载。

```ts
const { reloadEditor } = useWangEditor()

// 强制重载编辑器
reloadEditor()
```
