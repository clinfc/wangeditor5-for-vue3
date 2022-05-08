/**
 * 进行 mode 切换的目标。toolbar：只对菜单栏进行切换；editable：只对编辑区进行切换；editor：对编辑区和菜单栏同时进行切换。
 */
export type ToggleTarget = 'toolbar' | 'editable' | 'editor'

/**
 * 添加到默认菜单栏的 toggle-mode 菜单的关键字（唯一键）
 */
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
