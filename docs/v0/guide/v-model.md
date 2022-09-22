# 双向绑定

`WeEditable`/`WeEditor`/`WeEditorPlus` 组件同时支持 `v-model`、`v-model:json` 和 `v-model:html` 三种形式的双向绑定，分别对应 `json array`、`json string` 和 `html string` 三种格式的数据。

**注意事项：**

- 注意 `WeEditableOption.extendCache` 可能存在的影响！！！
- 当我们进行 `v-model` 绑定时，推荐使用 `shallowReactive`/`shallowRef` 来缓存 `json array` 数据。如果你执意使用 `reactive`/`ref` 进行数据缓存，那么在出现未知错误时你可能找不到问题所在。
- 在提交表单前，或手动触发表单验证前，请使用 [`syncContent`](./use-wang-editor.md#synccontent) 来强制同步 `v-model` 数据，避免数据不一致。
- 双向绑定多个同时使用时，存在 `v-model` > `v-model:json` > `v-model:html` 的优先级关系。即：如果你使用优先级低的来设置数据的话，设置将被拦截（设置无效）。

> 最优搭配为 `v-html:json` 或 `v-model:json` + `v-model:html`。`v-model:json` 相对 `v-model` 而言，能减少大量内存消耗和计算消耗。

```vue
<template>
  <we-editable :option="editable" v-model="formData.json" v-model:json="formData.jstr" v-model:html="formData.html" />
</template>
```

<CodeGroup>
  <CodeGroupItem title="JS">

```vue
<script>
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowReactive } from 'vue'

  export default defineComponent({
    setup() {
      const { editable } = useWangEditor()

      const formData = shallowReactive({
        json: [],
        jstr: '',
        html: '',
      })

      return { editable, formData }
    },
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
      const { editable } = useWangEditor()

      const formData = shallowReactive({
        json: [] as SlateDescendant[],
        jstr: '',
        html: '',
      })

      return { editable, formData }
    },
  })
</script>
```

  </CodeGroupItem>
</CodeGroup>

或

```html
<template>
  <we-editable :option="editable" v-model="json" v-model:json="jstr" v-model:html="html" />
</template>
```

<CodeGroup>
  <CodeGroupItem title="JS">

```vue
<script>
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowRef } from 'vue'

  export default defineComponent({
    setup() {
      const { editable } = useWangEditor()

      const json = shallowRef([])

      const jstr = ref('')

      const html = ref('')

      return { editable, json, jstr, html }
    },
  })
</script>
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```vue
<script lang="ts">
  import { SlateDescendant } from '@wangeditor/editor'
  import { useWangEditor } from 'wangeditor5-for-vue3'
  import { defineComponent, shallowRef } from 'vue'

  export default defineComponent({
    setup() {
      const { editable } = useWangEditor()

      const json = shallowRef<SlateDescendant[]>([])

      const jstr = ref('')

      const html = ref('')

      return { editable, json, jstr, html }
    },
  })
</script>
```

  </CodeGroupItem>
</CodeGroup>
