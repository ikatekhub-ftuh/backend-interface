import { defineStore } from "pinia";
import axios from "axios";

function setAxiosToken(token) {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("TOKEN", token);
    } else {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("TOKEN");
    }
}

export const useAuthStore = defineStore("auth", {
    state: () => ({
        USER: null,
        TOKEN: null,
    }),
    getters: {
        isAuthenticated() {
            return this.USER !== null;
        },
    },
    actions: {
        emptyAll() {
            this.USER = null;
            this.TOKEN = null;
            setAxiosToken(null);
            console.log("emptied all");
        },
        async login(credentials) {
            let response = await axios.post('auth/login', credentials);
            await this.attempt(response.data.token);
            return response
        },
        async attempt(token) {
            console.log("attempting to login");
            if (token) {
                this.TOKEN = token;
                console.log("setting token");
            }
            if (!this.TOKEN) {
                this.emptyAll();
                console.log("no token");
                return;
            }
            setAxiosToken(this.TOKEN);
            try {
                console.log("trying to get user");
                console.log(axios.defaults.headers.common['Authorization']);
                let response = await axios.get('user');
                console.log(response);
                this.USER = response.data.data;
            } catch (error) {
                this.emptyAll();
            }
        },
        async logout() {
            axios.post("auth/logout").then(() => {
                this.emptyAll();
            }).catch(() => {
                this.emptyAll();
            })
        },
    },
});
