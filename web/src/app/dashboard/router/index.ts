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
					path: 'edit-profile',
					name: 'profileLayout',
					redirect: 'editProfile',
					meta: { title: 'Profile' },
					component: () => import(/* webpackChunkName: "create-contest" */'../layouts/EditProfile.vue'),
					children: [
						{
							path: '',
							name: 'editProfile',
							meta: { title: 'Edit Profile' },
							component: () => import(/* webpackChunkName: "create-contest" */'../pages/editProfile/Profile.vue')
						},
						{
							path: 'two-factor-auth',
							meta: { title: 'Two-Factor Auth' },
							name: 'twoFactorAuth',
							component: () => import(/* webpackChunkName: "account" */'../pages/editProfile/TwoFactorAuth.vue'),
						},
						{
							path: 'blocking',
							meta: { title: 'Blocking' },
							name: 'blocking',
							component: () => import(/* webpackChunkName: "account" */'../pages/editProfile/Blocking.vue'),
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