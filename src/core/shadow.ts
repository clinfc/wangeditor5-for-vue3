import { IDomEditor, Toolbar } from '@wangeditor/editor'
import { Descendant } from 'slate'
import { defineComponent, h, onMounted, PropType, Ref, ref, toRef, watch } from 'vue'
import { editableSetup, toolbarSetup } from './core'
import { CssRuleList, CssRuleMap, DELAY, EditableOption, ToolbarOption } from './types'

const SHEETS: CSSStyleSheet[] = []
const STYLES: string[] = []

function cssText(css: string) {
  return /.+\.css$/.test(css) ? `@import url("${css}");` : css
}

export function shadowCssRule(css: string) {
  css = cssText(css)
  if ('adoptedStyleSheets' in document) {
    const sheet = new CSSStyleSheet()
    // @ts-ignore
    sheet.replaceSync(css)
    SHEETS.push(sheet)
  } else {
    STYLES.push(css)
  }
}

const CUSTOM_ELEMENT_NAME = 'wangeditor-clinfc'

class WangEditorElement extends HTMLElement {
  public elems: {
    container: HTMLDivElement
    toolbar: HTMLDivElement
    editable: HTMLDivElement
  }

  public sheet: CSSStyleSheet | HTMLStyleElement

  public constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })

    const html = `<div class="container"><div class="toolbar"></div><div class="editable"></div></div>`

    if ('adoptedStyleSheets' in shadow) {
      this.sheet = new CSSStyleSheet()
      Reflect.set(shadow, 'adoptedStyleSheets', [...SHEETS, this.sheet])
      shadow.innerHTML = html
    } else {
      shadow.innerHTML = `<style>${STYLES.join('')}</style><style id="sheet"></style>${html}`
      this.sheet = shadow.querySelector('#sheet') as HTMLStyleElement
    }

    this.elems = {
      container: shadow.querySelector('.container')!,
      toolbar: shadow.querySelector('.toolbar')!,
      editable: shadow.querySelector('.editable')!,
    }
  }

  public sheetRule(css: string) {
    css = cssText(css)
    if (this.sheet instanceof HTMLStyleElement) {
      this.sheet.textContent = css
    } else {
      // @ts-ignore
      this.sheet.replaceSync(css)
    }
  }
}

customElements.define(CUSTOM_ELEMENT_NAME, WangEditorElement)

function toLowerCase(str: string) {
  return str.replace(/[A-Z]/g, (char: string, index: number) => {
    return index ? `-${char.toLowerCase()}` : char.toLowerCase()
  })
}

function cssRuleMapToString(css: CssRuleMap) {
  return Object.entries(css)
    .map(([selector, rule]) => {
      const ruleText = Object.entries(rule)
        .map(([k, v]) => `${toLowerCase(k)}:${v};`)
        .join('')
      return `${selector}{${ruleText}}`
    })
    .join('')
}

function cssRuleListToString(list: CssRuleList) {
  if (!Array.isArray(list)) {
    list = [list]
  }
  return list
    .map((item) => {
      if (typeof item === 'string') return cssText(item)
      return cssRuleMapToString(item)
    })
    .join('')
}

export const WeEditor = defineComponent({
  name: 'WeEditor',
  props: {
    toolbarOption: {
      type: Object as PropType<Required<ToolbarOption>>,
      default: () => ({
        mode: 'default',
        config: {},
      }),
    },
    /** 编辑器初始化的配置 */
    editableOption: {
      type: Object as PropType<Required<EditableOption>>,
      default: () => ({
        mode: 'default',
        config: {},
        delay: DELAY.UPDATE,
        defaultContent: null,
        extendCache: true,
      }),
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
    toolbarClass: String,
    /** 自定义编辑区 class */
    editableClass: String,
    /** 自定义菜单栏 style */
    toolbarStyle: String,
    /** 自定义编辑区 style */
    editableStyle: String,
    /** 组件级样式 */
    cssRule: [String, Array, Object] as PropType<CssRuleList>,
    /** v-model */
    modelValue: Array as PropType<Descendant[]>,
    /** v-model:html */
    html: String,
    /** v-model:json */
    json: String,
  },
  setup(props, { emit }) {
    const elem = ref<any>(null) as Ref<WangEditorElement>
    const mval = toRef(props, 'modelValue')
    const html = toRef(props, 'html')
    const json = toRef(props, 'json')

    toolbarSetup(props.toolbarOption, props.toolbarReloadbefore, () => elem.value?.elems.toolbar)

    editableSetup(
      props.editableOption,
      mval,
      json,
      html,
      emit,
      props.editableReloadbefore,
      () => elem.value?.elems.editable
    )

    watch(
      () => props.cssRule,
      () => {
        if (elem.value && props.cssRule !== undefined) elem.value.sheetRule(cssRuleListToString(props.cssRule))
      },
      { deep: true }
    )

    function upclass(target: HTMLDivElement, nv: string | undefined, ov?: string) {
      if (typeof ov === 'string') target.classList.remove(...ov.trim().split(/\s+/))
      if (typeof nv === 'string') target.classList.add(...nv.trim().split(/\s+/))
    }

    watch(
      () => props.editableClass,
      (nv, ov) => {
        if (!elem.value) return
        upclass(elem.value.elems.editable, nv, ov)
      }
    )

    watch(
      () => props.toolbarClass,
      (nv, ov) => {
        if (!elem.value) return
        upclass(elem.value.elems.toolbar, nv, ov)
      }
    )

    function upstyle(target: HTMLDivElement, value: string | undefined) {
      if (typeof value === 'string') target.setAttribute('style', value)
      else target.removeAttribute('style')
    }

    watch(
      () => props.editableStyle,
      (nv) => {
        if (!elem.value) return
        upstyle(elem.value.elems.editable, nv)
      }
    )

    watch(
      () => props.toolbarStyle,
      (nv) => {
        if (!elem.value) return
        upstyle(elem.value.elems.toolbar, nv)
      }
    )

    onMounted(() => {
      if (props.cssRule) elem.value.sheetRule(cssRuleListToString(props.cssRule))
      upclass(elem.value.elems.toolbar, props.toolbarClass)
      upclass(elem.value.elems.editable, props.editableClass)
      upstyle(elem.value.elems.toolbar, props.toolbarStyle)
      upstyle(elem.value.elems.editable, props.editableStyle)
    })

    return { elem }
  },
  render() {
    return h(CUSTOM_ELEMENT_NAME, { ref: 'elem' })
  },
})
