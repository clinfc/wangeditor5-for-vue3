import { readFileSync } from 'fs'
import { defineConfig } from 'vite'
const { name, version } = JSON.parse(readFileSync('./package.json') as any)

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist/lib',
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'wangEditor5ForVue3',
      formats: ['es', 'umd'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return `index.esm.js`
          case 'umd':
            return `index.umd.cjs`
          default:
            return `index.${format}.js`
        }
      },
    },
    rollupOptions: {
      external: ['vue', '@wangeditor/editor'],
      output: {
        banner: `/* ${name} v${version} */`,
        footer: `/* ${name} version ${version} */`,
        globals: {
          vue: 'Vue',
          '@wangeditor/editor': 'wangEditor',
        },
      },
    },
  },
})
