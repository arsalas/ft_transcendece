<template>
  <div class="container-app">
    <main>
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
      <h2 class="text is-extra">SEARCHING GAME</h2>
      <h3 class="text is-extra">{{ timmer }}</h3>
      <button class="button is-primary mt-4" :disabled="counter < 30">
        CANCEL
      </button>
    </main>
    <!-- <aside>
      <div class="user-info">
        <MediaObject
          :image="user.avatar!"
          :image-fallback="user.avatar42!"
          :name="user.username || user.login"
          :status="user.status"
          width="2.7rem" />
      </div>
      <FriendsAside />
    </aside> -->
  </div>
</template>
<script lang="ts" setup>
import { computed, defineAsyncComponent, inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useGameStore, useUserStore } from '../../../stores';
import { GameService } from '../../dashboard/services';
const FriendsAside = defineAsyncComponent(
  () => import('../../common/components/friends/FriendsAside.vue'),
);
const MediaObject = defineAsyncComponent(
  () => import('../../common/components/MediaObject.vue'),
);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const gameService = inject<GameService>('gameService')!;
const router = useRouter();
const gameStore = useGameStore();
const { type } = storeToRefs(gameStore);
const counter = ref<number>(0);

const timmer = computed(() => {
  let minutes = Math.floor(counter.value / 60);
  let extraSeconds = counter.value % 60;
  const secStr = extraSeconds < 10 ? '0' + extraSeconds : extraSeconds;
  return `${minutes}:${secStr}`;
});

const interval = setInterval(() => {
  counter.value++;
}, 1000);

const findGame = async () => {
  const res = await gameService.searchGame(type.value);
};

onMounted(() => {
  findGame();
});
</script>
<style lang="scss" scoped>
.container-app {
  display: flex;
  justify-content: center;
  height: 100vh;
  & main {
    flex: 1;
    // background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}

.user-info {
  width: var(--aside-w);
  height: var(--header-h);
  background-color: var(--bg-dark-0);
  padding: 0rem 1rem;
  display: flex;
  align-items: center;
  border-bottom: var(--border);
}
</style>
