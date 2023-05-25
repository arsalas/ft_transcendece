<template>
  <div class="game-container">
    <div class="columns">
      <div class="column">
        <div
          class="text is-large box-game"
          :class="{ selected: modeGame == EModeGame.PLAYER }"
          @click="selectGame(EModeGame.PLAYER)">
          <div>1P VS 2P</div>
          <div class="icon">
            <i class="fas fa-users"></i>
          </div>
        </div>
      </div>
      <div class="column">
        <div
          class="text is-large box-game"
          :class="{ selected: modeGame == EModeGame.CPU }"
          @click="selectGame(EModeGame.CPU)">
          <div>1P VS CPU</div>
          <div class="icon">
            <i class="fas fa-desktop"></i>
          </div>
        </div>
      </div>
      <div class="column">
        <!-- <router-link :to="{ name: 'gameSearch' }"> -->
        <div
          class="text is-large box-game"
          :class="{ selected: modeGame == EModeGame.ONLINE }"
          @click="selectGame(EModeGame.ONLINE)">
          <div>ONLINE</div>

          <div class="icon">
            <i class="fas fa-globe-europe"></i>
          </div>
        </div>
        <!-- </router-link> -->
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div
          class="text is-large box-game"
          :class="{ selected: typeGame == ETypeGame.ORIGINAL }"
          @click="selectType(ETypeGame.ORIGINAL)">
          ORIGINAL
        </div>
      </div>
      <div class="column">
        <div
          class="text is-large box-game"
          :class="{ selected: typeGame == ETypeGame.SPEED }"
          @click="selectType(ETypeGame.SPEED)">
          SPEED MODE
        </div>
      </div>
    </div>
    <div class="buttons-container">
      <button
        class="button is-primary is-large"
        @click="findGame"
        :disabled="modeGame === undefined || typeGame === undefined">
        START GAME
      </button>
      <button class="button is-primary is-large">INVITE USER</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { EModeGame, ETypeGame } from '../../../game/interfaces/game';
import { useGameStore } from '../../../../stores/game';

// STORES
const gameStore = useGameStore();

// COMPOSABLES
const router = useRouter();

// VARIABLES
const modeGame = ref<EModeGame>();
const typeGame = ref<ETypeGame>();
const isInvited = ref<boolean>(false);
const userInvited = ref<string>();

const selectGame = (mode: EModeGame) => {
  modeGame.value = mode;
};
const selectType = (type: ETypeGame) => {
  typeGame.value = type;
};

const findGame = () => {
  gameStore.selectGameType(typeGame.value!);
  switch (modeGame.value) {
    case EModeGame.CPU:
      router.push({ name: 'pve' });
      break;
    case EModeGame.ONLINE:
      router.push({ name: 'gameSearch' });
      break;
    case EModeGame.PLAYER:
      router.push({ name: 'pvp' });
      break;
  }
};
</script>
<style lang="scss" scoped>
.box-game {
  background-color: var(--bg-dark-0);
  border: var(--border);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: 300ms;
  &:hover {
    background-color: var(--color-primary-hover);
    // background-color: var(--bg-dark-2);
  }
  &.selected {
    background-color: var(--color-primary-hover);
  }
}

.game-container {
  height: calc(100vh - var(--header-h));
  padding: 0 4rem;
  display: flex;
  justify-content: space-around;
  //   align-items: center;
  flex-direction: column;
  width: 100%;
}

.buttons-container {
  display: flex;
  justify-content: center;
  & > button {
    margin: 0 2rem;
  }
}
</style>
