module.exports = {
  // 站点配置
  lang: 'zh-CN',
  title: 'wangeditor5-for-vue3',
  description: '支持动态配置的 wangEditor5 for vue3 组件',
  base: '/wangeditor5-for-vue3/',

  themeConfig: {
    logo: 'https://www.wangeditor.com/v5/image/logo.png',
    locales: {
      '/': {
        lang: 'zh-CN',
        selectLanguageName: '简体中文',
        navbar: [
          { text: '文档', link: '/guide/' },
          { text: 'wangEditor5', link: 'https://www.wangeditor.com/v5' },
          { text: 'Vue3', link: 'https://v3.cn.vuejs.org/' },
          { text: 'Github', link: 'https://github.com/clinfc/wangeditor5-for-vue3' },
        ],
        sidebar: [
          '/guide/README.md',
          '/guide/use-wang-editor.md',
          '/guide/reloadbefore.md',
          '/guide/v-model.md',
          '/guide/form-field.md',
          '/guide/typescript.md',
        ],
      },
    },
  },
}
