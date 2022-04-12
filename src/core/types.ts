import { IDomEditor, IEditorConfig, IToolbarConfig, SlateDescendant, Toolbar } from '@wangeditor/editor'

type CssRule = Record<string, string | number>
export type WeCssRuleMap = Record<string, CssRule>
export type WeCssRuleList = string | (string | WeCssRuleMap)[] | WeCssRuleMap

/**
 * 编辑器内容缓存
 */
export interface WeEditableCache {
  mval: SlateDescendant[]
  json: string
  html: string
}

export interface WeEditorFormFields {
  blurField?: () => void
  changeField?: () => void
}

/**
 * 编辑器配置项
 */
export interface WeEditableOption {
  /** 编辑器模式 */
  mode?: 'default' | 'simple'
  /** 编辑器初始化的默认内容（json array 或 json string），优先级高于 defaultHtml */
  defaultContent?: SlateDescendant[] | string | null
  /** 编辑器初始化的默认内容（html string），优先级低于 defaultContent */
  defaultHtml?: string | null
  /** 编辑器配置 */
  config?: Partial<IEditorConfig>
  /** v-model 数据同步的防抖时长，默认值：3000，单位：毫秒 */
  delay?: number
  /**
   * 编辑器创建时默认内容的优先级排序，默认值：true。
   * true：v-model > v-model:json > v-model:html > defaultContent > defaultHtml。
   * false: defaultContent > defaultHtml > v-model > v-model:json > v-model:html。
   */
  extendCache?: boolean
  /** 对编辑器实例使用 markRaw 进行标记，默认值：true */
  markRaw?: boolean
}

/**
 * 菜单栏的配置项
 */
export interface WeToolbarOption {
  mode?: 'default' | 'simple'
  config?: Partial<IToolbarConfig>
  /** 对菜单栏实例使用 markRaw 进行标记，默认值：true */
  markRaw?: boolean
}

export type WeEditableReload = () => IDomEditor | undefined

export interface WeEditableHandle {
  instance?: IDomEditor
  reload?: () => void
  /** 清除编辑器内容 */
  clearContent?: () => void
  /** 强制将数据同步到 v-model 上 */
  syncContent?: () => void
}

export type WeToolbarReload = (editable: IDomEditor) => Toolbar | undefined

export interface WeToolbarHandle {
  instance?: Toolbar
  reload?: () => void
}

export const enum DELAY {
  RELOAD = 500,
  UPDATE = 3000,
}
