import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ETypeGame } from '../app/game/interfaces/game';

export const useGameStore = defineStore('game', () => {
  const type = ref<ETypeGame>(ETypeGame.ORIGINAL);
  const activeRoom = ref<string>();

  const selectGameType = (gameType: ETypeGame) => {
    type.value = gameType;
  };

  return {
    type,
    activeRoom,
    selectGameType,
  };
});
