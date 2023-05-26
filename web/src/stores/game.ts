import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ETypeGame } from '../app/game/interfaces/game';
import { IFriendProfile, IUserProfile } from '../interfaces';

export const useGameStore = defineStore('game', () => {
  const type = ref<ETypeGame>(ETypeGame.ORIGINAL);
  const activeRoom = ref<string>();
  const inviteUser = ref<IFriendProfile>();
  const waitingAccept = ref<boolean>(false);
  const invitations = ref<
    {
      typeGame: ETypeGame;
      user: {
        login: string;
        username: string;
        avatar: string;
        avatar42: string;
      };
    }[]
  >([]);

  const selectGameType = (gameType: ETypeGame) => {
    type.value = gameType;
  };

  return {
    type,
    inviteUser,
    activeRoom,
    invitations,
	waitingAccept,
    selectGameType,
  };
});
