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
				{
					path: '/chat',
					meta: { title: 'Chats' },
					name: 'chat',
					component: () => import(/* webpackChunkName: "account" */'../pages/Chats.vue'),
				},
			]
		},
	]

export default routes