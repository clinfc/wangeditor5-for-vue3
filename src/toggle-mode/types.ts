export type ToggleTarget = 'toolbar' | 'editable' | 'editor'

export type ToggleModeMenuKey = 'toggleModeButton' | 'toggleModeSelect'

/**
 * 多语言
 */
export interface ToggleModeLanguage {
  mode: Record<ToggleTarget | 'title' | 'standardAuto', string>
}

/**
 * 多语言集合
 */
export type ToggleLocale = Record<'zh-CN' | 'en' | string, ToggleModeLanguage>

/**
 * 当切换方式为整体进行切换时，切换的模式是以哪一个为准。toolbar：以菜单栏为准；editable：以编辑区为准；auto：各自独立切换，相互不影响。
 */
export type Standrad = 'toolbar' | 'editable' | 'auto'

export interface RegistToggleModeOptions {
  /**
   * 是否在注册的菜单栏前面添加分割线
   */
  divider?: boolean
  locale?: ToggleLocale
  menu?: ToggleModeMenuKey | false
  standard?: Standrad
}
