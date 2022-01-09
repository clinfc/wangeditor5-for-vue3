# [wangEditor5](https://www.wangeditor.com/v5/) for [vue3](https://v3.cn.vuejs.org/)

当前并未发布 `npm` 包，如果要使用此插件直接拿取 [`src/wangeditor.ts`](./src/wangeditor.ts) 或 [`dist/wangeditor.js`](./dist/wangeditor.js) 文件放在自己项目中即可。

> 如果你是 `TypeScript` 用户，你可能需要执行 `npm i -D @types/lodash.debounce` 进行 `lodash.debounce` 库的声明文件安装才不会报错。但是无需安装 `lodash.debounce` 库，因为 `@wangeditor/editor` 本身就依赖该库。_此组件不支持直接在浏览器环境使用，只支持 `webpack/rollup/vite` 等构建环境下使用！_

功能点：

- 支持动态配置编辑器参数（编辑器创建后修改配置项仍生效）
- 支持 `v-model`、`v-model:json` 和 `v-model:html` 三种形式的双向绑定，分别对应 `json array`、`json string` 和 `html string` 三种形式的数据
- 支持动态配置默认内容而不会存在旧文档的历史记录
- 默认内容的配置项支持 `json array`、`json string` 和 `html string` 三种格式的数据

## 运行 example

`example` 文件放在 [example/src/view](./example/src/view/) 目录下

```sh
git clone https://github.com/clinfc/wangeditor5-for-vue3.git

cd example

npm install

npm run dev
```

## 二次开发

先运行以下命令，然后修改 `src/wangeditor.ts` 文件内容即可边开发边调试

```sh
git clone https://github.com/clinfc/wangeditor5-for-vue3.git

// 分别在 `./` 目录和 `./example` 目录下执行
npm install

// 终端一。在 `./` 目录下执行
npm run dev

// 终端二。在 `./` 目录下执行
npm run example
```

## 组件注册

此组件默认提供了全局注册的函数，可以直接进行注册使用

```ts
import { createApp } from 'vue'
// 从你自己存放 wangeditor.ts 文件的路径下引入
import wangeditor from 'xxx/wangeditor.ts'

// 全局注册 EditorToolbar, EditorEditable 两个组件
createApp(App).use(wangeditor).mount('#app')
```

你也可以局部进行组件注册

```ts
import { defineComponent } from 'vue'
import { EditorEditable, EditorToolbar } from 'xxx/wangeditor.ts'

export default defineComponent({
  components: { EditorEditable, EditorToolbar },
})
```

## 快速开始

```html
<style lang="scss">
  .border {
    border: 1px solid #ddd;
  }
</style>

<template>
  <editor-toolbar class="border" :option="toolbar" @reloadbefore="onToolbarReloadBefore" />
  <editor-editable
    class="border"
    :option="editable"
    v-model="formData.jarr"
    v-model:json="formData.jstr"
    v-model:html="formData.html"
    @reloadbefore="onEditableReloadBefore"
  />
</template>

<script lang="ts">
  import { Descendant } from 'slate'
  import {
    EditorEditable,
    EditorEditableOption,
    EditorToolbar,
    EditorToolbarOption,
    useWangEditor,
  } from 'xxx/wangeditor.ts'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    components: { EditorToolbar, EditorEditable },
    setup() {
      // 编辑器配置
      const editableOption: EditorEditableOption = {}

      // 菜单栏配置
      const toolbarOption: EditorToolbarOption = {}

      // 防抖时长。当会触发重载的配置项发生变化 365ms 后，编辑器会重载
      const reloadDelary = 365

      const { editable, toolbar, getEditable, getToolbar, clearContent, reloadEditor } = useWangEditor(
        editableOption,
        toolbarOption,
        reloadDelary
      )

      // 开启只读模式
      editable.config.readOnly = true

      // 不要使用 reactive/ref，应该使用 shallowReactive/shallowRef 来接收 json array 数据
      const formData = shallowReactive({
        jarr: [] as Descendant[],
        jstr: '',
        html: '',
      })

      function onEditableReloadBefore(inst: IDomEditor) {
        console.log('editable 即将重载: ' + new Date().toLocaleString())
      }

      function onToolbarReloadBefore(inst: Toolbar) {
        console.log('toolbar 即将重载: ' + new Date().toLocaleString())
      }

      return { editable, toolbar, formData, onEditableReloadBefore, onToolbarReloadBefore }
    },
  })
</script>
```

## useWangEditor

经过 `useWangEditor` 处理后，返回的 `editable` 和 `toolbar` 分别对应**编辑器**和**菜单栏**的配置项，不过此时的配置项对象具备了响应式特性，我们可以直接修改 `editable`/`toolbar` 对应属性来**更新**或**重载**编辑器。

如果传入的 `editableOption` 和 `toolbarOption` 是响应式数据，内部将自动解除与之前的关联，也就意味着经过 `useWangEditor` 处理后得到的 `editable` 和 `toolbar` 配置对象，即使内容发生变化也不会触发之前的依赖更新！！！

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
  /** v-model/v-model:html 数据同步的防抖时长，默认值：3650，单位：毫秒 */
  delay?: number
  /**
   * 编辑器创建时默认内容的优先级排序，默认值：true。
   * true：v-model > v-model:json > v-model:html > defaultContent。
   * false: defaultContent > v-model > v-model:json > v-model:html。
   */
  extendCache?: boolean
}
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

### EditorEditableOption.extendCache

当 `v-model`/`v-model:json`/`v-model:html` 与 `defaultContent` 同时使用的时候，我们可以使用 `extendCache` 配置项来控制重载后编辑器的默认内容。

当 `EditorEditableOption.extendCahce` 为 `true` 时，编辑器**创建**/**重载**时显示内容的优先级为：`v-model` > `v-model:json` > `v-model:html` > `defaultContent`。

当 `EditorEditableOption.extendCache` 为 `false` 时，编辑器**创建**/**重载**时显示内容的优先级为：`defaultContent` > `v-model` > `v-model:json` > `v-model:html`。`false` 模式下可能会造成数据的丢失，因此在编辑器重载前一定要做好数据的保存工作，我们可以配合 `reloadbefore` 事件来进行数据的保存。

### EditorEditableOption.defaultContent

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

## 动态修改配置

```ts
const { editable, toolbar } = useWangEditor()

editable.config.placeholder = '新的 placeholder'

// 切换为只读模式
editable.config.readOnly = true

toolbar.mode = 'simple'
```

## reloadEditor：重载编辑器和菜单栏

`EditorEditableOption.mode`、`EditorEditableOption.config.hoverbarKeys`、`EditorEditableOption.config.maxLength`、`EditorEditableOption.config.customPaste` 这几个配置项的变更会触发编辑器的重载，其它的 `EditorEditableOption` 配置项仅支持动态配置，但并不会触发重载，这能避免不必要的资源消耗。如果你需要强制重载编辑器，还提供了 `reloadEditor` API 来供使用者手动触发。

和 `EditorEditableOption` 不同的是，`EditorToolbarOption` 的的任意选项发生变化，都会触发菜单栏的重载。

```ts
const { reloadEditor } = useWangEditor()

// 强制重载编辑器
reloadEditor()
```

### reloadbefore：重载前事件

在编辑器重载之前，会触发 `reloadbefore` 事件。

```html
<template>
  <editor-toolbar :option="toolbar" @reloadbefore="onToolbarReloadBefore" />
  <editor-editable v-model="formData.json" :option="editable" @reloadbefore="onEditableReloadBefore" />
</template>

<script lang="ts">
  import axios from 'axiios'
  import { Descendant } from 'slate'
  import { EditorEditable, EditorToolbar, useWangEditor } from 'xxx/wangeditor.ts'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    components: { EditorToolbar, EditorEditable },
    setup() {
      const { editable, toolbar, reloadEditor } = useWangEditor()

      const formData = shallowReactive({
        json: [] as Descendant[],
      })

      function onEditableReloadBefore(inst: IDomEditor) {
        window.alert('editable 即将重载')
        console.log('editable 即将重载: ' + new Date().toLocaleString())
        // 提交数据
        axios.post('xxx/xxx', formData)
      }

      function onToolbarReloadBefore(inst: Toolbar) {
        window.alert('toolbar 即将重载')
        console.log('toolbar 即将重载: ' + new Date().toLocaleString())
      }

      return { editable, toolbar, formData, onEditableReloadBefore, onToolbarReloadBefore }
    },
  })
</script>
```

## clearContent：清除内容

不仅会清除编辑器内容，还会同步 `v-model/v-model:html` 数据

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

## getToolbar：获取菜单栏实例

```ts
const { getToolbar } = useWangEditor()

const toolbarInstance: Toolbar | undefined = getToolbar()
if (toolbarInstance) {
  // do somthing
} else {
  // do somthing
}
```

## getEditable：获取编辑器实例

```ts
const { getEditable } = useWangEditor()

const editableInstance: IDomEditor | undefined = getEditable()
if (editableInstance) {
  console.log(editableInstance.children)
} else {
  console.error('编辑器未实例化')
}
```

## v-model、v-model:json、v-model:html

`EditorEditable` 组件同时支持 `v-model`、`v-model:json` 和 `v-model:html` 三种形式的双向绑定，分别对应 `json array`、`json string` 和 `html string` 三种格式的数据。不过我们需要注意 **`EditorEditableOption.extendCache`** 可能存在的影响！！！

不推荐只进行 `v-model:html` 绑定，有无法避免的缺陷！！！

当我们进行 `v-model` 绑定时，推荐使用 `shallowReactive`/`shallowRef` 来缓存 `json array` 数据。如果你执意使用 `reactive`/`ref` 进行数据缓存，那么在出现未知错误时你可能找不到问题所在。**重要！重要！！重要！！！**

> 最优搭配为 `v-html:json` 或 `v-model:json` + `v-model:html`。`v-model:json` 相对 `v-model` 而言，能减少大量内存消耗和计算消耗。

```html
<template>
  <editor-editable
    :option="editable"
    v-model="formData.json"
    v-model:json="formData.jstr"
    v-model:html="formData.html"
  />
</template>

<script lang="ts">
  import { Descendant } from 'slate'
  import { useWangEditor } from 'xxx/wangeditor.ts'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    setup() {
      const { editable } = useWangEditor()

      const formData = shallowReactive({
        json: [] as Descendant[],
        jstr: '',
        html: '',
      })

      return { editable, formData }
    },
  })
</script>
```

或

```html
<template>
  <editor-editable :option="editable" v-model="jsonArray" v-model:json="jsonString" v-model:html="htmlString" />
</template>

<script lang="ts">
  import { Descendant } from 'slate'
  import { useWangEditor } from 'xxx/wangeditor.ts'
  import { defineComponent, shallowRef } from 'vue'

  export default defineComponent({
    setup() {
      const { editable } = useWangEditor()

      const jsonArray = shallowRef<Descendant[]>([])

      const jsonString = ref('')

      const htmlString = ref('')

      return { editable, jsonArray, jsonString, htmlString }
    },
  })
</script>
```

> **好用不迷路，不妨给作者一个 `star` 打打气**
