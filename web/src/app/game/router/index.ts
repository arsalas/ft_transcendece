import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/game',
    name: 'gameLayout',
    redirect: { name: 'game' },
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "game" */ '../layouts/GameLayout.vue'),
    children: [
      {
        path: '',
        name: 'game',
        meta: { title: 'Game' },
        component: () =>
          import(/* webpackChunkName: "game" */ '../pages/GamePage.vue'),
      },
    ],
  },
];

export default routes;
