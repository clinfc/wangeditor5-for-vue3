# 快速开始

## 前言

> 此次更新是断崖式的，很多设计和实现都进行的重构，使用方式也有较大变化，请谨慎升级！！！

## 安装

<CodeGroup>
  <CodeGroupItem title="NPM" active>

```sh:no-line-numbers
npm install @wangeditor/editor wangeditor5-for-vue3
```

  </CodeGroupItem>

  <CodeGroupItem title="YARN">

```sh:no-line-numbers
yarn add @wangeditor/editor wangeditor5-for-vue3
```

  </CodeGroupItem>
</CodeGroup>

## 组件注册

### 全局注册

```ts
import '@wangeditor/editor/dist/css/style.css'
import { createApp } from 'vue'
import { createWeGlobalConfig, WeToolbar, WeEditable, WeEditor } from 'wangeditor5-for-vue3'
import { useFormItem } from 'element-plus' // v2.2.16

const app = createApp(App)

// 全局注册 WeToolbar, WeEditable，WeEditor 三个组件
app.use(WeToolbar)
app.use(WeEditable)
app.use(WeEditor)

// 注册全局配置
app.use(
  createWeGlobalConfig({
    // 组件的全局 attribute 配置
    attrs: {
      toolbar: {
        class: 'el-we-toolbar' // WeToolbar 根节点的 class attribute
      },
      editable: {
        class: 'el-we-editable' // WeEditable 根节点的 class attribute
      },
      editor: {
        class: 'el-we-editor' // WeEditor 根节点的 class attribute
      }
    },
    // 编辑器的全局公共配置
    opts: {
      editable: {
        config: {
          placeholder: '请输入'
        }
      }
    },
    // 表单验证逻辑的初始化函数
    formFieldInit() {
      const { formItem } = useFormItem()

      return {
        blur() {
          formItem?.validate('blur').catch(debugWarn)
        },
        change() {
          formItem?.validate('change').catch(debugWarn)
        }
      }
    }
  })
)

app.mount('#app')
```

### 局部注册

```ts
import '@wangeditor/editor/dist/css/style.css'
import { defineComponent } from 'vue'
import { WeEditable, WeToolbar } from 'wangeditor5-for-vue3'

export default defineComponent({
  components: { WeEditable, WeToolbar }
})
```

或

```ts
import '@wangeditor/editor/dist/css/style.css'
import { defineComponent } from 'vue'
import { WeEditor } from 'wangeditor5-for-vue3'

export default defineComponent({
  components: { WeEditor }
})
```

## 示例

### WeToolbar + WeEditable

在 `wangeditor5-for-vue3` 组件库中，菜单栏和编辑区分别提供了独立的组件，可供使用者在特殊场景下使用。

```vue
<template>
  <we-toolbar :handle="handle" />
  <we-editable :handle="handle" v-model:json="formData.jarr" v-model:html="formData.html" />
  <!-- 使用 string 修饰符来指定 JSON 数据的格式为字符串 -->
  <!-- <we-editable :handle="handle" v-model:json.string="formData.jstr" /> -->
</template>
```

<CodeGroup>
  <CodeGroupItem title="JS">

```vue
<script>
  import '@wangeditor/editor/dist/css/style.css'
  import { defineComponent, shallowReactive } from 'vue'
  import { useWangEditor } from 'wangeditor5-for-vue3'

  export default defineComponent({
    setup() {
      const { opts, handle, instance, clearContent, syncContent, reloadEditor } = useWangEditor({
        // 防抖时长。当会触发重载的配置项发生变化 365ms 后，编辑器会重载
        reloadDelary: 365,
        // 编辑器配置
        toolbar: {},
        // 菜单栏配置
        editable: {
          config: {
            placeholder: '请开始你的表演'
          }
        }
      })

      // 开启只读模式
      opts.editable.config.readOnly = true

      // 不要使用 reactive/ref，应该使用 shallowReactive/shallowRef 来接收 json array 数据
      const formData = shallowReactive({ jarr: [], jstr: '', html: '' })

      return { handle, formData }
    }
  })
</script>
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```vue
<script lang="ts">
  import '@wangeditor/editor/dist/css/style.css'
  import { defineComponent, shallowReactive } from 'vue'
  import { SlateDescendant } from '@wangeditor/editor'
  import { useWangEditor } from 'wangeditor5-for-vue3'

  export default defineComponent({
    setup() {
      const { opts, handle, instance, clearContent, syncContent, reloadEditor } = useWangEditor({
        // 防抖时长。当会触发重载的配置项发生变化 365ms 后，编辑器会重载
        reloadDelary: 365,
        // 编辑器配置
        toolbar: {},
        // 菜单栏配置
        editable: {
          config: {
            placeholder: '请开始你的表演'
          }
        }
      })

      // 开启只读模式
      opts.editable.config.readOnly = true

      // 不要使用 reactive/ref，应该使用 shallowReactive/shallowRef 来接收 json array 数据
      const formData = shallowReactive({ jarr: [] as SlateDescendant[], jstr: '', html: '' })

      return { handle, formData }
    }
  })
</script>
```

  </CodeGroupItem>
</CodeGroup>

### WeEditor

`WeEditor` 组件将 `WeToolbar` 和 `WeEditable` 组件封装在了一个组件中，使用更方便。

```vue
<template>
  <we-editor :handle="handle" v-model:json="formData.jarr" v-model:html="formData.html" />
  <!-- 使用 string 修饰符来指定 JSON 数据的格式为字符串 -->
  <!-- <we-editor :handle="handle" v-model:json.string="formData.jstr" /> -->
</template>
```

<CodeGroup>
  <CodeGroupItem title="JS">

```vue
<script>
  import '@wangeditor/editor/dist/css/style.css'
  import { defineComponent, shallowReactive } from 'vue'
  import { useWangEditor } from 'wangeditor5-for-vue3'

  export default defineComponent({
    setup() {
      const { opts, handle, instance, clearContent, syncContent, reloadEditor } = useWangEditor({
        // 防抖时长。当会触发重载的配置项发生变化 365ms 后，编辑器会重载
        reloadDelary: 365,
        // 编辑器配置
        toolbar: {},
        // 菜单栏配置
        editable: {
          config: {
            placeholder: '请开始你的表演'
          }
        }
      })

      // 开启只读模式
      opts.editable.config.readOnly = true

      // 不要使用 reactive/ref，应该使用 shallowReactive/shallowRef 来接收 json array 数据
      const formData = shallowReactive({ jarr: [], jstr: '', html: '' })

      return { handle, formData }
    }
  })
</script>
```

  </CodeGroupItem>

  <CodeGroupItem title="TS" active>

```vue
<script lang="ts">
  import '@wangeditor/editor/dist/css/style.css'
  import { defineComponent, shallowReactive } from 'vue'
  import { SlateDescendant } from '@wangeditor/editor'
  import { useWangEditor } from 'wangeditor5-for-vue3'

  export default defineComponent({
    setup() {
      const { opts, handle, instance, clearContent, syncContent, reloadEditor } = useWangEditor({
        // 防抖时长。当会触发重载的配置项发生变化 365ms 后，编辑器会重载
        reloadDelary: 365,
        // 编辑器配置
        toolbar: {},
        // 菜单栏配置
        editable: {
          config: {
            placeholder: '请开始你的表演'
          }
        }
      })

      // 开启只读模式
      opts.editable.config.readOnly = true

      // 不要使用 reactive/ref，应该使用 shallowReactive/shallowRef 来接收 json array 数据
      const formData = shallowReactive({ jarr: [] as SlateDescendant[], jstr: '', html: '' })

      return { handle, formData }
    }
  })
</script>
```

  </CodeGroupItem>
</CodeGroup>
