import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'popper.js'
import 'bootstrap/dist/js/bootstrap.js'
import 'jquery/dist/jquery.min.js'

createApp(App).use(store).use(router).mount('#app')
