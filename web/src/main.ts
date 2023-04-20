import { createApp } from 'vue'
import { createPinia } from 'pinia';

import App from './App.vue'
import router from './router';

import 'animate.css'  // you need to require the css somewhere
import './styles/main.scss'

const pinia = createPinia();

createApp(App)
	.use(pinia)
	.use(router)
	.mount('#app')
