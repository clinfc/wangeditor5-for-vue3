<style lang="scss">
  $interval: 20px;
  :root {
    --bg-color: #f5f5f5;
  }
  body {
    padding: 0;
    margin: 0;
    background-color: var(--bg-color);
  }
  .main {
    --u-scroll-height: 100%;
    width: 1200px;
    height: 100vh;
    margin: auto;
    overflow: hidden;
    display: flex;
    flex-wrap: nowrap;
    padding: $interval 0;
    box-sizing: border-box;
    .aside {
      flex-shrink: 0;
      width: 260px;
      height: 100%;
      background-color: #fff;
      .menu {
        &-top {
          height: $interval;
          border-bottom: 1px solid var(--bg-color);
        }
        &__item {
          font-size: 16px;
          height: 54px;
          line-height: 54px;
          padding-left: $interval;
          cursor: pointer;
          border-bottom: 1px solid var(--bg-color);
          color: #999;
          &:hover {
            color: #999;
            background-color: #efefef;
          }
          &.active {
            color: #c3c3c3;
            background-color: #f1f1f1;
            &:hover {
              color: #999;
            }
          }
        }
      }
    }
    .content {
      flex-grow: 1;
      height: 100%;
      background-color: #fff;
      margin-left: $interval;
      overflow: hidden;
    }
  }
  .toolbar {
    border-bottom: 1px solid var(--bg-color);
  }
  .editable {
    min-height: 500px;
    border-bottom: 2px solid var(--bg-color);
  }
  .preview {
    &-types {
      padding: 15px;
      button {
        margin-right: 15px;
        cursor: pointer;
      }
    }
  }
  .el-form {
    padding: 15px 0 10px 20px;
    border-bottom: 1px solid var(--bg-color);
  }
</style>

<template>
  <div class="main">
    <div class="aside">
      <u-scroll style="height: 100%" scroll-y>
        <div class="menu">
          <div class="menu-top"></div>
          <template v-for="menu in menus">
            <div class="menu__item" :class="{ active: $route.path === menu.path }" @click="to(menu)">
              {{ menu.name }}
            </div>
          </template>
        </div>
      </u-scroll>
    </div>
    <div class="content">
      <u-scroll scroll-y>
        <router-view></router-view>
      </u-scroll>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import UScroll from './components/u-scroll.vue'

  interface MenuItem {
    name: string
    /** path */
    path: string
  }

  export default defineComponent({
    components: { UScroll },
    setup() {
      const menus = ref<MenuItem[]>([
        { name: '基础案例', path: '/' },
        { name: 'defaultContent', path: '/default-content' },
        { name: 'defaultHtml', path: '/default-html' },
        { name: 'extendCache: true', path: '/extend-cache/true' },
        { name: 'extendCache: false', path: '/extend-cache/false' },
        { name: 'reloadbofore', path: '/reloadbofore' },
        { name: 'v-model', path: '/model-json-array' },
        { name: 'v-model:json', path: '/model-json-string' },
        { name: '在弹窗/抽屉中使用', path: '/async' },
        { name: '表单验证', path: '/form' },
        { name: 'ShadowDom 模式', path: '/shadow' },
      ])

      const router = useRouter()

      function to(menu: MenuItem) {
        router.push({ path: menu.path })
      }

      return { menus, to }
    },
  })
</script>
