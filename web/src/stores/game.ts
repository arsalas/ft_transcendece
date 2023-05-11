import { ref } from 'vue';
import { defineStore } from 'pinia';

type GameMode = 'pvp' | 'pve' | 'online';

export const useGameStore = defineStore('game', () => {
  const mode = ref<GameMode>('pve');
  const activeRoom = ref<string>();

  const selectGameMode = (gameMode: GameMode) => {
    mode.value = gameMode;
  };

  return {
    mode,
    activeRoom,
    selectGameMode,
  };
});
