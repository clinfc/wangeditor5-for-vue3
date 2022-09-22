import { Ref } from 'vue'
import { IDomEditor, IEditorConfig, IToolbarConfig, SlateDescendant, Toolbar } from '@wangeditor/editor'

export type Nullish<T> = T extends undefined | null ? never : T

/**
 * 编辑区配置项
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
   * true：v-model:json &gt; v-model:html &gt; defaultContent &gt; defaultHtml。
   * false: defaultContent &gt; defaultHtml &gt; v-model:json &gt; v-model:html。
   */
  extendCache?: boolean
}

/**
 * 菜单栏的配置项
 */
export interface WeToolbarOption {
  mode?: 'default' | 'simple'
  config?: Partial<IToolbarConfig>
}

export type WeInjectContent = {
  opts: WeOptions
  instance: WeInstance
  cache: WeCache
  globalAttrs: Ref<Required<WeGlobalAttrs>>
  formFieldInit: () => WeFormField
}

/**
 * useWangEditor 的编辑器配置项
 */
export type WeOptions<T extends boolean = true> = {
  /** 重载的延迟时间，默认值：500，单位：毫秒 */
  reloadDelay: number
  toolbar: T extends true ? Required<WeToolbarOption> : WeToolbarOption
  editable: T extends true ? Required<WeEditableOption> : WeEditableOption
}

/**
 * useWangEditor 返回的编辑器实例
 */
export type WeInstance = {
  editable: IDomEditor | null
  toolbar: Toolbar | null
}

/**
 * useWangEditor 返回的句柄的形参
 */
export type WeHandleOption = {
  cache: WeCache
  opts: WeOptions
  instance: WeInstance
}

export type WeSetTimeout = number | null

export type WeCache = {
  editable?: {
    create: () => void
    throttle: () => void
    timer: WeSetTimeout
  }
  toolbar?: {
    create: () => void
    throttle: () => void
    timer: WeSetTimeout
  }
  clearContent?: () => void
  syncContent?: () => void
}

/**
 * 编辑器内容缓存
 */
export type WeEditableCache = {
  json: SlateDescendant[]
  jstr: string
  html: string
}

/**
 * 菜单栏重载事件
 */
export type WeToolbarReloadEvent = {
  type: 'toolbar'
  instance: Toolbar
}

/**
 * 编辑区重载事件
 */
export type WeEditableReloadEvent = {
  type: 'editable'
  instance: IDomEditor
}

/**
 * 重载事件
 */
export type WeReloadEvent = WeToolbarReloadEvent | WeEditableReloadEvent

/**
 * 表单验证触发函数
 */
export type WeFormField = {
  blur: () => void
  change: () => void
}

/**
 * 初始化“表单验证触发函数”的函数
 */
export type WeFormFieldInit = () => Partial<WeFormField>

export interface WeGlobalAttrs {
  editor?: Record<string, any>
  toolbar?: Record<string, any>
  editable?: Record<string, any>
}

export interface WeGlobalConfig {
  opts?: Partial<WeOptions<false>>
  attrs?: WeGlobalAttrs
  formFieldInit?: WeFormFieldInit
}

export type WeGlobalConfigInit<K extends keyof WeGlobalConfig, T = WeGlobalConfig[K]> = T extends undefined
  ? never
  : T extends WeFormFieldInit
  ? () => () => WeFormField
  : T extends WeGlobalAttrs
  ? () => Required<T>
  : () => WeOptions

export type WeGlobalPropertiesName = `WE-${Uppercase<keyof WeGlobalConfig>}`

export interface TypeMap {
  number: number
  string: string
  boolean: boolean
  undefined: undefined
  null: null
  bigint: BigInt
  symbol: Symbol
  object: object
  array: Array<unknown>
  date: Date
  map: Map<unknown, unknown>
  set: Set<unknown>
  weakmap: WeakMap<object, unknown>
  weakset: WeakSet<object>
  function: Function
  regexp: RegExp
}

/**
 * 从数组中获取值类型
 */
export type ArrayValudOf<T> = T extends ArrayLike<infer U> ? U : never
