import { IDomEditor, Toolbar } from '@wangeditor/editor'
import { Descendant } from 'slate'
import { defineComponent, h, onBeforeUnmount, onMounted, PropType, Ref, ref, render, watch } from 'vue'
import { WeEditor } from './editor'
import { WeCssRuleList, WeCssRuleMap, WeEditableOption, WeToolbarOption } from './types'

let STYLES: string = ''
let IMPORT: string = ''
const SHEETS: CSSStyleSheet[] = []

const CSS_IMPORT_REG = /\@import url\(.+\.css\);/g

function cssFileUrl(css: string) {
  return /.+\.css$/.test(css)
}

function cssFullUrl(css: string) {
  return `@import url("${css}");`
}

function processCSSText(css: string) {
  const text: string[] = []
  const url: string[] = []
  let onlyUrl = false
  if (cssFileUrl(css)) {
    url.push(cssFullUrl(css))
    onlyUrl = true
  } else {
    css = css
      .replace(CSS_IMPORT_REG, function (text) {
        url.push(text)
        return ''
      })
      .trim()
    css.length > 3 && text.push(css)
  }
  return {
    onlyUrl,
    text: text.join(''),
    url: url.join(''),
  }
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
  let hasUrl = false
  const nlist = list.map((item) => {
    if (typeof item === 'string') {
      if (cssFileUrl(item)) {
        hasUrl = true
        return cssFullUrl(item)
      }
      if (CSS_IMPORT_REG.test(item)) {
        hasUrl = true
      }
      return item
    }
    return cssRuleMapToString(item)
  })
  return {
    hasUrl,
    css: nlist.join(''),
  }
}

class WangEditorElement extends HTMLDivElement {
  public sheet: CSSStyleSheet | HTMLStyleElement

  public urlSheet?: HTMLStyleElement

  public constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    const cssUrl = IMPORT.length ? `<style>${IMPORT}</style>` : ''

    if ('adoptedStyleSheets' in shadow) {
      this.sheet = new CSSStyleSheet()
      Reflect.set(shadow, 'adoptedStyleSheets', [...SHEETS, this.sheet])
      shadow.innerHTML = cssUrl
    } else {
      shadow.innerHTML = `${cssUrl}${STYLES.length ? `<style>${STYLES}</style>` : ''}<style id="sheet"></style>`
      this.sheet = shadow.querySelector('#sheet') as HTMLStyleElement
    }
  }

  /**
   * 动态修改 css 规则
   * @param list CSS规则
   */
  public sheetRule(list: WeCssRuleList) {
    const { css, hasUrl } = cssRuleListToString(list)
    if (this.sheet instanceof HTMLStyleElement) {
      this.sheet.textContent = css
    } else {
      if (hasUrl) {
        if (!this.urlSheet) {
          this.urlSheet = document.createElement('style')
          this.shadowRoot!.append(this.urlSheet)
        }
        this.urlSheet.textContent = css
        // @ts-ignore
        this.sheet.replaceSync('')
      } else {
        if (this.urlSheet) this.urlSheet.textContent = ''
        // @ts-ignore
        this.sheet.replaceSync(css)
      }
    }
  }
}

const CUSTOM_ELEMENT_NAME = 'wangeditor-clinfc'

customElements.define(CUSTOM_ELEMENT_NAME, WangEditorElement, { extends: 'div' })

/**
 * 将 css 样式注入 shadow 中
 * @param css {String} css 文本或 css 文件路径
 */
export function weEditorPlusCssRule(css: string) {
  if (css.length < 3) return
  if ('adoptedStyleSheets' in document) {
    const { text, url } = processCSSText(css)
    if (text.length) {
      const sheet = new CSSStyleSheet()
      // @ts-ignore
      sheet.replaceSync(text)
      SHEETS.push(sheet)
    }
    if (url.length) {
      IMPORT = `${IMPORT}${url}`
    }
  } else {
    STYLES = `${STYLES}${css}`
  }
}

/**
 * shadow 模式的富文本编辑器
 */
export const WeEditorPlus = defineComponent({
  name: 'WeEditorPlus',
  components: { WeEditor },
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
    modelValue: Array as PropType<Descendant[]>,
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
        if (elem.value && props.cssRule !== undefined) elem.value.sheetRule(props.cssRule)
      },
      { deep: true }
    )

    onMounted(() => {
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
