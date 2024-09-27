/**
 * @file onrefresh.js
 * @description This file is used to restore local storage data
 * when the app is refreshed.
 */
import { useAuthStore } from "../auth";

/**
 * Gets local data. We're returning a promise because we're
 * actually using .then in main.js
 *
 * @returns {Promise}
 * @example
 * getLocalData().then(() => {
 *  console.log('Local data has been restored');
 *  app.mount('#app')
 * }
 */
export default function getLocalData() {
    return new Promise((resolve) => {
        const token = localStorage.getItem('TOKEN') || null;
        useAuthStore().attempt(token);
        resolve();
    });
}
