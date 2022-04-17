import { IDomEditor } from '@wangeditor/editor'
import { getOption } from '../../core/core'
import { Standrad, ToggleTarget } from '../types'

export function execToggle(editor: IDomEditor, type: ToggleTarget, standrad: Standrad) {
  const { toolbar, editable } = getOption(editor)

  if (type === 'editor') {
    if (standrad === 'toolbar') {
      toolbar.mode = toolbar.mode === 'default' ? 'simple' : 'default'
      editable.mode = toolbar.mode
      return
    }
    if (standrad === 'editable') {
      toolbar.mode = editable.mode === 'default' ? 'simple' : 'default'
      editable.mode = toolbar.mode
      return
    }
  }
  // (toolbar || editor) && standrad:auto
  if (type !== 'editable') toolbar.mode = toolbar.mode === 'default' ? 'simple' : 'default'
  // (editable || editor) && auto
  if (type !== 'toolbar') editable.mode = editable.mode === 'default' ? 'simple' : 'default'
}
