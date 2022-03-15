import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Index from '@view/begin.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'Index',
    path: '/',
    component: Index,
    meta: {
      title: '基础案例',
    },
  },
  {
    name: 'defaultContent',
    path: '/default-content',
    component: () => import('@view/default-content.vue'),
    meta: {
      title: 'defaultContent',
    },
  },
  {
    name: 'defaultHtml',
    path: '/default-html',
    component: () => import('@view/default-html.vue'),
    meta: {
      title: 'defaultHtml',
    },
  },
  {
    name: 'enableExtendCache',
    path: '/extend-cache/true',
    component: () => import('@view/extend-cache.vue'),
    meta: {
      title: '使用缓存模式',
    },
  },
  {
    name: 'disableExtendCache',
    path: '/extend-cache/false',
    component: () => import('@view/extend-cache.vue'),
    meta: {
      title: '禁用缓存模式',
    },
  },
  {
    name: 'async',
    path: '/async',
    component: () => import('@view/async.vue'),
    meta: {
      title: '在弹窗/抽屉中使用',
    },
  },
  {
    name: 'reloadbofore',
    path: '/reloadbofore',
    component: () => import('@view/reloadbofore.vue'),
    meta: {
      title: 'reloadbofore',
    },
  },
  {
    name: 'modelJsonArray',
    path: '/model-json-array',
    component: () => import('@view/model-json-array.vue'),
    meta: {
      title: 'v-model',
    },
  },
  {
    name: 'modelJsonString',
    path: '/model-json-string',
    component: () => import('@view/model-json-string.vue'),
    meta: {
      title: 'v-model:json',
    },
  },
  {
    name: 'Form',
    path: '/form',
    component: () => import('@view/form.vue'),
    meta: {
      title: '表单验证',
    },
  },
  {
    name: 'SubmitSync',
    path: '/submit-sync',
    component: () => import('@view/sync-content.vue'),
    meta: {
      title: '强制同步表单数据',
    },
  },
  {
    name: 'Shadow',
    path: '/shadow',
    component: () => import('@view/shadow.vue'),
    meta: {
      title: '增强模式',
    },
  },
]

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
})

export const Menus = routes.map((item) => {
  return {
    path: item.path,
    title: item.meta!.title,
  } as Record<'path' | 'title', string>
})

export default router
