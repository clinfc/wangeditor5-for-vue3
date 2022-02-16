import { IDomEditor } from '@wangeditor/editor'
import { Descendant } from 'slate'
import { defineComponent, h, PropType, Ref, ref, toRef } from 'vue'
import { editableSetup } from './core'
import { DELAY, EditableOption } from './types'

/**
 * 编辑器
 */
export const WeEditable = defineComponent({
  name: 'WeEditable',
  props: {
    /** 编辑器初始化的配置 */
    option: {
      type: Object as PropType<Required<EditableOption>>,
      default: () => ({
        mode: 'default',
        config: {},
        delay: DELAY.UPDATE,
        defaultContent: null,
        extendCache: true,
      }),
    },
    reloadbefore: {
      type: Function as PropType<(editor: IDomEditor) => void>,
      default: () => () => {},
    },
    /** v-model */
    modelValue: Array as PropType<Descendant[]>,
    /** v-model:html */
    html: String,
    /** v-model:json */
    json: String,
  },
  emits: ['update:modelValue', 'update:html', 'update:json', 'reloadbefore'],
  setup(props, { emit }) {
    const elem = ref<any>(null) as Ref<HTMLDivElement>
    const mval = toRef(props, 'modelValue')
    const html = toRef(props, 'html')
    const json = toRef(props, 'json')

    editableSetup(props.option, mval, json, html, emit, props.reloadbefore, () => elem.value)

    return { elem }
  },
  render() {
    return h('div', { ref: 'elem' })
  },
})
