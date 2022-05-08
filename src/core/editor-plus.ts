import { defineComponent, h, onMounted, PropType, Ref, ref, watch, render, onBeforeUnmount, toRefs } from 'vue'
import { WeCssRuleList, WeCssRuleMap } from './types'
import { editableSetup, WeEditableEmits } from './editable'
import { WeEditorProps } from './editor'
import { toolbarSetup } from './toolbar'

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
  props: {
    /** 菜单栏与编辑区公共父容器的 class */
    containerClass: [String, Object, Array],
    /** 菜单栏与编辑区公共父容器的 style */
    containerStyle: [String, Object, Array],
    /** 组件级样式 */
    cssRule: [String, Array, Object] as PropType<WeCssRuleList>,
    ...WeEditorProps,
  },
  emits: [...WeEditableEmits],
  setup(props, { emit }) {
    const selem = ref<any>(null) as Ref<HTMLDivElement> // 开启 shadow 的元素
    const celem = ref<any>(null) as Ref<HTMLDivElement> // 编辑器的公共父节点
    const telem = ref<any>(null) as Ref<HTMLDivElement> // 菜单栏节点
    const eelem = ref<any>(null) as Ref<HTMLDivElement> // 编辑区节点

    const { toolbarOption, toolbarReloadbefore, editableOption, editableReloadbefore, modelValue, json, html } =
      toRefs(props)

    const sheet = document.createElement('style')

    watch(
      () => props.cssRule,
      (list) => {
        sheet.textContent = list ? cssRuleListToString(list) : ''
      },
      { deep: true, immediate: true }
    )

    onMounted(() => {
      const shadow = selem.value.attachShadow({ mode: 'open' })
      shadow.innerHTML = `<style>${GLOBAL_STYLES}</style>`
      shadow.append(sheet)
      shadow.append(celem.value)

      toolbarSetup(telem, toolbarOption, toolbarReloadbefore)
      editableSetup(eelem, editableOption, editableReloadbefore, modelValue, json, html, emit)()
    })

    return { selem, celem, telem, eelem }
  },
  render() {
    return h(
      'div',
      { ref: 'selem' },
      h('div', { ref: 'celem', class: this.containerClass, style: this.containerStyle }, [
        h('div', { ref: 'telem', class: this.toolbarClass, style: this.toolbarStyle }),
        h('div', { ref: 'eelem', class: this.editableClass, style: this.editableStyle }),
      ])
    )
  },
})
