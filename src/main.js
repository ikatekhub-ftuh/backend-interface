import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './styles/base.css'

import 'primeicons/primeicons.css'
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import Qrcode from 'qrcode.vue'

import store from './store'
import './store/subscriber'

import axios from 'axios'
// axios.defaults.baseURL = 'http://127.0.0.1:8000/api/'

import config from './config'
axios.defaults.baseURL = config.baseURL;
axios.defaults.headers.common = {
    ...axios.defaults.headers.common,
    ...config.headers,
}

store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {

    createApp(App)
        .use(router)
        .use(PrimeVue, {
            theme: {
                preset: Aura,
                options: {
                    prefix: 'p',
                    darkModeSelector: '.dark',
                    cssLayer: {
                        name: 'primevue',
                        order: 'tailwind-base, primevue, tailwind-utilities'
                    }
                }
            }
        })
        .use(ConfirmationService)
        .use(ToastService)
        .use(store)
        .component('qrcode', Qrcode)
        .mount('#app')

})
