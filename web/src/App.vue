<script setup lang="ts">
import { defineAsyncComponent, onMounted, provide } from 'vue';
import { useRouter } from 'vue-router';

import { useNotifications } from './app/common/composables/useNotifications';
import { useAuthStore, useUserStore } from './stores';
import { storeToRefs } from 'pinia';
import { useStart } from './composables';
import {
AchivementsService,
  EditProfieService,
  FriendsService,
  GameService,
  ProfileService,
} from './app/dashboard/services';
import { AuthService } from './app/auth/services/authService';
import { Http } from './api';
import { ChatService } from './app/dashboard/services/ChatService';

// COMPONENTES
const Notification = defineAsyncComponent(
  () => import('./app/common/components/ui/Notification.vue'),
);

// PROVIDERS
const http = new Http();

const editProfileService = new EditProfieService(http);
const profileService = new ProfileService(http);
const authService = new AuthService(http);
const friendsService = new FriendsService(http);
const gameService = new GameService(http);
const chatService = new ChatService(http);
const achivementsService = new AchivementsService(http);

provide('editProfileService', editProfileService);
provide('profileService', profileService);
provide('authService', authService);
provide('friendsService', friendsService);
provide('gameService', gameService);
provide('chatService', chatService);
provide('achivementsService', achivementsService);

// STORES
const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

const { user } = storeToRefs(userStore);

// COMPOSABLES
const { isOpen } = useNotifications();
const { startApp } = useStart(authService, friendsService,chatService);

// FUNCTIONS
onMounted(async () => {
  try {
    await startApp();
    if (authStore.isAuth && !user.value.username)
      router.push({ name: 'editProfile' });
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
