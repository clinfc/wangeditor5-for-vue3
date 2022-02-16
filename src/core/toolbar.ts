import { Toolbar } from '@wangeditor/editor'
import { defineComponent, h, PropType, Ref, ref } from 'vue'
import { toolbarSetup } from './core'
import { ToolbarOption } from './types'

/**
 * 菜单栏
 */
export const WeToolbar = defineComponent({
  name: 'WeToolbar',
  props: {
    option: {
      type: Object as PropType<Required<ToolbarOption>>,
      default: () => ({
        mode: 'default',
        config: {},
      }),
    },
    reloadbefore: {
      type: Function as PropType<(editor: Toolbar) => void>,
      default: () => () => {},
    },
  },
  setup(props) {
    const elem = ref<any>(null) as Ref<HTMLDivElement>

    toolbarSetup(props.option, props.reloadbefore, () => elem.value)

    return { elem }
  },
  render() {
    return h('div', { ref: 'elem' })
  },
})
