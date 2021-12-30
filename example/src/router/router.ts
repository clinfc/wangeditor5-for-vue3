import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Index from '@view/begin.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'Index',
    path: '/',
    component: Index,
  },
  {
    name: 'defaultContent',
    path: '/default-content',
    component: () => import('@view/default-content.vue'),
  },
  {
    name: 'extendCache',
    path: '/extend-cache/:extendCache',
    component: () => import('@view/extend-cache.vue'),
  },
  {
    name: 'async initialize',
    path: '/async',
    component: () => import('@view/async.vue'),
  },
  {
    name: 'reloadbofore',
    path: '/reloadbofore',
    component: () => import('@view/reloadbofore.vue'),
  },
]

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
})

export default router
