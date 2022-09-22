import {
  App,
  getCurrentInstance,
  inject,
  InjectionKey,
  Plugin,
  provide,
  reactive,
  Ref,
  ref,
  shallowReactive,
  toRefs,
  watch
} from 'vue'
import {
  WeCache,
  WeInjectContent,
  WeInstance,
  WeOptions,
  WeFormField,
  WeFormFieldInit,
  WeGlobalConfig,
  WeGlobalAttrs,
  WeGlobalPropertiesName,
  WeGlobalConfigInit
} from './types'
import { deepMerge, is } from './utils'

let HANDLE_INDEX = 1

function defaultOptions(): WeOptions {
  return {
    reloadDelay: 500,
    toolbar: {
      mode: 'default',
      config: {}
    },
    editable: {
      mode: 'default',
      defaultContent: null,
      defaultHtml: null,
      config: {},
      delay: 3000,
      extendCache: true
    }
  }
}

function defaultAttrs(): Required<WeGlobalAttrs> {
  return { editor: {}, toolbar: {}, editable: {} }
}

function defaultFormFieldInit(): WeFormField {
  return { blur() {}, change() {} }
}

function defaultGlobalConfig(): Required<WeGlobalConfig> {
  return { opts: defaultOptions(), attrs: defaultAttrs(), formFieldInit: defaultFormFieldInit }
}

function createGlobalPropertyName(name: keyof WeGlobalConfig): WeGlobalPropertiesName {
  return `WE-${name.toUpperCase()}` as WeGlobalPropertiesName
}

/**
 * 创建 wangEditor 编辑器的全局配置注册函数
 * @param config - 全局配置
 */
export function createWeGlobalConfig(config: WeGlobalConfig): Plugin {
  return function (app: App) {
    deepMerge(defaultGlobalConfig(), config)

    const configRefs = toRefs(reactive(config))
    const keys = Object.keys(configRefs) as (keyof WeGlobalConfig)[]

    keys.forEach((key) => {
      app.config.globalProperties[createGlobalPropertyName(key)] = configRefs[key]
    })
  }
}

const GlobalPropertiesInit = {
  opts: defaultOptions,
  attrs: defaultAttrs,
  formFieldInit: () => defaultFormFieldInit
} as {
  [K in keyof WeGlobalConfig]-?: WeGlobalConfigInit<K>
}

export function useWeGlobalConfig<K extends keyof WeGlobalConfig>(key: K): Ref<ReturnType<WeGlobalConfigInit<K>>> {
  const properties = getCurrentInstance()?.appContext.config.globalProperties

  if (properties) {
    const name = createGlobalPropertyName(key)
    if (!Reflect.has(properties, name)) {
      properties[name] = ref(GlobalPropertiesInit[key]())
    }
    return properties[name]
  }

  return ref(GlobalPropertiesInit[key]() as any)
}

/**
 * 创建编辑器配置
 * @param option - 初始化配置项
 */
export function useWangEditor(
  option: Partial<WeOptions<false>> | null = null,
  formField?: WeFormFieldInit
): {
  opts: WeOptions
  instance: WeInstance
  handle: InjectionKey<WeInjectContent>
  clearContent: () => void
  syncContent: () => void
  reloadEditor: () => void
} {
  const opts = reactive((is(option, 'object') ? option : {}) as WeOptions)

  const globalOpts = useWeGlobalConfig('opts')

  watch(
    globalOpts,
    (options) => {
      if (is(options, 'object')) {
        deepMerge(options, opts)
      }
    },
    { immediate: true, deep: true }
  )

  const instance = shallowReactive<WeInstance>({
    editable: null,
    toolbar: null
  })

  const cache: WeCache = {}

  const globalFormField = useWeGlobalConfig('formFieldInit')

  function formFieldInit(): WeFormField {
    return [globalFormField.value, formField].reduce((field, init) => {
      if (typeof init === 'function') {
        const { blur, change } = init()

        if (typeof blur === 'function') field.blur = blur
        if (typeof change === 'function') field.change = change
      }

      return field
    }, defaultFormFieldInit())
  }

  const handle: InjectionKey<WeInjectContent> = Symbol(`WE ${String(HANDLE_INDEX++).padStart(6, '0')}`)

  provide(handle, {
    opts,
    instance,
    cache,
    formFieldInit,
    globalAttrs: useWeGlobalConfig('attrs')
  })

  function clearContent() {
    cache.clearContent?.()
  }

  function syncContent() {
    cache.syncContent?.()
  }

  function reloadEditor() {
    cache.editable?.create()
  }

  return { opts, instance, handle, clearContent, syncContent, reloadEditor }
}

/**
 * 获取 useWangEditor 中传递的 provide 数据
 * @param handle - 句柄
 */
export function useWeContent(handle: InjectionKey<WeInjectContent>): WeInjectContent {
  return (
    inject(handle) ?? {
      cache: {},
      opts: reactive(defaultOptions()),
      instance: shallowReactive({
        toolbar: null,
        editable: null
      }),
      globalAttrs: useWeGlobalConfig('attrs'),
      formFieldInit: useWeGlobalConfig('formFieldInit').value
    }
  )
}
