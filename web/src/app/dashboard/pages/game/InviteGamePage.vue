<template>
  <div class="game-container" v-if="inviteUser">
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
        @click="inviteGame"
        :disabled="typeGame === undefined">
        <MediaObject
          :image="inviteUser!.avatar"
          :image-fallback="inviteUser!.avatar42"
          :name="inviteUser!.username"
          :status="inviteUser.status"
          width="3rem" />
        <span class="ml-6"> SEND </span>
      </button>
    </div>
  </div>
  <Loader v-if="waitingAccept" is-fullsize />
</template>
<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { EModeGame, ETypeGame } from '../../../game/interfaces/game';
import { useGameStore, useUserStore } from '../../../../stores';
import { storeToRefs } from 'pinia';
import MediaObject from '../../../common/components/MediaObject.vue';
import { useSockets } from '../../../../sockets';
import Loader from '../../../common/components/Loader.vue';
import { FriendsService } from '../../services';
import { ChatService } from '../../services/ChatService';

const friendsService = inject<FriendsService>('friendsService')!;
const chatService = inject<ChatService>('chatService')!;

const { socketNotifications } = useSockets(friendsService, chatService);
// STORES
const gameStore = useGameStore();
const userStore = useUserStore();
const { inviteUser, waitingAccept } = storeToRefs(gameStore);
const { user } = storeToRefs(userStore);

// COMPOSABLES
const router = useRouter();

// VARIABLES
const typeGame = ref<ETypeGame>();

onMounted(() => {
  if (!inviteUser.value) router.push({ name: 'home' });
});

const selectType = (type: ETypeGame) => {
  typeGame.value = type;
};

const inviteGame = () => {
  gameStore.selectGameType(typeGame.value!);
  waitingAccept.value = true;
  socketNotifications.value?.emit('invite-game', {
    typeGame: typeGame.value,
    userId: inviteUser.value?.login,
    user: {
      login: user.value.login,
      username: user.value.username,
      avatar: user.value.avatar,
      avatar42: user.value.avatar42,
    },
  });
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
