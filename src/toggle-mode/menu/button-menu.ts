import { ToggleIcon } from '../icons'
import { IButtonMenu, IDomEditor, t } from '@wangeditor/editor'
import { Standrad, ToggleTarget } from '../types'
import { execToggle } from './helper'

export class ToggleModeButtonMenu implements Omit<IButtonMenu, 'exec'> {
  readonly tag = 'button'

  readonly title = t('mode.title')

  readonly iconSvg = ToggleIcon

  public readonly type: ToggleTarget = 'editor'

  constructor(public readonly standrad: Standrad) {}

  getValue() {
    return false
  }

  isActive() {
    return false
  }

  isDisabled() {
    return false
  }

  exec(editor: IDomEditor) {
    execToggle(editor, this.type, this.standrad)
  }
}
