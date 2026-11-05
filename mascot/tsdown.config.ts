import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    vue: 'src/vue.ts',
  },
  format: ['esm'],
  platform: 'browser',
  target: 'es2022',
  fixedExtension: true,
  dts: true,
  clean: true,
  sourcemap: true,
  deps: {
    neverBundle: ['vue'],
  },
})
