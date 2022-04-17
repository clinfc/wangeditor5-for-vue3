import { ToggleModeLanguage } from './types'

const ZH: ToggleModeLanguage = {
  mode: {
    title: '切换模式',
    editor: '{mode} 编辑器',
    toolbar: '{mode} 菜单栏',
    editable: '{mode} 编辑区',
    standardAuto: '切换编辑器模式',
  },
}

const EN: ToggleModeLanguage = {
  mode: {
    title: 'Toggle Mode',
    editor: '{mode} Editor',
    toolbar: '{mode} Toolbar',
    editable: '{mode} Editable',
    standardAuto: 'Toggle Editor Mode',
  },
}

export default {
  en: EN,
  'zh-CN': ZH,
}
