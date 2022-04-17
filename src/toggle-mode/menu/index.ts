import { IRegisterMenuConf } from '@wangeditor/core'
import { Boot } from '@wangeditor/editor'
import { Standrad, ToggleModeMenuKey } from '../types'
import { ToggleModeButtonMenu } from './button-menu'
import { ToggleModeSelectMenu } from './select-menu'

/**
 * 注册菜单栏项
 * @param standrad 整体切换时的基准
 */
export function registMenu(standrad: Standrad = 'auto') {
  const menus: IRegisterMenuConf[] = [
    {
      key: `toggleModeButton`,
      factory() {
        return new ToggleModeButtonMenu(standrad)
      },
    },
    {
      key: 'toggleModeSelect',
      factory() {
        return new ToggleModeSelectMenu(standrad)
      },
    },
  ]

  // 批量注册
  Boot.registerModule({ menus })

  return menus.map(({ key }) => key) as ToggleModeMenuKey[]
}
