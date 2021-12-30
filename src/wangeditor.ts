/**
 * use @wangeditor/editor@^0.13.4 in vue3。
 * @author 翠林 <https://github.com/clinfc>
 * @description 支持动态配置的 wangEditor5 for vue3 组件。
 * @see {@link https://github.com/clinfc/wangeditor5-for-vue3.git|Github}
 */

import debounce from 'lodash.debounce'
import { Descendant } from 'slate'
import { createEditor, createToolbar, IDomEditor, IEditorConfig, IToolbarConfig, Toolbar } from '@wangeditor/editor'
import {
  App,
  defineComponent,
  h,
  isProxy,
  onBeforeUnmount,
  onMounted,
  PropType,
  reactive,
  Ref,
  ref,
  shallowReactive,
  toRaw,
  toRef,
  unref,
  watch,
} from 'vue'

/**
 * 编辑器配置项
 */
export interface EditorEditableOption {
  /** 编辑器模式 */
  mode?: 'default' | 'simple'
  /** 编辑器初始化的默认内容 */
  defaultContent?: Descendant[] | string | null
  /** 编辑器配置 */
  config?: Partial<IEditorConfig>
  /** v-model 数据同步的防抖时长，默认值：3650，单位：毫秒 */
  delay?: number
  /**
   * 编辑器创建时默认内容的优先级排序，默认值：true。
   * true：v-model > v-model:html > defaultContent。
   * false: defaultContent > v-model > v-model:html。
   */
  extendCache?: boolean
}

/**
 * 菜单栏的配置项
 */
export interface EditorToolbarOption {
  mode?: 'default' | 'simple'
  config?: Partial<IToolbarConfig>
}

type EditorEditableReload = () => IDomEditor | undefined

interface EditorEditableHandle {
  instance?: IDomEditor
  reload?: () => void
  /** 清除编辑器内容 */
  clearContent?: () => void
}

type ToolbarReload = (editable: IDomEditor) => Toolbar | undefined

interface ToolbarHandle {
  instance?: Toolbar
  reload?: () => void
}

const EDITOR: WeakMap<EditorEditableOption, EditorEditableHandle> = new WeakMap()

const TOOLBAR: WeakMap<EditorToolbarOption, ToolbarHandle> = new WeakMap()

/** 编辑器 与 Toolbar 间的映射关系 */
const INSTANCE_ET: WeakMap<EditorEditableOption, EditorToolbarOption> = new WeakMap()

/** Toolbar 与 编辑器 间的映射关系 */
const INSTANCE_TE: WeakMap<EditorToolbarOption, EditorEditableOption> = new WeakMap()

/**
 * vue hook，在 EditorEditable 组件中使用
 */
function injectEditor(option: EditorEditableOption, reload: EditorEditableReload, clearContent: () => void) {
  function reset() {
    const instance = reload()
    if (!instance) return

    const temp = EDITOR.get(option)
    if (!temp) {
      EDITOR.set(option, { instance, reload: reset })
    } else {
      temp.instance = instance
    }

    // 自动重载 toolbar
    const toolbar = INSTANCE_ET.get(option)
    if (toolbar) {
      TOOLBAR.get(toolbar)?.reload?.()
    }
  }

  EDITOR.set(option, { clearContent, reload: reset })

  return reset
}

/**
 * vue hook，在 EditorToolbar 组件中使用
 */
function injectToolbar(option: EditorToolbarOption, reload: ToolbarReload) {
  function reset() {
    const editableOptions = INSTANCE_TE.get(option)
    if (!editableOptions) return

    const editable = EDITOR.get(editableOptions)
    if (!editable || !editable.instance) return

    const instance = reload(editable.instance)
    if (!instance) return

    const temp = TOOLBAR.get(option)
    if (!temp) {
      TOOLBAR.set(option, { instance, reload: reset })
    } else {
      temp.instance = instance
    }
  }

  TOOLBAR.set(option, { reload: reset })

  return reset
}

/**
 * 编辑器
 */
export const EditorEditable = defineComponent({
  name: 'EditorEditable',
  props: {
    /** 编辑器初始化的配置 */
    option: {
      type: Object as PropType<Required<EditorEditableOption>>,
      default: () =>
        ({
          mode: 'default',
          config: {},
          delay: 3650,
          defaultContent: null,
          extendCache: true,
        } as Required<EditorEditableOption>),
    },
    /** v-model */
    modelValue: Array as PropType<Descendant[]>,
    /** v-model:html */
    html: String,
  },
  emits: ['update:modelValue', 'update:html', 'reloadbefore'],
  setup(props, { emit }) {
    const elem = ref<any>(null) as Ref<HTMLDivElement>
    const json = toRef(props, 'modelValue')
    const html = toRef(props, 'html')

    let instance: IDomEditor | null = null

    /**
     * 编辑器内容缓存
     */
    const cache = shallowReactive({
      json: [] as Descendant[],
      jsonStr: '[]',
      html: '',
    })

    /**
     * 判断用户是否 v-model:html
     */
    function modelHtml() {
      return typeof html.value === 'string'
    }

    /**
     * 判断用户是否 v-model
     */
    function modelJson() {
      return Array.isArray(json.value)
    }

    /**
     * 更新数据，将编辑器内容（json）同步到父组件。实现 v-model。
     */
    function updateJson(e: IDomEditor) {
      // 异步执行时，编辑器可能已销毁重建
      if (e != instance) return
      cache.json = e.isEmpty() ? [] : e.children
      const jsonStr = JSON.stringify(cache.json)
      if (cache.jsonStr !== jsonStr) {
        cache.jsonStr = jsonStr
        emit('update:modelValue', cache.json)
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
      }
    }

    // 封装 change 事件，实现数据 v-model 和 v-model:html
    const changes: ((e: IDomEditor) => void)[] = []

    function initChangeCallback() {
      changes.length = 0

      const { delay, config } = props.option
      modelJson() && changes.push(debounce(updateJson, delay))
      modelHtml() && changes.push(debounce(updateHtml, delay))
      if (config && config.onChange) {
        changes.push(config.onChange)
      }
    }

    const globalCallback: Partial<IEditorConfig> = {
      customAlert(info, type) {
        props.option.config.customAlert?.(info, type)
      },
      onCreated(editor) {
        props.option.config.onCreated?.(editor)
      },
      onDestroyed(editor) {
        props.option.config.onDestroyed?.(editor)
      },
      onMaxLength(editor) {
        props.option.config.onMaxLength?.(editor)
      },
      onFocus(editor) {
        props.option.config.onFocus?.(editor)
      },
      onBlur(editor) {
        props.option.config.onBlur?.(editor)
      },
      onChange(editor) {
        changes.forEach((change) => change(editor))
      },
    }

    /**
     * 初始化编辑器
     */
    function initialize() {
      if (!elem.value) return

      if (instance) {
        // 强制更新数据，避免数据丢失
        modelJson() && updateJson(instance) // 初始化/clear函数/组件销毁 的使用频率没有数据更新的使用频率高，因此将 modeJson 从 updateJson 中剔除，置于 updateJson 执行前执行。
        modelHtml() && updateHtml(instance) // 初始化/clear函数/组件销毁 的使用频率没有数据更新的使用频率高，因此将 modeHtml 从 updateHtml 中剔除，置于 updateHtml 执行前执行。

        // 发布 reloadbefore 事件
        emit('reloadbefore', instance)
        instance.destroy()
      }

      initChangeCallback()

      // 解除 vue 副作用，否则将意外不断
      const { mode, config, defaultContent, extendCache } = toRaw(props.option)

      const option = {
        selector: elem.value,
        mode: mode ?? 'default',
        config: {
          ...config,
          ...globalCallback,
        },
      }

      let content: EditorEditableOption['defaultContent']

      if (extendCache) {
        content = cache.json.length
          ? cache.json
          : cache.html || (Array.isArray(defaultContent) ? JSON.stringify(defaultContent) : defaultContent)
      } else {
        content = Array.isArray(defaultContent)
          ? JSON.stringify(defaultContent)
          : defaultContent || (cache.json.length ? cache.json : cache.html)
      }

      if (content) {
        if (Array.isArray(content)) {
          instance = createEditor({ ...option, content })
        } else {
          try {
            const json = JSON.parse(content)
            instance = createEditor({ ...option, content: json })
          } catch (error) {
            instance = createEditor(option)
            instance.dangerouslyInsertHtml(content)
          }
        }
        modelJson() && updateJson(instance)
        modelHtml() && updateHtml(instance)
        return instance
      }

      instance = createEditor(option)
      return instance
    }

    /**
     * 清除组件中的富文本内容和缓存
     */
    function clearContent() {
      if (!instance || instance.isEmpty()) return
      instance.clear()
      // debugger
      // 强制进行数据同步，避免延迟机制导致数据异常
      modelJson() && updateJson(instance)
      modelHtml() && updateHtml(instance)
    }

    const reload = injectEditor(props.option, initialize, clearContent)

    onMounted(reload)

    onBeforeUnmount(() => {
      if (instance) {
        // 强制进行数据更新，避免延迟机制导致数据丢失
        modelJson() && updateJson(instance)
        modelHtml() && updateHtml(instance)
        instance.blur()
        setTimeout(() => {
          instance?.destroy()
          instance = null
        }, 1000)
      }
    })

    // 监听 v-model
    watch(
      json,
      () => {
        if (!modelJson()) return

        const value = unref(json)!

        const jsonStr = JSON.stringify(value)
        if (jsonStr === cache.jsonStr) return

        if (!instance) {
          cache.json = value
          cache.jsonStr = jsonStr
          return
        }

        instance.select([])
        instance.deleteFragment()
        instance.insertFragment(value)
      },
      { immediate: true }
    )

    // 监听 v-model:html
    watch(
      html,
      () => {
        // 以 v-model 为主，无 v-model 时才会继续操作
        if (modelJson()) return

        const value = unref(html)!

        if (!modelHtml() || value === cache.html) return

        if (!instance) {
          cache.html = value
          return
        }

        instance.select([])
        instance.deleteFragment()
        instance.dangerouslyInsertHtml(value)
      },
      { immediate: true }
    )

    // 监听 v-model 延迟
    watch(() => props.option.delay, initChangeCallback)

    // readOnly
    watch(
      () => props.option.config.readOnly,
      (nv) => {
        if (instance) nv ? instance.disable() : instance.enable()
      }
    )

    // placeholder
    watch(
      () => props.option.config.placeholder,
      (nv) => {
        const target = elem.value?.querySelector('.w-e-text-placeholder')
        if (target instanceof HTMLElement) target.innerText = nv ?? ''
      }
    )

    // scroll
    watch(
      () => props.option.config.scroll,
      (nv) => {
        const target = elem.value?.querySelector('.w-e-scroll')
        if (target instanceof HTMLElement) target.style.overflowY = nv ? 'auto' : ''
      }
    )

    return { elem }
  },
  render() {
    return h('div', { ref: 'elem' })
  },
})

/**
 * 菜单栏
 */
export const EditorToolbar = defineComponent({
  name: 'EditorToolbar',
  props: {
    option: {
      type: Object as PropType<EditorToolbarOption>,
      default: () => ({}),
    },
  },
  emits: ['reloadbefore'],
  setup(props, { emit }) {
    const elem = ref<any>(null) as Ref<HTMLDivElement>

    let instance: Toolbar | null = null

    function initialize(editor: IDomEditor) {
      if (!elem.value) return

      if (instance) {
        emit('reloadbefore', instance)
        instance.destroy()
        delete elem.value.dataset.wEToolbar
      }

      instance = createToolbar({ ...props.option, editor, selector: elem.value })

      return instance
    }

    const reload = injectToolbar(props.option, initialize)

    onMounted(reload)

    onBeforeUnmount(() => {
      instance?.destroy()
      instance = null
    })

    return { elem }
  },
  render() {
    return h('div', { ref: 'elem' })
  },
})

/**
 * vue hook，用于实现编辑器配置项的动态绑定
 * @param {Object} editableOption 编辑器主体部分的配置
 * @param {Object} toolbarOption 菜单栏配置
 * @param {Number} reloadDelay 防抖时长，用于重载的延迟控制，单位：毫秒
 */
export function useWangEditor(
  editableOption: EditorEditableOption | null = null,
  toolbarOption: EditorToolbarOption | null = null,
  reloadDelay: number = 365
) {
  const editable = reactive<Required<EditorEditableOption>>({
    mode: 'default',
    defaultContent: null,
    config: {},
    delay: 3650,
    extendCache: true,
    ...(isProxy(editableOption) ? toRaw(editableOption) : editableOption), // 配置项可能被复用，解除与之前依赖的关联
  })

  const toolbar = reactive<Required<EditorToolbarOption>>({
    mode: 'default',
    config: {},
    ...(isProxy(toolbarOption) ? toRaw(toolbarOption) : toolbarOption), // 配置项可能被复用，解除与之前依赖的关联
  })

  INSTANCE_ET.set(editable, toolbar)
  INSTANCE_TE.set(toolbar, editable)

  const timer = {
    editable: null as null | NodeJS.Timeout,
    toolbar: null as null | NodeJS.Timeout,
  }

  function clearTimer(type: 'editable' | 'toolbar') {
    if (timer[type]) {
      clearTimeout(timer[type]!)
      timer[type] = null
    }
  }

  function editableChange() {
    // 编辑器变更会自动更新 toolbar
    clearTimer('toolbar')
    clearTimer('editable')

    // 节流处理
    timer.editable = setTimeout(() => {
      clearTimer('toolbar')
      timer.editable = null

      EDITOR.get(editable)?.reload?.()
    }, reloadDelay)
  }

  /** 编辑器支持重载的配置项 */
  const targets = [
    () => editable.mode,
    () => editable.config.hoverbarKeys,
    () => editable.config.maxLength,
    () => editable.config.customPaste,
  ]

  targets.forEach((target) => {
    watch(target, editableChange)
  })

  watch(
    () => toolbar,
    () => {
      // 编辑器变更会自动更新 toolbar
      if (timer.editable) return

      clearTimer('toolbar')

      // 节流处理
      timer.toolbar = setTimeout(() => {
        timer.toolbar = null
        TOOLBAR.get(toolbar)?.reload?.()
      }, reloadDelay)
    },
    { deep: true }
  )

  /**
   * 获取编辑器实例
   */
  function getEditable() {
    return EDITOR.get(editable)?.instance
  }

  /**
   * 获取菜单栏实例
   */
  function getToolbar() {
    return TOOLBAR.get(toolbar)?.instance
  }

  /**
   * 清除富文本内容缓存
   */
  function clearContent() {
    EDITOR.get(editable)?.clearContent?.()
  }

  /**
   * 重载编辑器（销毁重建)
   */
  function reloadEditor() {
    const reload = EDITOR.get(editable)?.reload
    if (reload) {
      clearTimer('toolbar')
      clearTimer('editable')
      reload()
    }
  }

  return { editable, toolbar, getEditable, getToolbar, clearContent, reloadEditor }
}

/**
 * 全局注册 EditorToolbar 和 EditorEditable 组件。
 * @param {Object} app vue实例
 * @example
 *  import App from './App.vue'
 *  import { createApp } from 'vue'
 *  createApp(App).use(wangeditor)
 */
export default function wangeditor(app: App) {
  app.component(EditorToolbar.name, EditorToolbar)
  app.component(EditorEditable.name, EditorEditable)
}
