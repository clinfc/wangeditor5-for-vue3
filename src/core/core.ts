import { createEditor, createToolbar, IDomEditor, IEditorConfig, Toolbar } from '@wangeditor/editor'
import debounce from 'lodash.debounce'
import { Descendant } from 'slate'
import {
  computed,
  getCurrentInstance,
  inject,
  InjectionKey,
  isProxy,
  onBeforeUnmount,
  onMounted,
  reactive,
  Ref,
  shallowReactive,
  toRaw,
  unref,
  watch,
} from 'vue'
import {
  DELAY,
  EditableCache,
  EditableHandle,
  EditableOption,
  EditableReload,
  EditorFormField,
  ToolbarOption,
  ToolbarHandle,
  ToolbarReload,
} from './types'

const EDITABLE_HANDLE: WeakMap<EditableOption, EditableHandle> = new WeakMap()

const TOOLBAR_HANDLE: WeakMap<ToolbarOption, ToolbarHandle> = new WeakMap()

/** 编辑器 与 Toolbar 间的映射关系 */
const EDITABLE_TOOLBAR: WeakMap<EditableOption, ToolbarOption> = new WeakMap()

/** Toolbar 与 编辑器 间的映射关系 */
const TOOLBAR_EDITABLE: WeakMap<ToolbarOption, EditableOption> = new WeakMap()

const TIMER: WeakMap<ToolbarOption | EditableOption, [reloadDelay: number, timeoutId: null | NodeJS.Timeout]> =
  new WeakMap()

export const weFormFieldInjectionKey: InjectionKey<() => EditorFormField> = Symbol('weFormFieldInjectionKey')

function setTimer(option: ToolbarOption | EditableOption, fn?: () => void) {
  let timer = TIMER.get(option)
  if (timer) {
    if (timer[1]) {
      clearTimeout(timer[1])
      timer[1] = null
    }
  } else {
    TIMER.set(option, (timer = [DELAY.RELOAD, null]))
  }
  if (fn) {
    timer[1] = setTimeout(() => {
      timer![1] = null
      fn()
    }, timer[0])
  }
}

/**
 * vue hook，在 WeEditable 组件中使用
 */
function injectEditor(option: EditableOption, reload: EditableReload, clearContent: () => void) {
  function reset() {
    const instance = reload()
    if (!instance) return

    const temp = EDITABLE_HANDLE.get(option)
    if (!temp) {
      EDITABLE_HANDLE.set(option, { instance, reload: reset })
    } else {
      temp.instance = instance
    }

    // 自动重载 toolbar
    const toolbar = EDITABLE_TOOLBAR.get(option)
    if (toolbar) {
      const treload = TOOLBAR_HANDLE.get(toolbar)?.reload
      if (treload) {
        setTimer(toolbar)
        treload()
      }
    }
  }

  EDITABLE_HANDLE.set(option, { clearContent, reload: reset })

  return reset
}

/**
 * vue hook，在 WeToolbar 组件中使用
 */
function injectToolbar(option: ToolbarOption, reload: ToolbarReload) {
  function reset() {
    const editableOptions = TOOLBAR_EDITABLE.get(option)
    if (!editableOptions) return

    const editable = EDITABLE_HANDLE.get(editableOptions)
    if (!editable || !editable.instance) return

    const instance = reload(editable.instance)
    if (!instance) return

    const temp = TOOLBAR_HANDLE.get(option)
    if (!temp) {
      TOOLBAR_HANDLE.set(option, { instance, reload: reset })
    } else {
      temp.instance = instance
    }
  }

  TOOLBAR_HANDLE.set(option, { reload: reset })

  return reset
}

/**
 * 获取触发表单验证的句柄
 */
function injectFormField() {
  let initialize = inject(weFormFieldInjectionKey)
  if (!initialize) {
    const inst = getCurrentInstance()!
    initialize = inst?.appContext.config.globalProperties.$weFormFieldInitialize
  }
  return initialize ? initialize() : {}
}

/**
 * 菜单栏主逻辑
 * @param option 菜单栏配置项
 * @param reloadbefore 重载前的回调
 * @param selector 获取菜单栏初始化的 DOM 节点
 */
export function toolbarSetup(
  option: Required<ToolbarOption>,
  reloadbefore: (instance: Toolbar) => void,
  selector: () => undefined | HTMLDivElement
) {
  let instance: Toolbar | null = null

  function initialize(editor: IDomEditor) {
    const elem = selector()

    if (!elem) return

    if (instance) {
      reloadbefore(instance)
      instance.destroy()
      delete elem.dataset.wEToolbar
    }

    instance = createToolbar({ ...option, editor, selector: elem })

    return instance
  }

  const reload = injectToolbar(option, initialize)

  watch(
    () => option,
    () => {
      const editable = TOOLBAR_EDITABLE.get(option)

      // 编辑器变更会自动更新 toolbar
      if (!editable || TIMER.get(editable)?.[1] !== null) return

      setTimer(option, reload)
    },
    { deep: true }
  )

  onMounted(reload)

  onBeforeUnmount(() => {
    instance?.destroy()
    instance = null
  })
}

/**
 * 编辑区主逻辑
 * @param option 编辑区配置项
 * @param mval v-model
 * @param json v-model:json
 * @param html v-model:html
 * @param emit Vue emit 函数
 * @param reloadbefore 重载前的回调
 * @param selector 获取编辑区初始化的 DOM 节点
 */
export function editableSetup(
  option: Required<EditableOption>,
  mval: Ref<undefined | Descendant[]>,
  json: Ref<undefined | string>,
  html: Ref<undefined | string>,
  emit: (event: 'update:modelValue' | 'update:html' | 'update:json', ...args: any[]) => void,
  reloadbefore: (instance: IDomEditor) => void,
  selector: () => undefined | HTMLDivElement
) {
  const { blurField, changeField = () => {} } = injectFormField()

  let instance: IDomEditor | null = null

  /**
   * 编辑器内容缓存
   */
  const cache = shallowReactive<EditableCache>({
    mval: [],
    json: '',
    html: '',
  })

  /**
   * 判断用户是否 v-model
   */
  const modelMval = computed(() => Array.isArray(mval.value))

  /**
   * 判断用户是否 v-model:json
   */
  const modelJson = computed(() => typeof json.value === 'string')

  /**
   * 判断用户是否 v-model:html
   */
  const modelHtml = computed(() => typeof html.value === 'string')

  const onlyModelHtml = computed(() => !modelMval.value && !modelJson.value && modelHtml.value)

  /**
   * 更新数据，将编辑器内容（json）同步到父组件。实现 v-model + v-model:json。
   */
  function updateMval(e: IDomEditor) {
    // 异步执行时，编辑器可能已销毁重建
    if (e != instance) return
    cache.mval = e.isEmpty() ? [] : e.children
    const jsonStr = cache.mval.length ? JSON.stringify(cache.mval) : ''
    if (cache.json !== jsonStr) {
      cache.json = jsonStr
      emit('update:modelValue', cache.mval)
      if (modelJson.value) emit('update:json', jsonStr)
      changeField()
    }
  }

  /**
   * 更新数据，将编辑器内容（html）同步到父组件。实现 v-model:html。
   */
  function updateJson(e: IDomEditor) {
    // 异步执行时，编辑器可能已销毁重建
    if (e != instance) return
    const jsonStr = e.isEmpty() ? '' : JSON.stringify(e.children)
    if (cache.json !== jsonStr) {
      cache.json = jsonStr
      emit('update:json', jsonStr)
      changeField()
    }
  }

  /**
   * 更新数据，将编辑器内容（html）同步到父组件。实现 v-model:html。
   */
  function updateHtml(e: IDomEditor) {
    // 异步执行时，编辑器可能已销毁重建
    if (e != instance) return
    const html = e.isEmpty() ? '' : e.getHtml()
    if (cache.html !== html) {
      cache.html = html
      emit('update:html', html)
      onlyModelHtml.value && changeField()
    }
  }

  /** 手动更新数据 */
  function executeUpdate(instance: IDomEditor) {
    if (modelMval.value) updateMval(instance)
    else if (modelJson.value) updateJson(instance)

    modelHtml.value && updateHtml(instance)
  }

  /** 封装 change 事件，实现数据 v-model v-model:json 和 v-model:html */
  const changes: ((e: IDomEditor) => void)[] = []

  function watchOptionOnChange() {
    changes.length = 0

    const { delay, config } = option

    if (modelMval.value) changes.push(debounce(updateMval, delay))
    else if (modelJson.value) changes.push(debounce(updateJson, delay))
    modelHtml.value && changes.push(debounce(updateHtml, delay))

    if (config && config.onChange) {
      changes.push(config.onChange)
    }
  }

  const configCallback: Partial<IEditorConfig> = {
    customAlert(info, type) {
      option.config.customAlert?.(info, type)
    },
    onCreated(editor) {
      option.config.onCreated?.(editor)
    },
    onDestroyed(editor) {
      option.config.onDestroyed?.(editor)
    },
    onMaxLength(editor) {
      option.config.onMaxLength?.(editor)
    },
    onFocus(editor) {
      option.config.onFocus?.(editor)
    },
    onBlur(editor) {
      option.config.onBlur?.(editor)
    },
    onChange(editor) {
      changes.forEach((change) => change(editor))
    },
  }
  if (typeof blurField === 'function') {
    configCallback.onBlur = function (editor) {
      blurField()
      option.config.onBlur?.(editor)
    }
  }

  /**
   * 初始化编辑器
   */
  function initialize() {
    const elem = selector()

    if (!elem) return

    if (instance) {
      // 强制更新数据，避免数据丢失
      executeUpdate(instance)

      // 发布 reloadbefore 事件
      reloadbefore(instance)
      instance.destroy()
      instance = null
    } else {
      watchOptionOnChange()
    }

    // 解除 vue 副作用，否则将意外不断
    const { mode, config, defaultContent, defaultHtml, extendCache } = toRaw(option)

    const temp = {
      selector: elem,
      mode: mode ?? 'default',
      config: {
        ...config,
        ...configCallback,
      },
    }

    let content = ''
    let htmltemp = ''
    // debugger

    if (extendCache) {
      if (cache.json.length > 2) {
        content = cache.json
      } else if (cache.html) {
        htmltemp = cache.html
      } else {
        if (defaultContent) {
          content = Array.isArray(defaultContent) ? JSON.stringify(defaultContent) : defaultContent
        }
        if (content.length < 3 && typeof defaultHtml === 'string') {
          htmltemp = defaultHtml
        }
      }
    } else {
      if (defaultContent) {
        content = Array.isArray(defaultContent) ? JSON.stringify(defaultContent) : defaultContent
      }
      if (content.length < 3) {
        if (typeof defaultHtml === 'string' && defaultHtml.length) {
          htmltemp = defaultHtml
        } else {
          if (cache.json.length > 2) {
            content = cache.json
          } else if (cache.html) {
            htmltemp = cache.html
          }
        }
      }
    }

    try {
      const jsono = JSON.parse(content)
      if (jsono.length) {
        instance = createEditor({ ...temp, content: jsono })
      }
    } catch (e) {
    } finally {
      if (!instance) instance = createEditor({ ...temp, html: htmltemp })
    }

    if (!instance.isEmpty()) {
      if (modelMval.value) {
        updateMval(instance)
      } else if (modelJson.value) {
        updateJson(instance)
      }
      modelHtml.value && updateHtml(instance)
    }

    return instance
  }

  /**
   * 清除组件中的富文本内容和缓存
   */
  function clearContent() {
    // 如果不进行只读模式拦截，那么只需时将报错
    // 只读模式 || 为初始 || 无内容
    if (option.config.readOnly || !instance || instance.isEmpty()) return

    instance.clear()

    // 强制进行数据同步，避免延迟机制导致数据异常
    executeUpdate(instance)
  }

  const reload = injectEditor(option, initialize, clearContent)

  onMounted(reload)

  onBeforeUnmount(() => {
    if (instance) {
      // 强制进行数据更新，避免延迟机制导致数据丢失
      executeUpdate(instance)

      instance.blur()
      setTimeout(() => {
        instance?.destroy()
        instance = null
      }, 1000)
    }
  })

  function watchOptionReload() {
    // 编辑器变更会自动更新 toolbar
    const toolbar = EDITABLE_TOOLBAR.get(option)
    toolbar && setTimer(toolbar)
    setTimer(option, reload)
  }

  // 编辑器支持重载的配置项
  watch(() => option.mode, watchOptionReload)
  watch(() => option.config.maxLength, watchOptionReload)
  watch(() => option.config.customPaste, watchOptionReload)
  watch(() => option.config.hoverbarKeys, watchOptionReload, { deep: true })

  // 监听 v-model
  watch(
    mval,
    () => {
      if (!modelMval.value) return

      const value = unref(mval)!

      const jsonStr = JSON.stringify(value)
      if (jsonStr === cache.json) return

      if (instance) {
        instance.clear()
        instance.insertFragment(value)
      } else {
        cache.mval = value
        cache.json = jsonStr
      }
    },
    { immediate: true }
  )

  // v-model:json
  watch(
    json,
    () => {
      // 以 v-model 为主，无 v-model 时才会继续操作
      if (modelMval.value) return

      const jsonStr = unref(json) || ''
      if (jsonStr === cache.json) return

      try {
        const temp = jsonStr.length > 2 ? JSON.parse(jsonStr) : []

        if (instance) {
          instance.clear()
          instance.insertFragment(temp)
        } else {
          cache.json = jsonStr
        }
      } catch (e) {
        console.error(Error(`v-model:json's value is not a json string!`))
      }
    },
    { immediate: true }
  )

  // v-model:html
  watch(
    html,
    () => {
      // 以 v-model/v-model:json 为主，无 v-model/v-model:json 时才会继续操作
      if (!onlyModelHtml.value) return

      const value = unref(html)!

      if (!modelHtml.value || value === cache.html) return

      if (instance) {
        instance.clear()
        instance.dangerouslyInsertHtml(value)
      } else {
        cache.html = value
      }
    },
    { immediate: true }
  )

  // 监听 v-model 延迟
  watch(() => option.delay, watchOptionOnChange)

  // readOnly
  watch(
    () => option.config.readOnly,
    (nv) => instance && (nv ? instance.disable() : instance.enable())
  )

  // placeholder
  watch(
    () => option.config.placeholder,
    (nv) => {
      const elem = selector()

      const target = elem?.querySelector('.w-e-text-placeholder')
      if (target instanceof HTMLElement) target.innerText = nv ?? ''
    }
  )

  // scroll
  watch(
    () => option.config.scroll,
    (nv) => {
      const elem = selector()

      const target = elem?.querySelector('.w-e-scroll')
      if (target instanceof HTMLElement) target.style.overflowY = nv ? 'auto' : ''
    }
  )
}

/**
 * vue hook，用于实现编辑器配置项的动态绑定
 * @param {Object} editableOption 编辑器主体部分的配置
 * @param {Object} toolbarOption 菜单栏配置
 * @param {Number} reloadDelay 防抖时长，用于重载的延迟控制，单位：毫秒
 */
export function useWangEditor(
  editableOption: EditableOption | null = null,
  toolbarOption: ToolbarOption | null = null,
  reloadDelay: number = DELAY.RELOAD
) {
  const editable = reactive<Required<EditableOption>>({
    mode: 'default',
    defaultContent: null,
    defaultHtml: null,
    config: {},
    delay: DELAY.UPDATE,
    extendCache: true,
    ...(isProxy(editableOption) ? toRaw(editableOption) : editableOption), // 配置项可能被复用，解除与之前依赖的关联
  })

  const toolbar = reactive<Required<ToolbarOption>>({
    mode: 'default',
    config: {},
    ...(isProxy(toolbarOption) ? toRaw(toolbarOption) : toolbarOption), // 配置项可能被复用，解除与之前依赖的关联
  })

  EDITABLE_TOOLBAR.set(editable, toolbar)
  TOOLBAR_EDITABLE.set(toolbar, editable)
  TIMER.set(editable, [reloadDelay, null])
  TIMER.set(toolbar, [reloadDelay, null])

  /**
   * 获取编辑器实例
   */
  function getEditable() {
    return EDITABLE_HANDLE.get(editable)?.instance
  }

  /**
   * 获取菜单栏实例
   */
  function getToolbar() {
    return TOOLBAR_HANDLE.get(toolbar)?.instance
  }

  /**
   * 清除富文本内容缓存
   */
  function clearContent() {
    EDITABLE_HANDLE.get(editable)?.clearContent?.()
  }

  /**
   * 重载编辑器（销毁重建)
   */
  function reloadEditor() {
    const reload = EDITABLE_HANDLE.get(editable)?.reload
    if (reload) {
      setTimer(toolbar)
      setTimer(editable)
      reload()
    }
  }

  return { editable, toolbar, getEditable, getToolbar, clearContent, reloadEditor }
}