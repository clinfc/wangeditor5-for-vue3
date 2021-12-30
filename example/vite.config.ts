import path from 'path'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    open: true,
  },
  plugins: [vue(), ElementPlus()],
  resolve: {
    alias: {
      '@we': path.resolve(__dirname, '../src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@router': path.resolve(__dirname, 'src/router'),
      '@view': path.resolve(__dirname, 'src/view'),
    },
  },
  build: {
    sourcemap: true,
  },
})
