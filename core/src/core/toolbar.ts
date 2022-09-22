import { createToolbar } from '@wangeditor/editor'
import { defineComponent, h, InjectionKey, onBeforeUnmount, PropType, Ref, ref, toRaw, unref, watch } from 'vue'
import { useWeContent } from './hooks'
import { Nullish, WeCache, WeInjectContent, WeToolbarReloadEvent } from './types'
import { withInstall } from './utils'

const Toolbar = defineComponent({
  name: 'WeToolbar',
  props: {
    handle: {
      type: Symbol as PropType<InjectionKey<WeInjectContent>>,
      required: true
    }
  },
  emits: ['reload', 'reloaded'],
  setup(props, { emit }) {
    const rootRef = ref() as Ref<HTMLDivElement>

    const { cache, opts, instance, globalAttrs } = useWeContent(props.handle)

    /**
     * 生成 reload/reloaded 事件传递的数据
     */
    function createEvent(): WeToolbarReloadEvent {
      return {
        type: 'toolbar',
        instance: instance.toolbar!
      }
    }

    /**
     * 菜单栏销毁
     * @param dispatch 是否需要触发 reload 事件，用于区分销毁前的重建和组件的销毁
     * @return 是否需要触发 reloaded 事件
     */
    function destory(dispatch?: boolean): boolean {
      if (!instance.toolbar) return false

      dispatch && emit('reload', createEvent())

      instance.toolbar.destroy()
      instance.toolbar = null
      return true
    }

    const toolbar: Nullish<WeCache['toolbar']> = {
      timer: null,
      create() {
        const selector = unref(rootRef)

        if (!instance.editable || !selector) return

        // 是否需要触发 reloaded 事件
        const dispatch = destory(true)

        delete selector.dataset.wEToolbar

        instance.toolbar = createToolbar({
          selector,
          editor: instance.editable,
          ...toRaw(opts).toolbar
        })

        dispatch && emit('reloaded', createEvent())
      },
      throttle() {
        if (toolbar.timer) clearTimeout(toolbar.timer)
        if (cache.editable?.timer) return

        toolbar.timer = setTimeout(() => {
          toolbar.timer = null
          toolbar.create()
        }, opts.reloadDelay)
      }
    }

    watch(() => opts.toolbar, toolbar.throttle, { deep: true })

    cache.toolbar = toolbar

    onBeforeUnmount(() => {
      destory()
      delete cache.toolbar
    })

    return { rootRef, globalAttrs, instance }
  },
  render() {
    return h('div', { ref: 'rootRef', ...this.globalAttrs.toolbar })
  }
})

export const WeToolbar = withInstall(Toolbar)
