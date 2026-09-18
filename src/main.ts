import { createApp } from 'vue'
import 'virtual:uno.css'
import './style.css'
import App from './App.vue'

const debugTheme = new URLSearchParams(location.search).get('theme')
if (debugTheme === 'dark' || debugTheme === 'light') document.documentElement.dataset.theme = debugTheme

createApp(App).mount('#app')
