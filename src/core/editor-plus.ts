import { IDomEditor, SlateDescendant, Toolbar } from '@wangeditor/editor'
import { defineComponent, h, onBeforeUnmount, onMounted, PropType, Ref, ref, render, watch } from 'vue'
import { WeEditor } from './editor'
import { WeCssRuleList, WeCssRuleMap, WeEditableOption, WeToolbarOption } from './types'

let GLOBAL_STYLES = ''

function cssFileUrl(css: string) {
  return /.+\.css$/.test(css)
}

function cssFullUrl(css: string) {
  return `@import url("${css}");`
}

function toLowerCase(str: string) {
  return str.replace(/[A-Z]/g, (char: string, index: number) => {
    return index ? `-${char.toLowerCase()}` : char.toLowerCase()
  })
}

function cssRuleMapToString(css: WeCssRuleMap) {
  return Object.entries(css)
    .map(([selector, rule]) => {
      const ruleText = Object.entries(rule)
        .map(([k, v]) => `${toLowerCase(k)}:${v};`)
        .join('')
      return `${selector}{${ruleText}}`
    })
    .join('')
}

function cssRuleListToString(list: WeCssRuleList) {
  if (!Array.isArray(list)) {
    list = [list]
  }
  return list
    .map((item) => {
      if (typeof item === 'string') {
        if (cssFileUrl(item)) {
          return cssFullUrl(item)
        }
        return item
      }
      return cssRuleMapToString(item)
    })
    .join('')
}

class WangEditorElement extends HTMLDivElement {
  public sheet!: HTMLStyleElement

  public constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })

    shadow.innerHTML = `<style>${GLOBAL_STYLES}</style><style id="sheet"></style>`

    this.sheet = shadow.querySelector('#sheet')!
  }

  /**
   * 动态修改 css 规则
   * @param list CSS规则
   */
  public sheetRule(list?: WeCssRuleList) {
    this.sheet.textContent = list ? cssRuleListToString(list) : ''
  }
}

const CUSTOM_ELEMENT_NAME = 'wangeditor-clinfc'

customElements.define(CUSTOM_ELEMENT_NAME, WangEditorElement, { extends: 'div' })

/**
 * 将 css 样式注入 shadow 中
 * @param css {String|Array|Object} css 文本或 css 文件路径
 */
export function weEditorPlusCssRule(css: WeCssRuleList) {
  GLOBAL_STYLES = `${GLOBAL_STYLES}${cssRuleListToString(css)}`
}

/**
 * shadow 模式的富文本编辑器
 */
export const WeEditorPlus = defineComponent({
  name: 'WeEditorPlus',
  components: { WeEditor },
  props: {
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
      type: Function as PropType<(toolbar: Toolbar) => void>,
    },
    editableReloadbefore: {
      type: Function as PropType<(editor: IDomEditor) => void>,
    },
    /** 菜单栏与编辑区公共父容器的 class */
    containerClass: [String, Object, Array],
    /** 菜单栏与编辑区公共父容器的 style */
    containerStyle: [String, Object, Array],
    /** 自定义菜单栏 class */
    toolbarClass: [String, Object, Array],
    /** 自定义编辑区 class */
    editableClass: [String, Object, Array],
    /** 自定义菜单栏 style */
    toolbarStyle: [String, Object, Array],
    /** 自定义编辑区 style */
    editableStyle: [String, Object, Array],
    /** 组件级样式 */
    cssRule: [String, Array, Object] as PropType<WeCssRuleList>,
    /** v-model */
    modelValue: Array as PropType<SlateDescendant[]>,
    /** v-model:html */
    html: String,
    /** v-model:json */
    json: String,
  },
  emits: ['update:modelValue', 'update:html', 'update:json'],
  setup(props, { emit }) {
    const elem = ref<any>(null) as Ref<WangEditorElement>

    const container = document.createElement('div')

    watch(
      () => props.cssRule,
      () => {
        if (elem.value) elem.value.sheetRule(props.cssRule)
      },
      { deep: true }
    )

    onMounted(() => {
      elem.value.sheetRule(props.cssRule)

      const editor = h(WeEditor, {
        class: props.containerClass,
        style: props.containerStyle,
        toolbarOption: props.toolbarOption,
        toolbarClass: props.toolbarClass,
        toolbarStyle: props.toolbarStyle,
        toolbarReloadbefore: props.toolbarReloadbefore,
        editableOption: props.editableOption as Required<WeEditableOption>,
        editableClass: props.editableClass,
        editableStyle: props.editableStyle,
        editableReloadbefore: props.editableReloadbefore,
        modelValue: props.modelValue,
        json: props.json,
        html: props.html,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value),
        'onUpdate:json': (value) => emit('update:json', value),
        'onUpdate:html': (value) => emit('update:html', value),
      })

      render(editor, container)

      elem.value.shadowRoot!.appendChild(container.firstElementChild!)
    })

    onBeforeUnmount(() => {
      render(null, container)
    })

    return { elem }
  },
  render() {
    return h('div', { ref: 'elem', is: CUSTOM_ELEMENT_NAME })
  },
})
