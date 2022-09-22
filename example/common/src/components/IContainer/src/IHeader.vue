<template>
  <div class="i-header">
    <div class="i-header-logo">wangEditor5-for-vue3 v1.x {{ subhead }}</div>
    <div class="i-header-tool">
      <div class="i-tool">
        <div class="i-tool-content">
          <a target="_blank" :href="V1_URL">文档</a>
        </div>
      </div>
      <div class="i-tool">
        <div class="i-tool-content">示例</div>
        <div class="i-tool-dropdown">
          <div class="i-tool-dropdown__container">
            <div class="i-tool-dropdown__item">
              <a target="_blank" :href="ELPLUS_URL">ElementPlus</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { V1_URL, ELPLUS_URL } from 'shared'

  export default defineComponent({
    name: 'IHeader',
    props: {
      subhead: {
        type: String
      }
    },
    setup() {
      return {
        V1_URL,
        ELPLUS_URL
      }
    }
  })
</script>

<style lang="scss">
  .i-header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center;
    color: #999;
    padding: 0 20px;
    background-color: #fafafa;

    & > div {
      height: 100%;
      display: flex;
      align-items: center;
    }

    &-logo {
      font-size: 24px;
      font-weight: bold;
    }

    a {
      display: block;

      &:link,
      &:visited {
        text-decoration: none;
        color: #999;
      }

      &:hover {
        color: #333;
      }
    }
  }

  .i-tool {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 20px;
    position: relative;
    cursor: pointer;

    &:hover {
      background-color: #ebf8ff;
      color: #333;
    }

    &-content {
    }

    &-dropdown {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;

      &__container {
        margin-top: 10px;
        padding: 10px 0;
        box-shadow: 0 0 5px 0 #e5e5e5;
        background-color: #fff;
      }

      &__item {
        padding: 10px 20px;

        &:hover {
          background-color: #ebf8ff;
          color: #333;
        }
      }
    }

    &:hover &-dropdown {
      display: block;
    }
  }
</style>
