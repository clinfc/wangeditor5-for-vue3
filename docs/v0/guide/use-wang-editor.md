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
  syncContent: () => void
  reloadEditor: () => void
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

不仅会清除编辑器内容，还会同步 `v-model/v-model:json/v-model:html` 数据。

```ts
const { clearContent } = useWangEditor()

clearContent()
```

### syncContent

> `v0.0.7+` 新增

由于组件内部对 `v-model` 的数据更新做了防抖处理（防抖时长由 `WeEditableOption.delay` 控制）。当 `delay` 的数值稍大，我们在输入内容后快速点击提交表单，那么此时 `v-model` 的数据将不是最新的，这将得不偿失。因此我们可以在表单提交前执行 `syncContent` 来解除 `WeEditableOption.delay` 的副作用，强制更新 `v-model` 数据，即可防止数据丢失。

以 `element-plus` 为例，在调用 `ElForm.validate` 方法前执行 `syncContent` 方法，即可避免数据丢失。

```vue
<template>
  <el-form ref="ruleForm" :model="formData" :rules="formRule">
    <el-form-item label="文章" prop="json">
      <we-editor :toolbar-option="toolbar" :editable-option="editable" v-model:json="formData.json" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交表单</el-button>
    </el-form-item>
  </el-form>
</template>
```

<CodeGroup>
  <CodeGroupItem title="JS">

```vue
<script>
  import { defineComponent, reactive, Ref, ref } from 'vue'
  import { useWangEditor } from 'wangeditor5-for-vue3'

  export default defineComponent({
    setup() {
      const ruleForm = ref(null)

      const formData = reactive({ json: '' })

      const formRule = {
        json: [{ required: true, message: '内容不能为空', trigger: 'change' }],
      }

      const { editable, toolbar, syncContent } = useWangEditor({
        delay: 5000, // 无操作 5s 后才会同步表单数据
        config: {
          placeholder: '表单提交前使用 syncContent API 强制同步数据，确保数据不被丢失',
        },
      })

      // 表单提交
      function submit() {
        // 强制同步 v-model 数据
        syncContent()

        // 表单验证
        ruleForm.value.validate((valid) => {
          if (!valid) return
          console.log({ ...formData })
        })
      }

      return { ruleForm, formData, formRule, editable, toolbar, submit }
    },
  })
</script>
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```vue
<script lang="ts">
  import { SlateDescendant } from '@wangeditor/editor'
  import { FormInstance, FormRules } from 'element-plus'
  import { defineComponent, reactive, Ref, ref } from 'vue'
  import { useWangEditor } from 'wangeditor5-for-vue3'

  export default defineComponent({
    setup() {
      const ruleForm = ref<any>(null) as Ref<FormInstance>

      const formData = reactive({ json: '' as SlateDescendant[] })

      const formRule: FormRules = {
        json: [{ required: true, message: '内容不能为空', trigger: 'change' }],
      }

      const { editable, toolbar, syncContent } = useWangEditor({
        delay: 5000, // 无操作 5s 后才会同步表单数据
        config: {
          placeholder: '表单提交前使用 syncContent API 强制同步数据，确保数据不被丢失',
        },
      })

      // 表单提交
      function submit() {
        // 强制同步 v-model 数据
        syncContent()

        // 表单验证
        ruleForm.value.validate((valid) => {
          if (!valid) return
          console.log({ ...formData })
        })
      }

      return { ruleForm, formData, formRule, editable, toolbar, submit }
    },
  })
</script>
```

  </CodeGroupItem>
</CodeGroup>

### getToolbar

获取菜单栏实例

#### 同步模式

当我们不传入参数或传入的不是一个数字时，此时为同步模式。

<CodeGroup>
  <CodeGroupItem title="JS">

```ts
const { getToolbar } = useWangEditor()

const toolbarInstance = getToolbar()
if (toolbarInstance) {
  // do somthing
} else {
  // do somthing
}
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```ts
const { getToolbar } = useWangEditor()

const toolbarInstance: Toolbar | undefined = getToolbar()
if (toolbarInstance) {
  // do somthing
} else {
  // do somthing
}
```

  </CodeGroupItem>
</CodeGroup>

#### 异步模式

> `v0.0.5+` 新增

当我们传入一个数字时，传入的是异步超时时间。单位：毫秒。

<CodeGroup>
  <CodeGroupItem title="JS">

```ts
const { getToolbar } = useWangEditor()

getToolbar(3000)
  .then((toolbarInstance) => {
    // do somthing
  })
  .catch((error) => {
    // do somthing
  })
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```ts
const { getToolbar } = useWangEditor()

getToolbar(3000)
  .then((toolbarInstance: Toolbar) => {
    // do somthing
  })
  .catch((error: Error) => {
    // do somthing
  })
```

  </CodeGroupItem>
</CodeGroup>

### getEditable

获取编辑器实例

#### 同步模式

当我们不传入参数或传入的不是一个数字时，此时为同步模式。

<CodeGroup>
  <CodeGroupItem title="JS">

```js
const { getEditable } = useWangEditor()

const editableInstance = getEditable()
if (editableInstance) {
  console.log(editableInstance.children)
} else {
  console.error('编辑器未实例化')
}
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```ts
const { getEditable } = useWangEditor()

const editableInstance: IDomEditor | undefined = getEditable()
if (editableInstance) {
  console.log(editableInstance.children)
} else {
  console.error('编辑器未实例化')
}
```

  </CodeGroupItem>
</CodeGroup>

#### 异步模式

> `v0.0.5+` 新增

当我们传入一个数字时，传入的是异步超时时间。单位：毫秒。

<CodeGroup>
  <CodeGroupItem title="JS">

```js
const { getEditable } = useWangEditor()

getEditable(3000)
  .then((editableInstance) => {
    // do somthing
  })
  .catch((error) => {
    // do somthing
  })
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```ts
const { getEditable } = useWangEditor()

getEditable(3000)
  .then((editableInstance: IDomEditor) => {
    // do somthing
  })
  .catch((error: Error) => {
    // do somthing
  })
```

  </CodeGroupItem>
</CodeGroup>

### reloadEditor

重载编辑器（销毁并重新创建）。

> 重载分为编辑器重载和菜单栏重载，编辑器重载会自动触发菜单栏重载，而菜单栏重载却不会触发编辑器重载。

```ts
const { reloadEditor } = useWangEditor()

// 强制重载编辑器
reloadEditor()
```

## 会触发重载的配置项

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
