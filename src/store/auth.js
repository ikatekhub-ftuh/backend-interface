import axios from "axios";

// hapus ini jika tidak menggunakan ngrok, hapus juga ngrokHeader di bawah
const ngrokHeader = {
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }
}


export default {
    namespaced: true,
    state: {
        token: null,
        user: null,
        admin: null,
    },
    getters: {
        auth(state) {
            return state.token && state.user
        },
        role(state) {
            return state.admin
        }
    },
    mutations: {
        SETTOKEN(state, data) {
            state.token = data
        },
        SETUSER(state, data) {
            state.user = data
        },
        SETROLE(state, data) {
            state.admin = data
        }
    },
    actions: {
        async login({ dispatch }, credentials) {
            let response = await axios.post('auth/login', credentials)
            await dispatch('attempt', response.data.token)
            return response
        },
        async attempt({ commit, state }, token) {
            if (token) {
                commit('SETTOKEN', token)
            }
            if (!state.token) {
                return
            }
            try {
                let response = await axios.get('user')
                commit('SETUSER', response.data.data.user)
                commit('SETROLE', response.data.data.isAdmin)
            } catch (error) {
                commit('SETTOKEN', null)
                commit('SETUSER', null)
                commit('SETROLE', null)
            }
        },
        async logout({ commit }) {
            await axios.post('logout')
            commit('SETTOKEN', null)
            commit('SETUSER', null)
            commit('SETROLE', null)
        }
    },
}
