import { createApp } from 'vue';
import { createPinia } from 'pinia';

import VueClickAway from "vue3-click-away";

import App from './App.vue';
import router from './router';

import '@fortawesome/fontawesome-free/css/all.min.css';

import 'animate.css'; // you need to require the css somewhere
import './styles/main.scss';

const pinia = createPinia();

createApp(App).use(pinia).use(router).use(VueClickAway).mount('#app');
