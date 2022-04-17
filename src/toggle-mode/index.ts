import { Boot, i18nAddResources } from '@wangeditor/editor'

import defaultLocale from './locale'
import { RegistToggleModeOptions, ToggleModeMenuKey } from './types'
import { registMenu } from './menu/index'

const defaultMenu: ToggleModeMenuKey = 'toggleModeSelect'

export function registToggleMode(options?: RegistToggleModeOptions) {
  const { divider = true, locale, standard, menu = defaultMenu } = options ?? {}

  // 多语言
  const languages = Object.assign({}, defaultLocale, locale)
  Object.entries(languages).forEach(([lang, resources]) => i18nAddResources(lang, resources))

  const keys = registMenu(standard)

  // 不添加到全局配置中
  if (menu === false) return

  const toolbarKeys: any[] = []

  toolbarKeys.push(keys.includes(menu) ? menu : defaultMenu)

  divider && toolbarKeys.unshift('|')

  // default toolbarKey
  const defTKs = Boot.toolbarConfig.toolbarKeys
  Array.isArray(defTKs) ? defTKs.push(...toolbarKeys) : Boot.setToolbarConfig({ toolbarKeys })

  // simple toolbarKey
  const simTKs = Boot.simpleToolbarConfig.toolbarKeys
  Array.isArray(simTKs) ? simTKs.push(...toolbarKeys) : Boot.setSimpleToolbarConfig({ toolbarKeys })
}
