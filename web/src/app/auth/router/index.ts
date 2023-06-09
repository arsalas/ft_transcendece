import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'auth',
    redirect: { name: 'contestDetails' },
    // meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "account" */ '../layout/AuthLayout.vue'),
    children: [
      {
        path: 'signin',
        name: 'signin',
        meta: { title: 'Sign In' },
        component: () =>
          import(
            /* webpackChunkName: "create-contest" */ '../pages/SignInPage.vue'
          ),
      },
      {
        path: 'confirm',
        name: 'confirm',
        meta: { title: 'Confirm' },
        component: () =>
          import(
            /* webpackChunkName: "create-contest" */ '../pages/ConfirmPage.vue'
          ),
      },
    ],
  },
];

export default routes;
