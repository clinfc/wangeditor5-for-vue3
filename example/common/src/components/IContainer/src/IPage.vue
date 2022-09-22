<template>
  <div class="i-page">
    <div class="i-page__head">
      <slot name="head">
        <div class="i-page__head-title">{{ title }}</div>
      </slot>
    </div>
    <div class="i-page__content">
      <slot></slot>
    </div>
    <div class="i-page__foot">
      <slot name="foot"></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'IPage',
    props: {
      title: {
        type: String
      }
    }
  })
</script>

<style lang="scss">
  .i-page {
    width: 800px;
    height: 100%;
    margin: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &__head {
      flex-shrink: 0;

      &-title {
        font-size: 24px;
        height: 75px;
        line-height: 75px;
        box-shadow: 0 1px 0 0 #e5e5e5;
        margin-bottom: 20px;
      }
    }

    &__content {
      flex-grow: 1;
      overflow-x: hidden;
      overflow-y: auto;
    }

    &__foot {
      min-height: 20px;
    }
  }
</style>
