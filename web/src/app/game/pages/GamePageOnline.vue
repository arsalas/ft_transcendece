<template>
  <div class="main-container" v-if="!isLoading">
    <div class="actions">
      <div class="brand">
        <div class="text">CYBERP<i class="fa-solid fa-circle"></i>NG</div>
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
          class="button is-primary is-large">
          <span class="icon is-small">
            <i class="fa-solid fa-volume-high"></i>
          </span>
        </button>
        <button
          v-if="!isStart"
          @click="startGame"
          class="button is-primary is-large">
          <span class="icon is-small">
            <i class="fa-solid fa-play"></i>
          </span>
        </button>
        <button
          v-if="isStart"
          @click="exitGame"
          class="button is-primary is-large">
          <span class="icon is-small">
            <i class="fa-solid fa-person-running"></i>
          </span>
        </button>
      </div>
    </div>
    <header>
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
    </header>
    <div class="game-container">
      <div id="game" ref="app"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, onUnmounted, provide } from 'vue';
import { PongGame } from '../helpers';
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from '../../../stores/game';
import { useUserStore } from '../../../stores';
import { storeToRefs } from 'pinia';
import Image from '../../common/components/images/Image.vue';
import { providers } from '../../../providers';

import { GameData } from '../../dashboard/services/GameService';
import { useSocketsGame } from '../../../sockets';
import Flag from '../../common/components/Flag.vue';

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const isLoading = ref<boolean>(true);

const gameData = ref<GameData>();

const { gameService } = providers();

const isMuted = ref<boolean>(false);
const isStart = ref<boolean>(false);
const app = ref<HTMLDivElement>();
const game = ref<PongGame>();
const canvas = document.createElement('canvas');

const { socketGame } = useSocketsGame();

const mutedGame = () => {
  isMuted.value = true;
  game.value?.muted();
};

const unmutedGame = () => {
  isMuted.value = false;
  game.value?.unMuted();
};

const startGame = () => {
  isStart.value = true;
  game.value?.startGame();
};

const exitGame = () => {
  router.push({ name: 'home' });
};

const getGameData = async () => {
  isLoading.value = true;
  try {
    gameData.value = await gameService.get(route.params.id as string);
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getGameData();
  canvas.height = app.value!.clientHeight - 1;
  canvas.width = app.value!.clientWidth - 1;
  document.querySelector('#game')!.appendChild(canvas);

  game.value = new PongGame(
    canvas,
    canvas.width,
    canvas.height,
    'online',
    user.value.login == gameData.value?.players[0].login ? 'left' : 'right',
    socketGame.value,
    gameData.value?.id,
    {
      player: gameData.value?.players[0].login,
      rival: gameData.value?.players[1].login,
    },
  );
  game.value.startGame();
});

onUnmounted(() => {
  game.value!.destructor();
  delete game.value;
  window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
  game.value?.resizeWindows(app.value!.clientWidth, app.value!.clientHeight);
};
window.addEventListener('resize', handleResize);
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
