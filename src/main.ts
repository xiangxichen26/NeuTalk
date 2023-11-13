import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import http from './utils/request'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.provide('$axios', axios)
app.use(router)
app.use(http)


app.mount('#app')
