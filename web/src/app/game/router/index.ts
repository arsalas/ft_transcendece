import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/game-search',
    name: 'gameSearch',
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "game" */ '../pages/GameSearchPage.vue'),
    children: [],
  },
  {
    path: '/game',
    name: 'gameLayout',
    redirect: { name: 'game' },
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "game" */ '../layouts/GameLayout.vue'),
    children: [
      {
        path: 'pvp',
        name: 'pvp',
        meta: { title: 'Game' },
        component: () =>
          import(/* webpackChunkName: "game" */ '../pages/GamePagePlayer.vue'),
      },
      {
        path: 'pve',
        name: 'pve',
        meta: { title: 'Game' },
        component: () =>
          import(/* webpackChunkName: "game" */ '../pages/GamePageCPU.vue'),
      },
      {
        path: ':id',
        name: 'online',
        meta: { title: 'Game' },
        component: () =>
          import(/* webpackChunkName: "game" */ '../pages/GamePageOnline.vue'),
      },
    ],
  },
];

export default routes;
