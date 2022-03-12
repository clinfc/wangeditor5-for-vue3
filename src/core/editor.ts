import { IDomEditor, SlateDescendant, Toolbar } from '@wangeditor/editor'
import { defineComponent, h, PropType } from 'vue'
import { WeEditableOption, WeToolbarOption } from './types'
import { WeToolbar } from './toolbar'
import { WeEditable } from './editable'

export const WeEditor = defineComponent({
  name: 'WeEditor',
  props: {
    toolbarOption: {
      type: Object as PropType<WeToolbarOption>,
    },
    /** 编辑器初始化的配置 */
    editableOption: {
      type: Object as PropType<WeEditableOption>,
    },
    toolbarReloadbefore: {
      type: Function as PropType<(toolbar: Toolbar) => void>,
      default: () => () => {},
    },
    editableReloadbefore: {
      type: Function as PropType<(editor: IDomEditor) => void>,
      default: () => () => {},
    },
    /** 自定义菜单栏 class */
    toolbarClass: [String, Object, Array],
    /** 自定义编辑区 class */
    editableClass: [String, Object, Array],
    /** 自定义菜单栏 style */
    toolbarStyle: [String, Object, Array],
    /** 自定义编辑区 style */
    editableStyle: [String, Object, Array],
    /** v-model */
    modelValue: Array as PropType<SlateDescendant[]>,
    /** v-model:html */
    html: String,
    /** v-model:json */
    json: String,
  },
  emits: ['update:modelValue', 'update:html', 'update:json'],
  render() {
    return h('div', [
      h(WeToolbar, {
        option: this.toolbarOption,
        class: this.toolbarClass,
        style: this.toolbarStyle,
        reloadbefore: this.toolbarReloadbefore,
      }),
      h(WeEditable, {
        option: this.editableOption as Required<WeEditableOption>,
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
