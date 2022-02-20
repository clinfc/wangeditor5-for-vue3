import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Index from '../views/begin.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'Index',
    path: '/',
    component: Index,
  },
  {
    name: 'editor',
    path: '/editor',
    component: () => import('../views/editor.vue'),
  },
  {
    name: 'editor-plus',
    path: '/editor-plus',
    component: () => import('../views/editor-plus.vue'),
  },
]

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
})

export default router
