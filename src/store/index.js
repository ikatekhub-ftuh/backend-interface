import { createStore } from 'vuex'
import auth from './auth'

export default createStore({
    namespaced: true,
    modules: {
        auth
    }
})
