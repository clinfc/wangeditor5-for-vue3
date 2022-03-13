<style lang="scss">
  $thumbColor: #ddd;
  $trackColor: #eee;
  .u-scroll {
    height: var(--u-scroll-height, auto);
    max-height: 100%;
    scrollbar-width: thin;
    scrollbar-color: var(--thumb--color, $thumbColor) var(--track--color, $trackColor);
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    // 滑块
    &::-webkit-scrollbar-thumb {
      background: var(--thumb--color, $thumbColor);
    }
    // 轨道
    &::-webkit-scrollbar-track {
      background: var(--track--color, $trackColor);
    }
  }
</style>

<template>
  <div class="u-scroll" :style="{ overflowX: scrollX ? 'auto' : 'hidden', overflowY: scrollY ? 'auto' : 'hidden' }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'UScroll',
    props: {
      scrollX: {
        type: Boolean,
        default: false,
      },
      scrollY: {
        type: Boolean,
        default: false,
      },
    },
  })
</script>
