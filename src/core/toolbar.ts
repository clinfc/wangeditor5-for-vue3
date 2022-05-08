import { createToolbar, IDomEditor, Toolbar } from '@wangeditor/editor'
import { defineComponent, h, markRaw, onBeforeUnmount, onMounted, PropType, ref, Ref, toRefs, unref, watch } from 'vue'
import { injectToolbar, setTimer, TIMER, TOOLBAR_EDITABLE } from './core'
import { WeToolbarOption } from './types'

export function toolbarSetup(
  container: Ref<HTMLDivElement>,
  option: Ref<Required<WeToolbarOption>>,
  reloadbefore: Ref<(inst: Toolbar) => void>
) {
  let instance: Toolbar | null = null

  function initialize(editor: IDomEditor) {
    if (!container.value) return

    if (instance) {
      reloadbefore.value(instance)
      instance.destroy()
      delete container.value.dataset.wEToolbar
    }

    instance = createToolbar({ ...unref(option), editor, selector: container.value })

    option.value.markRaw && markRaw(instance)

    return instance
  }

  const reload = injectToolbar(option.value, initialize)

  watch(
    option,
    () => {
      const editable = TOOLBAR_EDITABLE.get(option.value)

      // 编辑器变更会自动更新 toolbar
      if (!editable || TIMER.get(editable)?.[1] !== null) return

      setTimer(option.value, reload)
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    instance?.destroy()
    instance = null
  })

  return reload
}

/**
 * 菜单栏
 */
export const WeToolbar = defineComponent({
  name: 'WeToolbar',
  props: {
    option: {
      type: Object as PropType<Required<WeToolbarOption>>,
      required: true,
    },
    reloadbefore: {
      type: Function as PropType<(inst: Toolbar) => void>,
      default: () => () => {},
    },
  },
  setup(props) {
    const elem = ref<any>(null) as Ref<HTMLDivElement>
    const { option, reloadbefore } = toRefs(props)

    onMounted(toolbarSetup(elem, option, reloadbefore))

    return { elem }
  },
  render() {
    return h('div', { ref: 'elem' })
  },
})
