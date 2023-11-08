import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import { viteMockServe } from 'vite-plugin-mock'


export default defineConfig(() =>{
  return {
    plugins: [
      vue(),
      vueJsx(),
      /*
      viteMockServe({
        localEnabled: command === 'serve',
      }),*/
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
