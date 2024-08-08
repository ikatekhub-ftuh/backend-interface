// import axios from "axios";

// // hapus ini jika tidak menggunakan ngrok, hapus juga ngrokHeader di bawah
// const ngrokHeader = {
//     headers: {
//         'ngrok-skip-browser-warning': 'true'
//     }
// }


// export default {
//     namespaced: true,
//     state: {
//         token: null,
//         user: null,
//     },
//     getters: {
//         auth(state) {
//             return state.token && state.user
//         },
//         role(state) {
//             return state.user.user.role
//         }
//     },
//     mutations: {
//         SETTOKEN(state, data) {
//             state.token = data
//         },
//         SETUSER(state, data) {
//             state.user = data
//         }
//     },
//     actions: {
//         async login({ dispatch }, credentials) {
//             let response = await axios.post('login', credentials)
//             await dispatch('attempt', response.data.token)
//             return response
//         },
//         // async register({ dispatch }, credentials){
//         //     let response = await axios.post('register', credentials)
//         //     await dispatch('attempt', response.data.token)
//         //     return response
//         // },
//         async attempt({ commit, state }, token) {
//             if (token) {
//                 commit('SETTOKEN', token)
//             }
//             if (!state.token) {
//                 return
//             }
//             try {
//                 let response = await axios.get('info')
//                 commit('SETUSER', response.data)
//             } catch (error) {
//                 commit('SETTOKEN', null)
//                 commit('SETUSER', null)
//             }
//         },
//         async logout({ commit }) {
//             await axios.post('logout')
//             commit('SETTOKEN', null)
//             commit('SETUSER', null)
//         }
//     },
// }
