export default {
    namespaced: true,
    state: {
        token: null,
        user: null,
    },
    getters: {
        auth(state) {
            return state.token && state.user
        },
        user(state) {
            return state.user
        },
        admin(state) {
            return state.user.is_admin
        }
    },
    mutations: {
        SETTOKEN(state, data) {
            state.token = data
        },
        SETUSER(state, data) {
            state.user = data
        },
        SETADMIN(state, data) {
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
                let response = await axios.get('user?admincheck=true')
                commit('SETUSER', response.data.data)
            } catch (error) {
                commit('SETTOKEN', null)
                commit('SETUSER', null)
            }
        },
        async logout({ commit }) {
            await axios.post('auth/logout')
            const dbs = await window.indexedDB.databases()
            dbs.forEach(db => { window.indexedDB.deleteDatabase(db.name) })
            await localStorage.clear()
            commit('SETTOKEN', null)
            commit('SETUSER', null)
        },
        async update({ commit }, data) {
            let response = await axios.post('user/update', data)
            console.log(response)
            commit('SETUSER', response.data.data)
            return response
        }
    },
}
