# wangeditor5-for-vue3

在 [Vue3](https://v3.cn.vuejs.org/) 中使用 [wangEditor5](https://www.wangeditor.com/v5/)。

> `wangEditor` 是一款开源 `Web` 富文本编辑器，开箱即用，配置简单

## 在线示例

[https://clinfc.github.io/wangeditor5-for-vue3-example/](https://clinfc.github.io/wangeditor5-for-vue3-example/)

## 快速开始

```sh
yarn add @wangeditor/editor wangeditor5-for-vue3
// or
npm install @wangeditor/editor wangeditor5-for-vue3
```

## 用户文档

- [wangeditor5](https://www.wangeditor.com/v5/)
- [wangeditor5-for-vue2](https://clinfc.github.io/wangeditor5-for-vue2/)
- [wangeditor5-for-vue3](https://clinfc.github.io/wangeditor5-for-vue3/)

## 功能亮点

- **动态配置**

  符合 `Vue` 使用习惯，数据驱动，通过修改配置即可更新编辑器（编辑器创建后修改配置项仍生效）

- **双向绑定**

  支持 `v-model`、`v-model:json` 和 `v-model:html` 三种形式的双向绑定，分别对应 `json array`、`json string` 和 `html string` 三种形式的数据

- **表单验证**

  目前已支持 `element-plus`、`ant-design-vue@^3` 和 `naive-ui` 的表单验证，还可以自定义表单验证的执行逻辑

- **初始内容**

  编辑器创建时的默认内容配置项支持 `json array`、`json string` 和 `html string` 三种格式的数据

- **优雅切换**

  `defaultContent`/`defaultHtml` + `reloadEditor()` 可优雅的实现在不同文章间的来回切换

- **增强模式**

  `WeEditorPlus` 组件能隔绝全局的样式污染，解决你因样式而造成的困扰

### 示例代码

- [element-plus](./example/element_plus)
- [ant-design-vue@^3](./example/ant_design)
- [naive-ui](./example/naive_ui)
- [vue-cli](./example/vue_cli)

### 兼容性

- `vue@^3`
- `@wangeditor/editor@^0.14.0`

### 交流

- 提交 [issues](https://github.com/clinfc/wangeditor5-for-vue3/issues)
- QQ 群：`343186156`
