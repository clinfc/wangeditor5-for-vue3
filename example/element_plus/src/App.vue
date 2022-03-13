<template>
  <el-container class="page">
    <el-aside class="page-aside" width="200px">
      <el-menu active-text-color="#ffd04b" background-color="#545c64" default-active="2" text-color="#fff" router>
        <template v-for="item in menus" :key="item.path">
          <el-menu-item :index="item.path">
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-main class="page-main">
      <div class="page-main__content">
        <u-scroll scroll-x scroll-y>
          <router-view />
        </u-scroll></div
    ></el-main>
  </el-container>
</template>

<script lang="ts">
  import { Menus } from '@router/router'
  import { defineComponent } from 'vue'
  import UScroll from './components/u-scroll.vue'

  export default defineComponent({
    components: { UScroll },
    setup() {
      return {
        menus: Menus,
      }
    },
  })
</script>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
  }
  .page {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-wrap: nowrap;
    &-aside {
      height: 100%;
      .el-menu {
        height: 100%;
      }
    }
    &-main {
      flex-grow: 1;
      height: 100%;
      overflow: hidden;
      &__content {
        width: 800px;
        height: 100%;
        margin: auto;
        overflow: hidden;
      }
    }
  }
  .toolbar {
    border: 1px solid #e5e5e5;
    box-sizing: border-box;
  }
  .editable {
    border: 1px solid #e5e5e5;
    border-top: none;
    height: 300px;
    box-sizing: border-box;
  }
</style>
