import { createWebHistory, createRouter } from 'vue-router'

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
        path: '/shell/db', name: 'dashboardshell',
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
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// router.beforeEach((to, from, next) => {
//     if (to.meta.requiresAuth && !localStorage.getItem('token')) {
//         next({ name: 'login' })
//     } else {
//         next()
//     }
// })

export default router
