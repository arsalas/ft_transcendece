<template>
  <div class="section">
    <div class="columns">
      <div class="column">
        <div class="text is-large box-game" @click="selectGame('pvp')">PVP</div>
      </div>
      <div class="column">
        <div class="text is-large box-game" @click="selectGame('pve')">PVE</div>
      </div>
      <div class="column">
        <div class="text is-large box-game">ONLINE</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useGameStore } from '../../../stores/game';

// STORES
const gameStore = useGameStore();

// COMPOSABLES
const router = useRouter();

const selectGame = (mode: 'pvp' | 'pve' | 'online') => {
  gameStore.selectGameMode(mode);
  router.push({ name: 'game' });
};
</script>
<style lang="scss" scoped>
.box-game {
  background-color: var(--bg-dark-0);
  border: var(--border);
  padding: 2rem;
  text-align: center;
}
</style>
