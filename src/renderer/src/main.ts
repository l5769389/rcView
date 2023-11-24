import { createApp } from 'vue'
import './assets/css/index.css'
import App from './App.vue'

import naive from 'naive-ui'
const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)
const app = createApp(App)
app.use(naive)
app.mount('#app')
