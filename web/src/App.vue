<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useNotifications } from './app/common/composables/useNotifications';
import { providers } from './providers';
import { useAuthStore, useThemeStore, useUserStore } from './stores';

// COMPONENTES
const Notification = defineAsyncComponent(
  () => import('./app/common/components/Notification.vue'),
);

// PROVIDERS
const { authService } = providers();

// STORES
const authStore = useAuthStore();
const userStore = useUserStore();
const themeStore = useThemeStore();
const router = useRouter();

// COMPOSABLES
const { isOpen } = useNotifications();

// FUNCTIONS
onMounted(async () => {
  try {
    themeStore.loadTheme();
    const authToken = authStore.token;
    if (!authToken) return;
    const { token, user } = await authService.recoverSession();
    authStore.signIn(token);
    userStore.setUser(user);
  } catch (error) {
    authStore.logOut();
    router.push({ name: 'signin' });
  }
});
</script>

<template>
  <div class="app">
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__slideInRight animate__faster"
      leave-active-class="animate__animated animate__slideOutRight animate__faster">
      <Notification v-if="isOpen" message="Holasfdad" />
    </Transition>
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  background-image: linear-gradient(
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 1)
    ),
    url('./assets/bg_spash.jpg');
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
}
</style>
