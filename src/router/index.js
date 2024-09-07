import { createWebHistory, createRouter } from 'vue-router'
import store from '../store'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import DashboardShell from '../shell/DashboardShell.vue'
import Profile from '../views/subview_dashboard/Profile.vue'
import NewsInput from '../views/subview_dashboard/input/News.vue'
import EventInput from '../views/subview_dashboard/input/Event.vue'
import NewsData from '../views/subview_dashboard/data/News.vue'
import EventData from '../views/subview_dashboard/data/Event.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        component: DashboardShell,
        meta: { requiresAuth: true },
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('../views/Dashboard.vue'),
            },
            {
                path: '/profile',
                name: 'profile',
                component: Profile,
            },
            // input
            {
                path: '/input/berita',
                name: 'input berita',
                component: NewsInput,
            },
            {
                path: '/input/alumni',
                name: 'input alumni',
                component: () => import('../views/subview_dashboard/input/Alumni.vue'),
            },
            // event
            {
                path: '/input/event',
                name: 'input event',
                component: EventInput,
            },
            {
                path: '/input/loker',
                name: 'input loker',
                component: () => import('../views/subview_dashboard/input/Loker.vue'),
            },
            {
                path: '/input/perusahaan',
                name: 'input perusahaan',
                component: () => import('../views/subview_dashboard/input/Perusahaan.vue'),
            },
            // data
            {
                path: '/data/news',
                name: 'data news',
                component: NewsData
            },
            {
                path: '/data/event',
                name: 'data event',
                component: EventData
            },
            // {
            //     path: '/data/alumni',
            //     name: 'data alumni',
            //     component: () => import('../views/subview_dashboard/data/Alumni.vue')
            // },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.getters['auth/auth']) {
        return next({ name: 'login' })
    }
    next()
})

export default router
