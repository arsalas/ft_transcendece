<template>
  <div class="invitations text">
    <MediaObject
      width="2.5rem"
      :image="invitation.user.avatar"
      :image-fallback="invitation.user.avatar42"
      :name="`${invitation.user.username} invites play`" />

    <div class="info">
      <span class="text is-small"> {{ invitation.typeGame }} game </span>
      <div class="actions">
        <span class="icon text" @click="handleAccept">
          <i class="fa-solid fa-check"></i>
        </span>
        <span class="icon text" @click="handleReject">
          <i class="fa-solid fa-xmark"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useSocketsGame } from '../../../../sockets';
import { useGameStore, useUserStore } from '../../../../stores';
import { ETypeGame } from '../../../game/interfaces/game';
import MediaObject from '../MediaObject.vue';

const props = defineProps<{
  invitation: {
    typeGame: ETypeGame;
    user: {
      login: string;
      username: string;
      avatar: string;
      avatar42: string;
    };
  };
}>();

const { socketGame } = useSocketsGame();
const userStore = useUserStore();
const gameStore = useGameStore();
const { user } = storeToRefs(userStore);
const { invitations } = storeToRefs(gameStore);

const handleAccept = () => {
  socketGame.value!.emit('accept-game', {
    type: props.invitation.typeGame,
    userId1: props.invitation.user.login,
    userId2: user.value.login,
  });
  const index = invitations.value.findIndex(
    (invit) => invit.user.login == props.invitation.user.login,
  );
  invitations.value.splice(index, 1);
};

const handleReject = () => {
  socketGame.value!.emit('reject-game', {
    userId1: user.value.login,
    userId2: props.invitation.user.login,
  });
  const index = invitations.value.findIndex(
    (invit) => invit.user.login == props.invitation.user.login,
  );
  invitations.value.splice(index, 1);
};
</script>
<style lang="scss" scoped>
.invitations {
  background-color: var(--color-primary-hover);
  padding: 0.5rem 1.25rem;

  & .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
