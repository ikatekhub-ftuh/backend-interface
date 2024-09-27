/**
 * @file router/index.js
 * @description This file contains the router configuration.
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import appdata from '@/configs/appdata'
import mainShell from '@/shell/mainShell.vue'
import { useAuthStore } from '@/stores/auth'
import DashboardShell from '../shell/DashboardShell.vue'
import DashboardView from '../views/dashboard/DashboardView.vue'
import NotfoundView from '@/views/notfoundView.vue'
import LoginView from '@/views/loginView.vue'
import BeritaInputView from '@/views/dashboard/input/beritaInputView.vue'
import LokerInputView from '@/views/dashboard/input/lokerInputView.vue'
import PerusahaanInputView from '@/views/dashboard/input/perusahaanInputView.vue'
import { mstr } from '@/modules/core'
import EventInputView from '@/views/dashboard/input/eventInputView.vue'
import BeritaDataView from '@/views/dashboard/datas/beritaDataView.vue'
import LokerDataView from '@/views/dashboard/datas/lokerDataView.vue'
import PerusahaanDataView from '@/views/dashboard/datas/perusahaanDataView.vue'
import EventDataView from '@/views/dashboard/datas/eventDataView.vue'
import AlumniDataView from '@/views/dashboard/datas/alumniDataView.vue'

/**
 * Create a new router instance.
 */
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [

        {
            path: '/dashboard',
            meta: { shell: true, requiresAuth: true },
            component: DashboardShell,
            children: [
                {
                    path: "",
                    name: "dashboard",
                    component: DashboardView
                },
                {
                    path: '/data',
                    meta: { shell: true },
                    children: [
                        {
                            path: "berita",
                            name: "data berita",
                            component: BeritaDataView
                        },
                        {
                            path: "loker",
                            name: "data loker",
                            component: LokerDataView
                        },
                        {
                            path: "perusahaan",
                            name: "data perusahaan",
                            component: PerusahaanDataView
                        },
                        {
                            path: "event",
                            name: "data event",
                            component: EventDataView
                        },
                        {
                            path: "alumni",
                            name: "data alumni",
                            component: AlumniDataView
                        },
                    ]
                },
                {
                    path: '/input',
                    meta: { shell: true },
                    children: [
                        {
                            path: "berita",
                            name: "input berita",
                            component: BeritaInputView
                        },
                        {
                            path: "loker",
                            name: "input loker",
                            component: LokerInputView
                        },
                        {
                            path: "perusahaan",
                            name: "input perusahaan",
                            component: PerusahaanInputView
                        },
                        {
                            path: "event",
                            name: "input event",
                            component: EventInputView
                        },
                    ]
                }
            ]
        },
        {
            path: '/',
            meta: { shell: true },
            component: mainShell,
            children: [
                {
                    path: '',
                    name: 'home',
                    // dont lazy-load frequently visited or important routes, as it may cause a delay when navigating
                    component: HomeView
                },
                {
                    path: 'about',
                    name: 'about',
                    // route level code-splitting
                    // this generates a separate chunk (About.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import('../views/AboutView.vue'),
                }
            ]
        },
        {
            path: "/login",
            name: "login",
            meta: { noAuth: true },
            component: LoginView
        },
        {
            path: "/:pathMatch(.*)*",
            name: "notfound",
            component: NotfoundView
        }
    ]
})


/**
 * This function is called before every route change.
 */
router.beforeEach((to, from, next) => {
    document.title = `${mstr(to.name).capitalize(true)} - ${appdata.title}`
    if (to.meta.noAuth && localStorage.getItem("TOKEN")) {
        next({ name: 'home' })
        return
    }
    if (to.meta.requiresAuth && !localStorage.getItem("TOKEN")) {
        next({ name: 'login', query: { redirect: to.fullPath } })
        return
    }
    next()
})

export default router
