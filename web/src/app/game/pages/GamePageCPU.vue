<template>
  <div class="main-container">
    <div class="actions">
      <div class="brand">
        <Logo />
      </div>
      <div class="action-buttons buttons">
        <button
          v-if="isMuted"
          @click="unmutedGame"
          class="button is-primary is-large is-outlined">
          <span class="icon is-small">
            <i class="fa-solid fa-volume-xmark"></i>
          </span>
        </button>

        <button
          v-if="!isMuted"
          @click="mutedGame"
          class="button is-primary is-medium">
          <span class="icon is-small">
            <i class="fa-solid fa-volume-high"></i>
          </span>
        </button>

        <!-- <button @click="exitGame" class="button is-primary is-medium">
          <span class="icon is-small">
            <i class="fa-solid fa-person-running"></i>
          </span>
        </button> -->
      </div>
    </div>
    <!-- <header>
      <div class="info-players">
        <div class="player text is-large">
          <Image
            :src="gameData?.players[0].avatar"
            :fallback="gameData?.players[0].avatar42" />
          {{ gameData?.players[0].username }}
          <img
            class="ml-4"
            :style="{backgroundColor: gameData!.players[0].color}"
            :src="gameData!.players[0].icon"
            alt="" />
        </div>
        <div class="player text is-large">
          <Image
            :src="gameData?.players[1].avatar"
            :fallback="gameData?.players[1].avatar42" />
          {{ gameData?.players[1].username }}
          <img
            class="ml-4"
            :style="{backgroundColor: gameData!.players[1].color}"
            :src="gameData!.players[1].icon"
            alt="" />
        </div>
      </div>
    </header> -->
    <div class="game-container">
      <div id="game" ref="app"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, onUnmounted, defineAsyncComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUserStore, useGameStore } from '../../../stores';

import { useGame } from '../composables';

import { providers } from '../../../providers';
import { GameData } from '../../../interfaces';
import { PongCPU } from '../classes/PongCPU';

// COMPONENTES
const Image = defineAsyncComponent(
  () => import('../../common/components/images/Image.vue'),
);
const Logo = defineAsyncComponent(
  () => import('../../common/components/ui/Logo.vue'),
);
const Start = defineAsyncComponent(() => import('../components/Start.vue'));
const Finish = defineAsyncComponent(() => import('../components/Finish.vue'));

// COMPOSABLES
const router = useRouter();
const route = useRoute();
const {
  app,
  canvas,
  game,
  isLoading,
  isMuted,
  isStart,
  isFinish,
  result,
  mutedGame,
  startGame,
  unmutedGame,
  createCanvasDiv,
  destroyGame,
} = useGame();

// STORES
const gameStore = useGameStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { type } = storeToRefs(gameStore);

// FUNCIONES

/**
 * Abandona el juego
 */
const exitGame = () => {
  router.push({ name: 'home' });
};

/**
 * Crea el juego
 */
const createdGame = () => {
  app.value = document.querySelector<HTMLDivElement>('#game')!;

  createCanvasDiv();
  game.value = new PongCPU(
    canvas,
    canvas.width,
    canvas.height,
    'pve',
    type.value,
  );

  startGame();
};

onMounted(async () => {
  // Crear la partida
    createdGame();
});

onUnmounted(() => {
  // Dejar de escuchar los eventos
  destroyGame();
});
</script>
<style lang="scss" scoped>
.main-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.game-container {
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.brand div {
  font-size: 2rem;
}

.actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 5rem;
  width: 100%;
  background-color: var(--bg-dark-0);
  border-bottom: var(--border);
}

header {
  height: 3rem;
  background-color: var(--bg-dark-1);
  border-bottom: var(--border);
  width: 100%;
  display: flex;
  justify-content: center;
}

.info-players {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 100%;

  & .player {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & img {
      height: 80%;
      border-radius: 50%;
      aspect-ratio: 1;
      object-fit: cover;
      object-position: denter;
      margin-right: 1rem;
      border: var(--border);
    }
  }
}

#game {
  width: 80%;
  height: 80%;
  border: var(--border);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  overflow: hidden;
  -webkit-box-shadow: 0px 0px 38px 5px rgba(var(--color-primary-rgb), 0.75);
  -moz-box-shadow: 0px 0px 38px 5px rgba(var(--color-primary-rgb), 0.75);
  box-shadow: 0px 0px 38px 5px rgba(var(--color-primary-rgb), 0.75);
}
</style>
