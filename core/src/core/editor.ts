import { WeToolbar } from './toolbar'
import { computed, defineComponent, h, mergeProps, PropType } from 'vue'
import { EditableEmits, EditableProps, WeEditable, WeEditableProps } from './editable'
import { omit, pick, withInstall } from './utils'
import { useWeContent } from './hooks'
import { WeReloadEvent } from './types'

// const PierceEmits = EditableEmits.map((e) => `on${e.charAt(0).toUpperCase()}${e.slice(1)}`)

const Editor = defineComponent({
  inheritAttrs: false,
  name: 'WeEditor',
  props: {
    toolbarAttrs: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    },
    editableAttrs: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    },
    ...EditableProps
  },
  emits: [...EditableEmits],
  setup(props, { attrs, emit }) {
    const { globalAttrs, instance } = useWeContent(props.handle)

    const editorProps = computed(() => {
      return mergeProps(omit(attrs, ['toolbarAttrs', 'editableAttrs']), globalAttrs.value.editor)
    })

    const editableEmits = EditableEmits.reduce((events, e) => {
      events[`on${e.charAt(0).toUpperCase()}${e.slice(1)}`] = (data) => emit(e, data)
      return events
    }, {} as Record<string, (data: any) => void>)

    const editableProps = computed(() => {
      return mergeProps(
        editableEmits,
        pick(props, ['handle', 'json', 'jsonModifiers', 'html']),
        props.editableAttrs
      ) as WeEditableProps
    })

    const toolbarProps = computed<any>(() => {
      const { handle, toolbarAttrs } = props

      return mergeProps(
        {
          handle,
          onReload(e: WeReloadEvent) {
            emit('reload', e)
          },
          onReloaded(e: WeReloadEvent) {
            emit('reloaded', e)
          }
        },
        toolbarAttrs
      )
    })

    return { editorProps, editableProps, toolbarProps, instance }
  },
  render() {
    return h('div', this.editorProps, [h(WeToolbar, this.toolbarProps), h(WeEditable, this.editableProps)])
  }
})

export const WeEditor = withInstall(Editor)
