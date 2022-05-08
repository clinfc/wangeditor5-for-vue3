import { i18nAddResources } from '@wangeditor/editor'
import { VComponentLanguage } from './types'

const EN: VComponentLanguage = {
  vcomponent: {
    initialize: 'You must use the ${component} Opiton created by "useWangEditor" function!',
    instance: 'unable to get the ${component} instance!',
  },
}

const ZH: VComponentLanguage = {
  vcomponent: {
    initialize: '你必须使用由 “useWangEditor” 函数创建的 ${component} Option！',
    instance: '无法获取 ${component} 实例！',
  },
}

i18nAddResources('en', EN)
i18nAddResources('zh-CN', ZH)
