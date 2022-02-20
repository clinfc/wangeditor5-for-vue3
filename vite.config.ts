import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  mode: 'production',
  server: {
    host: '0.0.0.0',
    open: true,
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    outDir: 'dist/lib',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['umd'],
      name: 'wangEditor5ForVue3',
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['vue', '@wangeditor/editor'],
      output: {
        globals: {
          vue: 'Vue',
          '@wangeditor/editor': 'wangEditor',
        },
      },
    },
  },
})
