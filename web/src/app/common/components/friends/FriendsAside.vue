<template>
  <aside>
    <div v-if="invitations.length > 0">
      <header class="text friends-header">
        GAME INVITES({{ invitations.length }})
      </header>
      <div v-for="invitation in invitations">
        <InvitationBox :invitation="invitation" />
      </div>
    </div>

    <header class="friends-header">
      <div class="text">SOCIAL</div>
      <span class="icon text" @click="open">
        <i class="fa-solid fa-user-plus"></i>
      </span>
    </header>

    <!-- <div class="text px-3 py-1 friends-req is-clickable" v-if="pending.length > 0">
      Friends request
      <div class="badge is-primary">
        <span class="text is-small"> {{ pending.length }} </span>
      </div>
    </div> -->
    <AgrupedFriends
      v-if="pending.length > 0"
      :total="pending.length"
      :friends="pending"
      title="FRIENDS REQUESTS" />

    <AgrupedFriends :total="friends.length" :friends="online" title="ONLINE" />
    <AgrupedFriends
      :total="friends.length"
      :friends="offline"
      title="OFFLINE" />
  </aside>
  <Modal v-if="isOpen" :is-open-content="isOpenContent" @close="close">
    <Box>
      <template v-slot:header> ADD FRIENDS </template>
      <template v-slot:body>
        <p class="text">
          Already know your friend's username?Send them a friend request!
        </p>
        <form @submit.prevent="handleSubmit" class="mt-4">
          <div class="field">
            <div class="control">
              <input
                v-model.trim="sendUser"
                class="input"
                type="text"
                placeholder="Your friend username" />
            </div>
          </div>
        </form>

        <div class="text mt-4">SENT FRIEND REQUEST</div>
        <div style="max-height: 40vh">
          <div class="columns is-multiline mt-2">
            <div class="column is-4" v-for="fr in sending">
              <MediaObject
                width="2.5rem"
                :image="fr.profile.avatar"
                :image-fallback="fr.profile.avatar42"
                :name="fr.profile.username"
                :status="fr.profile.status" />
            </div>
          </div>
        </div>

        <footer class="mt-4" style="display: flex; justify-content: center">
          <button @click="close" class="button is-primary">DONE</button>
        </footer>
      </template>
    </Box>
  </Modal>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, inject, provide, ref } from 'vue';
import { useModal } from '../../composables';
import { useFriendsStore, useGameStore } from '../../../../stores';
import { storeToRefs } from 'pinia';
import { useSockets, useSocketsGame } from '../../../../sockets';
import InvitationBox from './InvitationBox.vue';
import { FriendsService } from '../../../dashboard/services';

// COMPONENTS
const AgrupedFriends = defineAsyncComponent(
  () => import('./AgrupedFriends.vue'),
);
const Modal = defineAsyncComponent(() => import('../ui/Modal.vue'));
const Box = defineAsyncComponent(() => import('../ui/Box.vue'));
const MediaObject = defineAsyncComponent(() => import('../MediaObject.vue'));

// COMPOSABLES
const { isOpen, isOpenContent, close, open } = useModal();

const friendsStore = useFriendsStore();
const gameStore = useGameStore();
const { offline, online, friends, pending, sending } =
  storeToRefs(friendsStore);
const { invitations } = storeToRefs(gameStore);

const friendsService = inject<FriendsService>('friendsService')!;


const { socketNotifications } = useSockets(friendsService);
// const { socketGame } = useSocketsGame();

// const friendsService = inject<FriendsService>('friendsService')!;

const sendUser = ref<string>('');
const handleSubmit = async () => {
  socketNotifications.emit('send-request', sendUser.value);
  //   const newFriend = await friendsService.sendRequest(sendUser.value);
  //   friends.value.push(newFriend);
};
</script>
<style lang="scss" scoped>
aside {
  width: var(--aside-w);
  height: calc(100vh - var(--header-h));
  background-color: var(--bg-dark-0);
  position: sticky;
  top: var(--header-h);
  overflow-y: auto;
  //   border-left: var(--border)
}

.friends-header {
  padding: 0.25rem 1rem;
  display: flex;
  justify-content: space-between;
  background-color: var(--bg-dark-2);
  position: sticky;
  top: 0px;
  cursor: pointer;
  //   border-bottom: var(--border);
}

.friends-req {
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: rgba(var(--color-primary-rgb), 0.5);
  }
}
</style>
