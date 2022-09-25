import { defineUserConfig, defaultTheme } from 'vuepress'

import { V1_PATH, V0_URL, V1_URL, ELPLUS_URL } from 'shared'

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'wangeditor5-for-vue3 v1.x',
  description: '支持动态配置的 wangEditor5 for vue3 组件',
  base: V1_PATH,

  theme: defaultTheme({
    // logo: 'https://www.wangeditor.com/v5/image/logo.png',
    locales: {
      '/': {
        lang: 'zh-CN',
        selectLanguageName: '简体中文',
        navbar: [
          { text: '快速开始', link: '/guide/' },
          {
            text: '使用示例',
            children: [
              {
                text: 'element-plus',
                link: ELPLUS_URL
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
            '/guide/global-config.md',
            '/guide/use-wang-editor.md',
            '/guide/v-model.md',
            '/guide/form-validate.md',
            '/guide/typescript.md'
          ]
        }
      }
    }
  })
})
