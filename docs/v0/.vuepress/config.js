import { defineUserConfig, defaultTheme } from 'vuepress'

import { V0_PATH, V0_URL, V1_URL } from 'shared'

export default defineUserConfig({
  // 站点配置
  lang: 'zh-CN',
  title: 'wangeditor5-for-vue3 v0.x',
  description: '支持动态配置的 wangEditor5 for vue3 组件',
  base: V0_PATH,

  theme: defaultTheme({
    // logo: 'https://www.wangeditor.com/v5/image/logo.png',
    locales: {
      '/': {
        lang: 'zh-CN',
        selectLanguageName: '简体中文',
        navbar: [
          { text: '快速开始', link: '/guide/' },
          { text: '增强模式', link: '/shadow/' },
          {
            text: 'keywords',
            children: [
              { text: 'WeToolbar/WeEditable', link: '/guide/#wetoolbar-weeditable' },
              { text: 'WeEditor', link: '/guide/#weeditor' },
              { text: 'WeEditorPlus', link: '/shadow/start.md#使用示例' },
              { text: 'useWangEditor', link: '/guide/use-wang-editor.md' },
              { text: 'clearContent', link: '/guide/use-wang-editor.md#clearcontent' },
              { text: 'syncContent', link: '/guide/use-wang-editor.md#synccontent' },
              { text: 'getToolbar', link: '/guide/use-wang-editor.md#gettoolbar' },
              { text: 'getEditable', link: '/guide/use-wang-editor.md#geteditable' },
              { text: 'reloadEditor', link: '/guide/use-wang-editor.md#reloadeditor' },
              { text: 'WeEditableOption', link: '/guide/editable-option.md' },
              { text: 'WeToolbarOption', link: '/guide/toolbar-option.md' },
              { text: 'weEditorPlusCssRule', link: '/shadow/css-rule.md#全局样式注入' },
              { text: 'WeCssRuleList', link: '/shadow/css-rule.md#组件样式注入' },
              { text: '触发重载的配置项', link: '/guide/use-wang-editor.md#会触发重载的配置项' }
            ]
          },
          { text: '扩展', link: '/extension/' },
          {
            text: '使用示例',
            children: [
              {
                text: 'element-plus',
                link: 'https://github.com/clinfc/wangeditor5-for-vue3-example'
              },
              {
                text: 'ant-design-vue@3',
                link: 'https://github.com/clinfc/wangeditor5-for-vue3/tree/main/example/ant_design'
              },
              {
                text: 'naive-ui',
                link: 'https://github.com/clinfc/wangeditor5-for-vue3/tree/main/example/naive_ui'
              },
              {
                text: 'vue-cli',
                link: 'https://github.com/clinfc/wangeditor5-for-vue3/tree/main/example/vue_cli'
              }
            ]
          },
          {
            text: '友情链接',
            children: [
              { text: 'wangEditor', link: 'https://www.wangeditor.com' },
              { text: 'wangeditor5-for-vue2', link: 'https://clinfc.github.io/wangeditor5-for-vue2' },
              { text: 'Vue3', link: 'https://staging-cn.vuejs.org' }
            ]
          },
          {
            text: 'version',
            children: [
              { text: 'v0.x', link: V0_URL },
              { text: 'v1.x', link: V1_URL }
            ]
          },
          { text: 'Github', link: 'https://github.com/clinfc/wangeditor5-for-vue3' }
        ],
        sidebar: {
          '/guide/': [
            '/guide/README.md',
            '/guide/props.md',
            '/guide/use-wang-editor.md',
            '/guide/editable-option.md',
            '/guide/toolbar-option.md',
            '/guide/reloadbefore.md',
            '/guide/v-model.md',
            '/guide/form-field.md',
            '/guide/typescript.md',
            '/guide/vue-cli.md',
            '/guide/relevance.md',
            '/guide/locale.md'
          ],
          '/shadow/': ['/shadow/README.md', '/shadow/start.md', '/shadow/css-rule.md'],
          '/extension/': ['/extension/README.md', '/extension/toggle-mode.md']
        }
      }
    }
  })
})
