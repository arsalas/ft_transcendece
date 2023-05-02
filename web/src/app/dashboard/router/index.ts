import { RouteRecordRaw } from "vue-router";


const routes: RouteRecordRaw[] =
	[
		{
			path: '/',
			name: 'app',
			redirect: { name: 'home' },
			meta: { requiresAuth: true },
			component: () => import(/* webpackChunkName: "account" */'../layouts/Dashboard.vue'),
			children: [
				{
					path: '',
					name: 'home',
					meta: { title: 'Home' },
					component: () => import(/* webpackChunkName: "create-contest" */'../pages/Home.vue'),
				},
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
						{
							path: 'themes',
							meta: { title: 'Themes' },
							name: 'themes',
							component: () => import(/* webpackChunkName: "account" */'../pages/editProfile/Themes.vue'),
						},
					]
				},
				{
					path: 'chat',
					meta: { title: 'Chats' },
					name: 'chat',
					component: () => import(/* webpackChunkName: "account" */'../pages/Chats.vue'),
				},
				{
					path: 'select-game',
					meta: { title: 'Select Game' },
					name: 'selectGame',
					component: () => import(/* webpackChunkName: "account" */'../pages/SelectGamePage.vue'),
				},
				{
					path: 'profile/:username',
					name: 'profileUser',
					redirect: 'overview',
					meta: { title: 'Profile' },
					component: () => import(/* webpackChunkName: "create-contest" */'../layouts/ProfileLayout.vue'),
					children: [
						{
							path: '',
							name: 'overview',
							meta: { title: 'Profile' },
							component: () => import(/* webpackChunkName: "create-contest" */'../pages/profile/OverviewPage.vue')
						},
					]
				},
			]
		},
	]

export default routes