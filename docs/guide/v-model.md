# 双向绑定

`EditorEditable` 组件同时支持 `v-model`、`v-model:json` 和 `v-model:html` 三种形式的双向绑定，分别对应 `json array`、`json string` 和 `html string` 三种格式的数据。

**注意事项：**

- 注意 `EditorEditableOption.extendCache` 可能存在的影响！！！
- 不推荐只进行 `v-model:html` 绑定，有无法避免的缺陷！！！
- 当我们进行 `v-model` 绑定时，推荐使用 `shallowReactive`/`shallowRef` 来缓存 `json array` 数据。如果你执意使用 `reactive`/`ref` 进行数据缓存，那么在出现未知错误时你可能找不到问题所在。

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
