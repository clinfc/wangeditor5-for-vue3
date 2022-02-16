<style lang="scss">
  .u-prism {
    max-width: 100%;
  }
</style>

<template>
  <u-scroll class="u-prism" scroll-x scroll-y>
    <pre :class="`language-${lang}`"><code v-html="html"></code></pre>
  </u-scroll>
</template>

<script lang="ts">
  import 'prismjs/themes/prism.css'

  import Prism from 'prismjs'
  // 必须在 Prism 之后引入
  import 'prismjs/components/prism-json.js'

  import { computed, defineComponent, PropType, toRaw, toRefs } from 'vue'
  import UScroll from './u-scroll.vue'

  type PrismLang = 'html' | 'xml' | 'svg' | 'css' | 'js' | 'javascript' | 'json'

  export default defineComponent({
    name: 'UPrism',
    props: {
      content: {
        type: String,
        default: '',
      },
      lang: {
        type: String as PropType<PrismLang>,
        default: 'html',
      },
    },
    setup(props) {
      const html = computed(() => {
        return Prism.highlight(props.content, Prism.languages[props.lang], props.lang)
      })
      return { html }
    },
    components: { UScroll },
  })
</script>
