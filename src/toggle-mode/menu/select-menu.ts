import { IOption } from '@wangeditor/core'
import { IDomEditor, ISelectMenu, t } from '@wangeditor/editor'
import { getOption } from '../../core/core'
import { ToggleIcon } from '../icons'
import { Standrad, ToggleTarget } from '../types'
import { execToggle } from './helper'

function toggle(mode: string) {
  return mode === 'default' ? 'simple' : mode === 'simple' ? 'default' : mode
}

export class ToggleModeSelectMenu implements ISelectMenu {
  readonly tag = 'select'

  readonly title = t('mode.title')

  readonly iconSvg = ToggleIcon

  constructor(public readonly standard: Standrad) {}

  getOptions(editor: IDomEditor) {
    const { toolbar, editable } = getOption(editor)

    const mode =
      this.standard === 'editable'
        ? editable.mode!
        : this.standard === 'toolbar'
        ? toolbar.mode!
        : editable.mode! === toolbar.mode
        ? editable.mode!
        : ''

    const options: IOption[] = [
      {
        text: t('mode.title'),
        value: 'mode',
        styleForRenderMenuList: {
          padding: '10px 0',
          borderBottom: '1px solid var(--w-e-toolbar-border-color)',
          cursor: 'not-allowed',
          textAlign: 'center',
        },
      },
      {
        text: mode ? t('mode.editor').replace('{mode}', toggle(mode)) : t('mode.standardAuto'),
        value: 'editor',
        styleForRenderMenuList: { padding: '7px 25px' },
      },
      {
        text: t('mode.toolbar').replace('{mode}', toggle(toolbar.mode!)),
        value: 'toolbar',
        styleForRenderMenuList: { padding: '7px 25px' },
      },
      {
        text: t('mode.editable').replace('{mode}', toggle(editable.mode!)),
        value: 'editable',
        styleForRenderMenuList: { padding: '7px 27px' },
      },
    ]

    return options
  }

  getValue() {
    return 'mode'
  }

  isActive() {
    return false
  }

  isDisabled() {
    return false
  }

  exec(editor: IDomEditor, type: string | boolean) {
    if (type === 'mode') return

    execToggle(editor, type as ToggleTarget, this.standard)
  }
}
