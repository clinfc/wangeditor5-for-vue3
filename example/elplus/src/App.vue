<template>
  <i-container :menus="asideMenus" :activeMenu="activeMenu" subhead="with element-plus">
    <router-view />
  </i-container>
</template>

<script lang="ts" setup>
  import { IContainer } from 'example-common'
  import { RouterView } from 'vue-router'
  import { asideMenus, activeMenu } from './router/router'
</script>
