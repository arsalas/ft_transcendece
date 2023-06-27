import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import authRoutes from '../app/auth/router';
import dashboardRoutes from '../app/dashboard/router';
import gameRoutes from '../app/game/router';

import { isAuth } from '../guards';

const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...gameRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  document.title = (to.meta?.title as string) ?? 'Cyberpong';
  if (to.meta.requiresAuth && !isAuth()) {
    return {
      name: 'signin',
    };
  }
});

export default router;
