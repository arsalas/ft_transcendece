import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'app',
    redirect: { name: 'home' },
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "app" */ '../layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        meta: { title: 'Home' },
        component: () =>
          import(/* webpackChunkName: "home" */ '../pages/HomePage.vue'),
      },
      {
        path: 'edit-profile',
        name: 'profileLayout',
        redirect: 'editProfile',
        meta: { title: 'Profile' },
        component: () =>
          import(
            /* webpackChunkName: "editProfile" */ '../layouts/EditProfile.vue'
          ),
        children: [
          {
            path: '',
            name: 'editProfile',
            meta: { title: 'Edit Profile' },
            component: () =>
              import(
                /* webpackChunkName: "editProfile" */ '../pages/editProfile/ProfilePage.vue'
              ),
          },
          {
            path: 'two-factor-auth',
            meta: { title: 'Two-Factor Auth' },
            name: 'twoFactorAuth',
            component: () =>
              import(
                /* webpackChunkName: "twoFactorAuth" */ '../pages/editProfile/TwoFactorAuthPage.vue'
              ),
          },
          {
            path: 'blocking',
            meta: { title: 'Blocking' },
            name: 'blocking',
            component: () =>
              import(
                /* webpackChunkName: "blocking" */ '../pages/editProfile/BlockingPage.vue'
              ),
          },
          {
            path: 'themes',
            meta: { title: 'Themes' },
            name: 'themes',
            component: () =>
              import(
                /* webpackChunkName: "themes" */ '../pages/editProfile/ThemesPage.vue'
              ),
          },
        ],
      },
      {
        path: 'chat',
        meta: { title: 'Chats' },
        name: 'chat',
        component: () =>
          import(/* webpackChunkName: "chat" */ '../pages/ChatsPage.vue'),
      },
      {
        path: 'ladder',
        meta: { title: 'Ladder' },
        name: 'ladder',
        component: () =>
          import(/* webpackChunkName: "account" */ '../pages/LadderPage.vue'),
      },
      {
        path: 'select-game',
        meta: { title: 'Select Game' },
        name: 'selectGame',
        component: () =>
          import(
            /* webpackChunkName: "selectGame" */ '../pages/game/SelectGamePage.vue'
          ),
      },
      {
        path: 'invite-game',
        meta: { title: 'Invite Game' },
        name: 'inviteGame',
        component: () =>
          import(
            /* webpackChunkName: "inviteGame" */ '../pages/game/InviteGamePage.vue'
          ),
      },
      {
        path: 'profile/:username',
        name: 'profileUser',
        redirect: { name: 'overview' },
        meta: { title: 'Profile' },
        component: () =>
          import(
            /* webpackChunkName: "profileUser" */ '../layouts/ProfileLayout.vue'
          ),
        children: [
          {
            path: '',
            name: 'overview',
            meta: { title: 'Profile' },
            component: () =>
              import(
                /* webpackChunkName: "overview" */ '../pages/profile/OverviewPage.vue'
              ),
          },
          {
            path: 'history',
            name: 'history',
            meta: { title: 'Profile' },
            component: () =>
              import(
                /* webpackChunkName: "history" */ '../pages/profile/HistoryPage.vue'
              ),
          },
        ],
      },
    ],
  },
];

export default routes;
