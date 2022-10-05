# 双向绑定

`WeEditable`/`WeEditor` 组件同时支持 `v-model:json`、`v-model:json.string` 和 `v-model:html` 三种形式的双向绑定，分别对应 `json array`、`json string` 和 `html string` 三种格式的数据。

**注意事项：**

- 注意 [WeEditableOption.extendCache](./typescript.md#extendcache) 可能存在的影响！！！
- 当我们进行 `v-model` 绑定时，推荐使用 `shallowReactive`/`shallowRef` 来缓存 `json array` 数据。如果你执意使用 `reactive`/`ref` 进行数据缓存，那么在出现未知错误时你可能找不到问题所在。
- 在提交表单前，或手动触发表单验证前，请使用 [syncContent](./use-wang-editor.md#synccontent) 来强制同步 `v-model` 数据，避免数据丢失。
- `JSON` 与 `HTML` 双向绑定同时使用时，存在 `v-model:json`/`v-model:json.string` > `v-model:html` 的优先级关系。即：如果你使用优先级低的来设置数据的话，设置将被拦截（设置无效）。

<CodeGroup>
  <CodeGroupItem title="JSON Array" active>

```vue
<template>
  <we-editor :handle="handle" v-model:json="formData.json" />
</template>
```

  </CodeGroupItem>

  <CodeGroupItem title="JSON String">

```vue
<template>
  <we-editor :handle="handle" v-model:json.string="formData.jstr" />
</template>
```

  </CodeGroupItem>

  <CodeGroupItem title="HTML String">

```vue
<template>
  <we-editor :handle="handle" v-model:html="formData.html" />
</template>
```

  </CodeGroupItem>
</CodeGroup>

<CodeGroup>
  <CodeGroupItem title="JS">

```vue
<script>
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    setup() {
      const { handle } = useWangEditor()

      const formData = shallowReactive({
        json: [],
        jstr: '',
        html: ''
      })

      return { handle, formData }
    }
  })
</script>
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```vue
<script lang="ts">
  import { SlateDescendant } from '@wangeditor/editor'
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    setup() {
      const { handle } = useWangEditor()

      const formData = shallowReactive({
        json: [] as SlateDescendant[],
        jstr: '',
        html: ''
      })

      return { handle, formData }
    }
  })
</script>
```

  </CodeGroupItem>
</CodeGroup>
