import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import { viteMockServe } from 'vite-plugin-mock'
import { resolve } from 'path'



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
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      host:'127.0.0.1'

    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    }
  }
})
