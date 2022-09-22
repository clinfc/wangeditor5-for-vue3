<template>
  <div class="i-aside">
    <div class="i-aside__container">
      <template v-for="menu in menus" :key="menu.key">
        <div class="i-aside__menu" @click="menu.callback" :class="{ active: active === menu.key }">
          {{ menu.title }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue'
  import { AsideMenu } from './types'

  export default defineComponent({
    name: 'IAside',
    props: {
      active: {
        type: String
      },
      menus: {
        type: Array as PropType<AsideMenu[]>,
        default: () => []
      }
    }
  })
</script>

<style lang="scss">
  .i-aside {
    background-color: #fafafa;
    width: 220px;
    height: 100%;
    overflow: hidden;
    padding: 20px 0 10px;
    border-right: 1px solid #eee;

    &__container {
      width: calc(100% + 17px);
      height: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
    }

    &__menu {
      height: 46px;
      line-height: 46px;
      padding: 0 20px;
      text-align: right;
      cursor: pointer;
      color: #999;
      border-right: 6px solid transparent;
      margin-bottom: 2px;

      &.active,
      &:hover {
        background-color: #ebf8ff;
        color: #666;
        border-right-color: #d1efff;
      }
    }
  }
</style>
