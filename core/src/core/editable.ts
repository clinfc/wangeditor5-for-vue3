import {
  createEditor,
  IDomEditor,
  IEditorConfig,
  SlateDescendant,
  SlateEditor,
  SlateTransforms
} from '@wangeditor/editor'
import debounce from 'lodash.debounce'
import {
  computed,
  defineComponent,
  ExtractPropTypes,
  h,
  InjectionKey,
  nextTick,
  onBeforeUnmount,
  onMounted,
  PropType,
  Ref,
  ref,
  shallowReactive,
  toRaw,
  toRef,
  watch,
  watchEffect
} from 'vue'
import { useWeContent } from './hooks'
import { Nullish, WeCache, WeEditableCache, WeEditableReloadEvent, WeInjectContent, WeInstance } from './types'
import { withInstall, is } from './utils'

export const EditableProps = {
  handle: {
    type: Symbol as PropType<InjectionKey<WeInjectContent>>,
    required: true
  },
  json: {
    type: [Array, String] as unknown as PropType<SlateDescendant[] | string>
  },
  // v-model:json.string
  jsonModifiers: {
    default: () => ({ string: false })
  },
  html: {
    type: String
  }
} as const

export type WeEditableProps = ExtractPropTypes<typeof EditableProps>

export const EditableEmits = ['reload', 'reloaded', 'update:json', 'update:html'] as const

const Editable = defineComponent({
  name: 'WeEditable',
  props: EditableProps,
  emits: [...EditableEmits],
  setup(props, { emit, expose }) {
    const rootRef = ref() as Ref<HTMLDivElement>

    const content = shallowReactive<WeEditableCache>({
      json: [],
      jstr: '',
      html: ''
    })

    const modelJson = computed(() => {
      const { json } = props
      if (is(json, 'array')) return true
      if (is(json, 'string')) return true
      return false
    })

    const modelJstr = computed(() => modelJson.value && props.jsonModifiers.string)

    const modelHtml = computed(() => is(props.html, 'string'))

    const { cache, opts, instance, globalAttrs, formFieldInit } = useWeContent(props.handle)

    const formField = formFieldInit()

    /**
     * 生成 reload/reloaded 事件传递的数据
     */
    function createEvent(): WeEditableReloadEvent {
      return {
        type: 'editable',
        instance: instance.editable!
      }
    }

    /**
     * 菜单编辑区
     * @param dispatch 是否需要触发 reload 事件。组件卸载时的销毁不需要触发 reload 事件
     * @return 是否需要触发 reloaded 事件
     */
    function destory(dispatch?: boolean): boolean {
      if (!instance.editable) return false
      syncContent()

      dispatch && emit('reload', createEvent())

      instance.editable.destroy()
      instance.editable = null
      return true
    }

    /** 封装 change 事件，实现数据 v-model v-model:json 和 v-model:html */
    const changes: ((e: IDomEditor) => void)[] = []

    watchEffect(() => {
      changes.length = 0

      if (modelJson.value || modelHtml.value) {
        const { delay } = opts.editable

        changes.push(delay > 0 ? debounce(syncContent, delay) : syncContent)
      }

      const { onChange } = opts.editable.config

      is(onChange, 'function') && changes.push(onChange)
    })

    /**
     * 生成编辑区初始化所需的配置对象
     */
    function createOption() {
      const { mode, config, defaultContent, extendCache } = toRaw(opts).editable

      const option = {
        selector: rootRef.value,
        mode: mode ?? 'default',
        config: Object.assign({}, config, {
          customAlert(info, type) {
            opts.editable.config.customAlert?.(info, type)
          },
          onCreated(editor) {
            opts.editable.config.onCreated?.(editor)
          },
          onDestroyed(editor) {
            opts.editable.config.onDestroyed?.(editor)
          },
          onMaxLength(editor) {
            opts.editable.config.onMaxLength?.(editor)
          },
          onFocus(editor) {
            opts.editable.config.onFocus?.(editor)
          },
          onBlur(editor) {
            opts.editable.config.onBlur?.(editor)
            formField.blur()
          },
          onChange(editor) {
            nextTick(() => changes.forEach((change) => change(editor)))
          }
        } as Partial<IEditorConfig>)
      }

      let data = ''

      if (extendCache) {
        data =
          content.jstr.length > 2
            ? content.jstr
            : Array.isArray(defaultContent)
            ? JSON.stringify(defaultContent)
            : defaultContent ?? ''
      } else {
        data = Array.isArray(defaultContent) ? JSON.stringify(defaultContent) : defaultContent ?? content.jstr
      }

      try {
        const json = JSON.parse(data)
        return { content: json, ...option }
      } catch (e) {
        return { html: data, ...option }
      }
    }

    const editable: Nullish<WeCache['editable']> = {
      timer: null,
      create() {
        if (!rootRef.value) return

        const dispatch = destory(true)

        instance.editable = createEditor(createOption())

        syncContent()

        dispatch && emit('reloaded', createEvent())

        if (cache.toolbar?.timer) clearTimeout(cache.toolbar.timer)
        cache.toolbar?.create()
      },
      throttle() {
        if (editable.timer) clearTimeout(editable.timer)

        editable.timer = setTimeout(() => {
          editable.timer = null
          editable.create()
        }, opts.reloadDelay) as unknown as number
      }
    }

    Object.assign(cache, {
      editable,
      clearContent,
      syncContent
    })

    const { create, throttle } = editable

    onMounted(create)
    onBeforeUnmount(destory)

    /**
     * 设置 v-model 数据
     * @param inst 编辑器实例
     * @param insert 执行插入操作
     */
    function setContent(inst: IDomEditor, insert: Function) {
      const focus = inst.isFocused()
      const disable = opts.editable.config.readOnly
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

    // 监听 v-model:json
    watch(
      () => props.json,
      (json) => {
        if (!modelJson.value) return

        const value = toRaw(json)!

        if (value === content.json || value === content.jstr) return

        let jstr = is(value, 'array') ? JSON.stringify(value) : value

        if (jstr === content.jstr) return

        try {
          json = JSON.parse(jstr)
        } catch (e) {
          json = []
          jstr = ''
          console.error(
            Error(`v-model:json${modelJstr.value ? '.string' : ''}'s value is not a json string or object!`)
          )
        }

        const { editable: inst } = instance

        if (inst) {
          setContent(inst, () => inst.insertFragment(json as Array<any>))
        } else {
          Object.assign(content, { json, jstr })
        }
      },
      { immediate: true, deep: true }
    )

    // v-model:html
    watch(
      () => props.html,
      (html) => {
        // 以 v-model:json 为主，无 v-model:json 时才会继续操作
        if (modelJson.value || !modelHtml.value) return

        html = html ?? ''

        if (content.html === html) return

        const { editable: inst } = instance

        if (inst) {
          setContent(inst, () => {
            // @ts-ignore
            SlateTransforms.setNodes(inst!, { type: 'paragraph' }, { mode: 'highest' })
            inst.dangerouslyInsertHtml(html as string)
          })
        } else {
          content.html = html
        }
      },
      { immediate: true }
    )

    // 编辑器支持重载的配置项
    watch(() => opts.editable.mode, throttle)
    watch(() => opts.editable.config.maxLength, throttle)
    watch(() => opts.editable.config.decorate, throttle)
    watch(() => opts.editable.config.customPaste, throttle)
    watch(() => opts.editable.config.hoverbarKeys, throttle, { deep: true })
    watch(() => opts.editable.config.MENU_CONF, throttle, { deep: true })
    watch(() => opts.editable.config.EXTEND_CONF, throttle, { deep: true })

    // readOnly
    watch(
      () => opts.editable.config.readOnly,
      (nv) => {
        const { editable: inst } = instance
        inst && (nv ? inst.disable() : inst.enable())
      }
    )

    // placeholder
    watch(
      () => opts.editable.config.placeholder,
      (nv) => {
        const target = rootRef.value?.querySelector('.w-e-text-placeholder')
        if (target instanceof HTMLElement) target.innerHTML = nv ?? ''
      }
    )

    // scroll
    watch(
      () => opts.editable.config.scroll,
      (nv) => {
        const target = rootRef.value?.querySelector('.w-e-scroll')
        if (target instanceof HTMLElement) target.style.overflowY = nv ? 'auto' : ''
      }
    )

    /**
     * 更新数据，将编辑器内容同步到父组件。
     */
    function syncContent() {
      if (!modelJson.value && !modelHtml.value) return

      const { editable: inst } = instance
      if (!inst) return

      content.json = inst.isEmpty() ? [] : inst.children
      const { json, jstr: oldJstr } = content
      const jstr = json.length ? JSON.stringify(json) : ''

      if (oldJstr === jstr) return

      Object.assign(content, { json, jstr })

      if (modelJstr.value) {
        emit('update:json', jstr)
      } else if (modelJson.value) {
        emit('update:json', json)
      }

      if (modelHtml.value) {
        content.html = inst.isEmpty() ? '' : inst.getHtml()
        emit('update:html', content.html)
      }

      formField.change()
    }

    /**
     * 清除组件中的富文本内容和缓存
     */
    function clearContent() {
      const { editable: inst } = instance

      // 为初始 || 无内容
      if (!inst || inst.isEmpty()) return

      const disable = inst.isDisabled()

      inst.enable()

      inst.clear()

      disable && inst.disable()

      syncContent()
    }

    expose({ rootRef, modelJson, modelJstr, modelHtml, instance, syncContent, clearContent })

    return {
      rootRef,
      globalAttrs,
      modelJson,
      modelJstr,
      modelHtml,
      content,
      instance,
      syncContent,
      clearContent,
      option: toRef(opts, 'editable')
    }
  },
  render() {
    return h('div', { ref: 'rootRef', ...this.globalAttrs.editable })
  }
})

export type WeEditableExpose = {
  rootRef: HTMLDivElement
  modelJson: boolean
  modelJstr: boolean
  modelHtml: boolean
  instance: WeInstance
  syncContent: () => void
  clearContent: () => void
}

export const WeEditable = withInstall(Editable)
