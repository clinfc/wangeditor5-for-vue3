<template>
  <i-scroll class="exc-prism" scroll-x scroll-y>
    <pre :class="`language-${lang}`"><code v-html="html"></code></pre>
  </i-scroll>
</template>

<script lang="ts">
  import 'prismjs/themes/prism.css'

  import Prism from 'prismjs'
  // 必须在 Prism 之后引入
  import 'prismjs/components/prism-json.js'

  import { computed, defineComponent, PropType } from 'vue'
  import { IScroll } from '../IScroll'

  type PrismLang = 'html' | 'xml' | 'svg' | 'css' | 'js' | 'javascript' | 'json'

  export default defineComponent({
    name: 'Prism',
    components: { IScroll },
    props: {
      content: {
        type: String,
        default: ''
      },
      lang: {
        type: String as PropType<PrismLang>,
        default: 'html'
      }
    },
    setup(props) {
      const html = computed(() => {
        return Prism.highlight(props.content, Prism.languages[props.lang], props.lang)
      })
      return { html }
    }
  })
</script>

<style lang="scss">
  .exc-prism {
    max-width: 100%;
  }
</style>
