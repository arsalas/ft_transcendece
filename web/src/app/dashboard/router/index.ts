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
					name: 'profileLayout',
					meta: { title: 'Profile' },
					component: () => import(/* webpackChunkName: "create-contest" */'../layouts/Profile.vue'),
					children: [
						{
							path: '',
							name: 'profile',
							meta: { title: 'Profile' },
							component: () => import(/* webpackChunkName: "create-contest" */'../pages/profile/Profile.vue')
						},
						{
							path: 'two-factor-auth',
							meta: { title: 'Two-Factor Auth' },
							name: 'twoFactorAuth',
							component: () => import(/* webpackChunkName: "account" */'../pages/profile/TwoFactorAuth.vue'),
						},
					]
				},
				{
					path: 'chat',
					meta: { title: 'Chats' },
					name: 'chat',
					component: () => import(/* webpackChunkName: "account" */'../pages/Chats.vue'),
				},
			]
		},
	]

export default routes