import { createToolbar, IDomEditor, Toolbar } from '@wangeditor/editor'
import { defineComponent, h, markRaw, onBeforeUnmount, onMounted, PropType, ref, Ref, watch } from 'vue'
import { injectToolbar, setTimer, TIMER, TOOLBAR_EDITABLE } from './core'
import { WeToolbarOption } from './types'

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

    let instance: Toolbar | null = null

    function initialize(editor: IDomEditor) {
      if (!elem.value) return

      if (instance) {
        props.reloadbefore(instance)
        instance.destroy()
        delete elem.value.dataset.wEToolbar
      }

      instance = createToolbar({ ...props.option, editor, selector: elem.value })

      props.option.markRaw && markRaw(instance)

      return instance
    }

    const reload = injectToolbar(props.option, initialize)

    watch(
      () => props.option,
      () => {
        const editable = TOOLBAR_EDITABLE.get(props.option)

        // 编辑器变更会自动更新 toolbar
        if (!editable || TIMER.get(editable)?.[1] !== null) return

        setTimer(props.option, reload)
      },
      { deep: true }
    )

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
