import { createWebHistory, createRouter } from 'vue-router'
import store from '../store'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        component: () => import('../shell/DashboardShell.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('../views/Dashboard.vue'),
            },
            {
                path: '/input/berita',
                name: 'input berita',
                component: () => import('../views/subview_dashboard/input/News.vue'),
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
                component: () => import('../views/subview_dashboard/input/Event.vue'),
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
            {
                path: '/data/news',
                name: 'data news',
                component: () => import('../views/subview_dashboard/data/News.vue')
            },
            {
                path: '/data/view/:id',
                name: 'view data',
                component: () => import('../views/subview_dashboard/data/View.vue')
            }
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
    // if (to.meta.requiresAuth && !store.getters['auth/role']) {
    //     return next({ name: 'login' })
    // }
    next()
})

export default router
