import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import Index from '@views/begin.vue'
import { AsideMenu } from 'example-common'
import { ref } from 'vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'Index',
    path: '/',
    component: Index,
    meta: {
      title: '基础案例'
    }
  },
  {
    name: 'defaultContent',
    path: '/default-content',
    component: () => import('@views/default-content.vue'),
    meta: {
      title: 'defaultContent'
    }
  },
  {
    name: 'defaultHtml',
    path: '/default-html',
    component: () => import('@views/default-html.vue'),
    meta: {
      title: 'defaultHtml'
    }
  },
  {
    name: 'enableExtendCache',
    path: '/extend-cache/true',
    component: () => import('@views/extend-cache.vue'),
    meta: {
      title: '使用缓存模式'
    }
  },
  {
    name: 'disableExtendCache',
    path: '/extend-cache/false',
    component: () => import('@views/extend-cache.vue'),
    meta: {
      title: '禁用缓存模式'
    }
  },
  {
    name: 'async',
    path: '/async',
    component: () => import('@views/async.vue'),
    meta: {
      title: '在弹窗/抽屉中使用'
    }
  },
  {
    name: 'reloadEvent',
    path: '/reload-event',
    component: () => import('@views/reload.vue'),
    meta: {
      title: 'reload 事件'
    }
  },
  {
    name: 'modelJsonArray',
    path: '/model-json-array',
    component: () => import('@views/model-json-array.vue'),
    meta: {
      title: 'v-model:json'
    }
  },
  {
    name: 'modelJsonString',
    path: '/model-json-string',
    component: () => import('@views/model-json-string.vue'),
    meta: {
      title: 'v-model:json.string'
    }
  },
  {
    name: 'modelHtmlString',
    path: '/model-html-string',
    component: () => import('@views/model-html-string.vue'),
    meta: {
      title: 'v-model:html'
    }
  },
  {
    name: 'FormValidate',
    path: '/form-validate',
    component: () => import('@views/form-validate.vue'),
    meta: {
      title: '表单验证'
    }
  },
  {
    name: 'SyncContent',
    path: '/sync-content',
    component: () => import('@views/sync-content.vue'),
    meta: {
      title: '强制同步数据'
    }
  }
]

// export const ComponentFiles: Map<string, string> = new Map()

const router = createRouter({
  routes: routes,
  history: createWebHashHistory()
})

router.afterEach((to, from, failure) => {
  if (failure) return

  document.title = to.meta!.title as string
})

export const activeMenu = ref(router.options.history.state.current as string)

export const asideMenus = routes.map((item) => {
  // ComponentFiles.set(item.path, item.meta!.component as string)
  // ComponentFiles.set(item.path.replace(/\/$/, ''), item.meta!.component as string)

  return {
    key: item.path,
    title: item.meta!.title,
    callback() {
      activeMenu.value = item.path
      router.push(item.path)
    }
  } as AsideMenu
})

export default router
