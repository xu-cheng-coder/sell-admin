import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import router from './router/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/icon/iconfont.css'
import {createPinia} from 'pinia'
import piniaPluginPersist from "pinia-plugin-persist";

const app = createApp(App)


const pinia = createPinia()
pinia.use(piniaPluginPersist)

app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
