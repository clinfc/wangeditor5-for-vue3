# 介绍

除了常规模式外（`WeToolbar`/`WeEditable`/`WeEditor`组件），`wangeditor5-for-vue3` 还提供了增强模式（`WeEditorPlus`组件），意在解决全局样式污染的问题，让你在使用时不会因全局样式而出现不合预期的状况。

当然这不是没有代价的，虽然经过了封装，但是上手依然有些许难度，同时在兼容性上略差。

增强模式底层基于浏览器原生的 `Web Component` 和 `Shadow Dom`，请谨慎使用。

参考文档：

- [WebComponents](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)
- [ShadowDom](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM)
- [ShadowRoot](https://developer.mozilla.org/zh-CN/docs/Web/API/ShadowRoot)
