import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


import authRoutes from '../app/auth/router'

const routes: RouteRecordRaw[] = [
    ...authRoutes,
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