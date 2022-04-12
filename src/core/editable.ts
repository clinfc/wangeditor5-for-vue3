import {
  createEditor,
  IDomEditor,
  IEditorConfig,
  SlateDescendant,
  SlateEditor,
  SlateTransforms,
} from '@wangeditor/editor'
import debounce from 'lodash.debounce'
import {
  computed,
  defineComponent,
  h,
  markRaw,
  onBeforeUnmount,
  onMounted,
  PropType,
  Ref,
  ref,
  shallowReactive,
  toRaw,
  toRef,
  unref,
  watch,
  watchEffect,
} from 'vue'
import { EDITABLE_TOOLBAR, injectEditor, injectFormField, setTimer } from './core'
import { WeEditableCache, WeEditableOption } from './types'

/**
 * 编辑器
 */
export const WeEditable = defineComponent({
  name: 'WeEditable',
  props: {
    /** 编辑器初始化的配置 */
    option: {
      type: Object as PropType<Required<WeEditableOption>>,
      required: true,
    },
    reloadbefore: {
      type: Function as PropType<(editor: IDomEditor) => void>,
      default: () => () => {},
    },
    /** v-model */
    modelValue: Array as PropType<SlateDescendant[]>,
    /** v-model:html */
    html: String,
    /** v-model:json */
    json: String,
  },
  emits: ['update:modelValue', 'update:html', 'update:json'],
  setup(props, { emit }) {
    const elem = ref<any>(null) as Ref<HTMLDivElement>
    const mval = toRef(props, 'modelValue')
    const html = toRef(props, 'html')
    const json = toRef(props, 'json')
    const option = props.option

    const { blurField, changeField = () => {} } = injectFormField()

    let instance: IDomEditor | null = null

    /**
     * 编辑器内容缓存
     */
    const cache = shallowReactive<WeEditableCache>({
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
      if (!e || e != instance) return
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
      if (!e || e != instance) return
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
      if (!e || e != instance) return
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

    watchEffect(() => {
      changes.length = 0

      const delay = option.delay
      const onChange = option.config?.onChange

      if (modelMval.value) changes.push(delay > 0 ? debounce(updateMval, delay) : updateMval)
      else if (modelJson.value) changes.push(delay > 0 ? debounce(updateJson, delay) : updateJson)
      modelHtml.value && changes.push(delay > 0 ? debounce(updateHtml, delay) : updateHtml)

      typeof onChange === 'function' && changes.push(onChange)
    })

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
      if (!elem.value) return

      if (instance) {
        // 强制更新数据，避免数据丢失
        executeUpdate(instance)

        // 发布 reloadbefore 事件
        props.reloadbefore(instance)
        instance.destroy()
        instance = null
      }

      // 解除 vue 副作用，否则将意外不断
      const { mode, config, defaultContent, defaultHtml, extendCache } = toRaw(option)

      const temp = {
        selector: elem.value,
        mode: mode ?? 'default',
        config: {
          ...config,
          ...configCallback,
        },
      }

      let content = ''
      let htmltemp = ''

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

      option.markRaw && markRaw(instance)

      return instance
    }

    /**
     * 清除组件中的富文本内容和缓存
     */
    function clearContent() {
      // 如果不进行只读模式拦截，那么只需时将报错
      // 为初始 || 无内容
      if (!instance || instance.isEmpty()) return

      const disable = instance.isDisabled()

      instance.enable()

      instance.clear()

      disable && instance.disable()

      // 强制进行数据同步，避免延迟机制导致数据异常
      executeUpdate(instance)
    }

    const reload = injectEditor(option, initialize, clearContent, () => executeUpdate(instance!))

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
    watch(() => option.config.decorate, watchOptionReload)
    watch(() => option.config.customPaste, watchOptionReload)
    watch(() => option.config.hoverbarKeys, watchOptionReload, { deep: true })
    watch(() => option.config.MENU_CONF, watchOptionReload, { deep: true })
    watch(() => option.config.EXTEND_CONF, watchOptionReload, { deep: true })

    /**
     * 设置 v-model 数据
     * @param inst 编辑器实例
     * @param insert 执行插入操作
     */
    function model(inst: IDomEditor, insert: Function) {
      const focus = inst.isFocused()
      const disable = option.config.readOnly
      const selection = JSON.stringify(inst.selection)

      disable && inst.enable()
      inst.clear()

      insert()

      if (disable) {
        inst.disable()
      } else if (!focus) {
        inst.blur()
      } else {
        try {
          inst.select(JSON.parse(selection)) // 恢复选区
        } catch (e) {
          inst.select(SlateEditor.start(inst, [])) // 选中开头
        }
      }
    }

    // 监听 v-model
    watch(
      mval,
      () => {
        if (!modelMval.value) return

        const value = unref(mval)!

        if (cache.mval === value) return

        const jsonStr = JSON.stringify(value)
        if (jsonStr === cache.json) return

        if (instance) {
          model(instance, () => instance!.insertFragment(value))
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
          if (instance) {
            const temp = jsonStr.length > 2 ? JSON.parse(jsonStr) : []
            model(instance, () => instance!.insertFragment(temp))
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

        if (value === cache.html) return

        if (instance) {
          model(instance, () => {
            // @ts-ignore
            SlateTransforms.setNodes(instance!, { type: 'paragraph' }, { mode: 'highest' })
            instance!.dangerouslyInsertHtml(value)
          })
        } else {
          cache.html = value
        }
      },
      { immediate: true }
    )

    // readOnly
    watch(
      () => option.config.readOnly,
      (nv) => instance && (nv ? instance.disable() : instance.enable())
    )

    // placeholder
    watch(
      () => option.config.placeholder,
      (nv) => {
        const target = elem.value?.querySelector('.w-e-text-placeholder')
        if (target instanceof HTMLElement) target.innerText = nv ?? ''
      }
    )

    // scroll
    watch(
      () => option.config.scroll,
      (nv) => {
        const target = elem.value?.querySelector('.w-e-scroll')
        if (target instanceof HTMLElement) target.style.overflowY = nv ? 'auto' : ''
      }
    )

    return { elem, cache, modelMval, modelJson, modelHtml }
  },
  render() {
    return h('div', { ref: 'elem' })
  },
})
