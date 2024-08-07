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
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('../views/Dashboard.vue'),
            },
            {
                path: '/berita',
                name: 'input berita',
                component: () => import('../views/subview_dashboard/input/News.vue'),
            },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
