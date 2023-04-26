import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


import authRoutes from '../app/auth/router'
import dashboardRoutes from '../app/dashboard/router'

const routes: RouteRecordRaw[] = [
    ...authRoutes,
    ...dashboardRoutes,
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


// router.beforeEach((to, from) => {
// 	document.title = to.meta?.title as string ?? 'Amazon Awards'
// 	if (to.meta.requiresAuth && !isAuth()) {
// 		return {
// 			name: 'signin',
// 		}
// 	}
// })

export default router;