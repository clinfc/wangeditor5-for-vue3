# useWangEditor

初始化一个菜单栏与编辑区相关联的配置项。

```ts
declare function useWangEditor(
  option?: Partial<WeOptions<false>> | null,
  formField?: WeFormFieldInit
): {
  opts: WeOptions
  instance: WeInstance
  handle: InjectionKey<WeInjectContent>
  clearContent: () => void
  syncContent: () => void
  reloadEditor: () => void
}
```

## opts

具有响应式特性的编辑器配置项，可直接修改配置项去动态配置编辑器。

```ts
const { opts } = useWangEditor()

// 设置编辑器的菜单栏模式
opts.toolbar.mode = 'simple'

// 修改编辑器的编辑区模式
opts.editable.mode = 'simple'
```

### 会触发重载的配置项

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

> `WeEditableOption` 的其它配置项虽不会触发重载，但是支持动态配置。

## instance

菜单栏和编辑区的实例。

```ts
import { Toolbar, IDomEditor } from '@wangeditor/editor'

declare type WeInstance = {
  /**
   * 菜单栏实例
   */
  toolbar: Toolbar | null
  /**
   * 编辑区实例
   */
  editable: IDomEditor | null
}
```

## handle

`provide`/`inject` 句柄，`WeToolbar` 和 `WeEditable` 组件内部将通过此句柄拿取配置进行初始化，这也是 `WeToolbar` 与 `WeEditable` 进行关联的唯一凭证。

## clearContent

清除编辑器内容并同步 `v-model:json/v-model:html` 数据。

```ts
const { clearContent } = useWangEditor()

clearContent()
```

## syncContent

由于组件内部对 `v-model` 的数据更新做了防抖处理（防抖时长由 `WeEditableOption.delay` 控制）。当 `delay` 的数值稍大，我们在输入内容后快速点击提交表单，那么此时 `v-model` 的数据将不是最新的，这将得不偿失。因此我们可以在表单提交前执行 `syncContent` 来强制更新 `v-model` 数据，防止数据丢失。

以 `element-plus` 为例，在调用 `ElForm.validate` 方法前执行 `syncContent` 方法，即可避免数据丢失。

```vue
<template>
  <el-form ref="ruleForm" label-position="top" :model="formData" :rules="formRule">
    <el-form-item label="文章" prop="json">
      <we-editor :handle="handle" v-model:json.string="formData.json" v-model:html="formData.html" />
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
      const ruleForm = ref()

      const formData = reactive({ json: '', html: '' })

      const formRule = {
        json: [{ required: true, message: '内容不能为空', trigger: 'change' }]
      }

      const { handle, syncContent } = useWangEditor({
        editable: {
          delay: 5000,
          config: {
            placeholder: '无操作 5s 后才会同步表单数据，表单提交前使用 syncContent API 强制同步数据，确保数据不被丢失'
          }
        }
      })

      // 表单提交
      function submit() {
        syncContent()
        ruleForm.value.validate((valid) => {
          console.log({ valid, ...formData })
        })
      }

      return { ruleForm, formData, formRule, handle, submit }
    }
  })
</script>
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```vue
<script lang="ts">
  import { FormInstance, FormRules } from 'element-plus'
  import { defineComponent, reactive, Ref, ref } from 'vue'
  import { useWangEditor } from 'wangeditor5-for-vue3'

  export default defineComponent({
    setup() {
      const ruleForm = ref<any>() as Ref<FormInstance>

      const formData = reactive({ json: '', html: '' })

      const formRule: FormRules = {
        json: [{ required: true, message: '内容不能为空', trigger: 'change' }]
      }

      const { handle, syncContent } = useWangEditor({
        editable: {
          delay: 5000,
          config: {
            placeholder: '无操作 5s 后才会同步表单数据，表单提交前使用 syncContent API 强制同步数据，确保数据不被丢失'
          }
        }
      })

      // 表单提交
      function submit() {
        syncContent()
        ruleForm.value.validate((valid) => {
          console.log({ valid, ...formData })
        })
      }

      return { ruleForm, formData, formRule, handle, submit }
    }
  })
</script>
```

  </CodeGroupItem>
</CodeGroup>

## reloadEditor

重载编辑器（销毁并重新创建）。

> 重载分为编辑器重载和菜单栏重载，编辑器重载会自动触发菜单栏重载，而菜单栏重载却不会触发编辑器重载。

```ts
const { reloadEditor } = useWangEditor()

// 强制重载编辑器
reloadEditor()
```
