<template>
  <div class="i-container">
    <div class="i-container__header">
      <i-header :subhead="subhead" />
    </div>
    <div class="i-container__main">
      <div class="i-container__aside">
        <i-aside :menus="menus" :active="activeMenu" />
      </div>
      <div class="i-container__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue'
  import IHeader from './IHeader.vue'
  import IAside from './IAside.vue'
  import { AsideMenu } from './types'

  export default defineComponent({
    components: { IHeader, IAside },
    props: {
      subhead: {
        type: String
      },
      activeMenu: {
        type: String
      },
      menus: {
        type: Array as PropType<AsideMenu[]>,
        default: () => []
      }
    },
    setup() {
      return {}
    }
  })
</script>

<style lang="scss">
  .i-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &__header {
      flex-shrink: 0;
      box-shadow: 0 1px 10px 0 #e5e5e5;
      z-index: 3;
    }

    &__main {
      flex-grow: 1;
      overflow: hidden;
      display: flex;
      flex-wrap: nowrap;
    }

    &__aside {
      flex-shrink: 0;
      overflow: hidden;
    }

    &__content {
      flex-grow: 1;
      overflow: hidden;
    }
  }
</style>
