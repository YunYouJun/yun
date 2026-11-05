import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  root: fileURLToPath(new URL('./demo', import.meta.url)),
  plugins: [vue()],
  resolve: {
    alias: {
      '@yunyoujun/mascot/vue': fileURLToPath(new URL('./src/vue.ts', import.meta.url)),
      '@yunyoujun/mascot': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 4173,
  },
  build: {
    outDir: fileURLToPath(new URL('./demo-dist', import.meta.url)),
    emptyOutDir: true,
  },
})
