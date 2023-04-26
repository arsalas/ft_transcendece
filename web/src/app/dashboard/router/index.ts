import { RouteRecordRaw } from "vue-router";


const routes: RouteRecordRaw[] =
	[
		{
			path: '/',
			name: 'home',
			redirect: { name: 'contestDetails' },
			// meta: { requiresAuth: true },
			component: () => import(/* webpackChunkName: "account" */'../layouts/Dashboard.vue'),
			children: [
				{
					path: 'profile',
					name: 'profile',
					meta: { title: 'Profile' },
					component: () => import(/* webpackChunkName: "create-contest" */'../pages/Profile.vue')
				},
				
			]
		},
	]

export default routes