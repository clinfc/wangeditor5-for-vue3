import { defineComponent, h, PropType } from 'vue'
import { WeToolbar } from './toolbar'
import { WeEditable, WeEditableEmits } from './editable'
import { WeEditableOption, WeToolbarOption } from './types'
import { IDomEditor, SlateDescendant, Toolbar } from '@wangeditor/editor'

/**
 * WeEditor 与 WeEditorPlus 的公共 props
 */
export const WeEditorProps = {
  toolbarOption: {
    type: Object as PropType<Required<WeToolbarOption>>,
    required: true,
  },
  /** 编辑器初始化的配置 */
  editableOption: {
    type: Object as PropType<Required<WeEditableOption>>,
    required: true,
  },
  toolbarReloadbefore: {
    type: Function as PropType<(inst: Toolbar) => void>,
    default: () => () => {},
  },
  editableReloadbefore: {
    type: Function as PropType<(editor: IDomEditor) => void>,
    default: () => () => {},
  },
  /**
   * 自定义菜单栏 class
   */
  toolbarClass: [String, Object, Array] as PropType<string | object | any[]>,
  /**
   * 自定义编辑区 class
   */
  editableClass: [String, Object, Array] as PropType<string | object | any[]>,
  /**
   * 自定义菜单栏 style
   */
  toolbarStyle: [String, Object, Array] as PropType<string | object | any[]>,
  /**
   * 自定义编辑区 style
   */
  editableStyle: [String, Object, Array] as PropType<string | object | any[]>,
  /**
   * v-model
   */
  modelValue: Array as PropType<SlateDescendant[]>,
  /**
   * v-model:html
   */
  html: String,
  /**
   * v-model:json
   */
  json: String,
} as const

export const WeEditor = defineComponent({
  name: 'WeEditor',
  props: WeEditorProps,
  emits: [...WeEditableEmits],
  render() {
    return h('div', [
      h(WeToolbar, {
        option: this.toolbarOption,
        class: this.toolbarClass,
        style: this.toolbarStyle,
        reloadbefore: this.toolbarReloadbefore,
      }),
      h(WeEditable, {
        option: this.editableOption,
        class: this.editableClass,
        style: this.editableStyle,
        modelValue: this.modelValue,
        json: this.json,
        html: this.html,
        reloadbefore: this.editableReloadbefore,
        'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value),
        'onUpdate:json': (value) => this.$emit('update:json', value),
        'onUpdate:html': (value) => this.$emit('update:html', value),
      }),
    ])
  },
})
