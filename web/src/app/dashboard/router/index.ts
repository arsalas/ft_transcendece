import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'app',
    redirect: { name: 'home' },
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "account" */ '../layouts/DashboardLayout.vue'
      ),
    children: [
      {
        path: '',
        name: 'home',
        meta: { title: 'Home' },
        component: () =>
          import(
            /* webpackChunkName: "create-contest" */ '../pages/HomePage.vue'
          ),
      },
      {
        path: 'edit-profile',
        name: 'profileLayout',
        redirect: 'editProfile',
        meta: { title: 'Profile' },
        component: () =>
          import(
            /* webpackChunkName: "create-contest" */ '../layouts/EditProfileLayout.vue'
          ),
        children: [
          {
            path: '',
            name: 'editProfile',
            meta: { title: 'Edit Profile' },
            component: () =>
              import(
                /* webpackChunkName: "create-contest" */ '../pages/editProfile/ProfilePage.vue'
              ),
          },
          {
            path: 'two-factor-auth',
            meta: { title: 'Two-Factor Auth' },
            name: 'twoFactorAuth',
            component: () =>
              import(
                /* webpackChunkName: "account" */ '../pages/editProfile/TwoFactorAuthPage.vue'
              ),
          },
          {
            path: 'blocking',
            meta: { title: 'Blocking' },
            name: 'blocking',
            component: () =>
              import(
                /* webpackChunkName: "account" */ '../pages/editProfile/BlockingPage.vue'
              ),
          },
          {
            path: 'themes',
            meta: { title: 'Themes' },
            name: 'themes',
            component: () =>
              import(
                /* webpackChunkName: "account" */ '../pages/editProfile/ThemesPage.vue'
              ),
          },
        ],
      },
      {
        path: 'chat',
        meta: { title: 'Chats' },
        name: 'chat',
        component: () =>
          import(/* webpackChunkName: "account" */ '../pages/ChatsPage.vue'),
      },
      {
        path: 'select-game',
        meta: { title: 'Select Game' },
        name: 'selectGame',
        component: () =>
          import(
            /* webpackChunkName: "account" */ '../pages/SelectGamePage.vue'
          ),
      },
    ],
  },
];

export default routes;
