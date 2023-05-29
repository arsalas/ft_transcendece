<template>
  <MediaObject
    width="2.5rem"
    :image="friend.profile.avatar"
    :image-fallback="friend.profile.avatar42"
    :name="friend.profile.username"
    :status="friend.profile.status" />
  <div v-if="friend.activedAt" class="actions">
    <div class="badge is-primary">
      <span class="text is-small"> 1 </span>
    </div>

    <div class="dropdown is-right is-active" @click="isOpen = true">
      <div class="dropdown-trigger">
        <button class="ml-2 action-button text">
          <i class="fas fa-ellipsis-v"></i>
        </button>
      </div>
      <Transition
        name="custom-classes"
        enter-active-class="animate__animated animate__fadeIn animate__faster"
        leave-active-class="animate__animated animate__fadeOut animate__faster">
        <div
          v-if="isOpen"
          v-click-away="onClickAway"
          class="dropdown-menu"
          role="menu">
          <div class="dropdown-content">
            <a href="#" class="dropdown-item text is-small"> Invite to Game </a>
            <a
              href="#"
              @click="openDirChat()"
              class="dropdown-item text is-small">
              Send Message
            </a>
            <a href="#" class="dropdown-item text is-small"> Spectate Game </a>
            <a href="#" class="dropdown-item text is-small"> View Profile </a>
            <a @click="refuseFriend" class="dropdown-item text is-small">
              Unfriend
            </a>
            <a href="#" class="dropdown-item text is-small"> Block </a>
          </div>
        </div>
      </Transition>
    </div>
  </div>
  <div v-else class="actions">
    <span class="icon" @click="acceptFriend">
      <i class="fa-solid fa-check"></i>
    </span>
    <span class="icon" @click="refuseFriend">
      <i class="fa-solid fa-xmark"></i>
    </span>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';
import { IFriend } from '../../../../interfaces/friends';
import { providers } from '../../../../providers';
import { useChatStore, useFriendsStore } from '../../../../stores';
import { storeToRefs } from 'pinia';
import { useSockets } from '../../../../sockets';
import { ChatService } from '../../../dashboard/services';

const MediaObject = defineAsyncComponent(() => import('../MediaObject.vue'));

const props = defineProps<{
  friend: IFriend;
}>();
const { socketNotifications } = useSockets();
const firendsStore = useFriendsStore();
const chatStore = useChatStore();
const { friends } = storeToRefs(firendsStore);
const { friendsService } = providers();
const { chatService } = providers();

const isOpen = ref<boolean>(false);
const onClickAway = (event: any) => {
  isOpen.value = false;
};

const openDirChat = async () => {
  try {
    chatStore.open(props.friend.profile);
    chatService.openDirectChat(props.friend.profile.login);
  } catch (error) {}
};

const acceptFriend = async () => {
  try {
    await friendsService.acceptRequest(props.friend.profile.login);
    props.friend.activedAt = new Date().toDateString();
    socketNotifications.emit('accept-request', props.friend.profile.login);
  } catch (error) {}
};
const refuseFriend = async () => {
  try {
    await friendsService.unfriend(props.friend.profile.login);
    const i = friends.value.findIndex(
      (f) => f.profile.login == props.friend.profile.login,
    );
    friends.value.splice(i, 1);
    socketNotifications.emit('refuse-request', props.friend.profile.login);
  } catch (error) {}
};
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.action-button {
  background-color: inherit;
  color: var(--text-color);
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  aspect-ratio: 1;
}
</style>
