import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/base.css'
import 'primeicons/primeicons.css'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'


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
        },

    }).mount('#app')
