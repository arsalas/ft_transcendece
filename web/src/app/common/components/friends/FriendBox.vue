<template>
  <MediaObject
    width="2.5rem"
    :image="friend.profile.avatar"
    :image-fallback="friend.profile.avatar42"
    :name="friend.profile.username"
    :status="friend.profile.status" />
  <div v-if="friend.activedAt" class="actions">
    <div class="badge is-primary" v-if="friend.noRead > 0">
      <span class="text is-small">
        {{ friend.noRead > 9 ? '+9' : friend.noRead }}
      </span>
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
            <a
              v-if="friend.profile.status == 'online'"
              @click.stop="inviteGame"
              class="dropdown-item text is-small">
              Invite to Game
            </a>
            <a @click.stop="openChat" class="dropdown-item text is-small">
              Send Message
            </a>
            <a
              v-if="friend.profile.status == 'game'"
              @click="getIdGame"
              href="#"
              class="dropdown-item text is-small">
              Spectate Game
            </a>
            <router-link
              @click.stop="isOpen = false"
              :to="{
                name: 'profileUser',
                params: { username: friend.profile.username },
              }"
              class="dropdown-item text is-small">
              View Profile
            </router-link>
            <a @click.stop="refuseFriend" class="dropdown-item text is-small">
              Unfriend
            </a>
            <a
              @click="unblockUser"
              v-if="friend.isBlock"
              href="#"
              class="dropdown-item text is-small">
              Unblock
            </a>
            <a
              @click="blockUser"
              v-else
              href="#"
              class="dropdown-item text is-small">
              Block
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </div>
  <div v-else class="actions">
    <span class="icon text is-clickable" @click="acceptFriend">
      <i class="fa-solid fa-check"></i>
    </span>
    <span class="icon text is-clickable" @click="refuseFriend">
      <i class="fa-solid fa-xmark"></i>
    </span>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, inject, ref } from 'vue';
import { IFriendMessages } from '../../../../interfaces/friends';
import { useFriendsStore, useGameStore } from '../../../../stores';
import { storeToRefs } from 'pinia';
import { useSockets } from '../../../../sockets';
import { useRouter } from 'vue-router';
import { useChatStore } from '../../../../stores/chats';
import { FriendsService, GameService } from '../../../dashboard/services';
import { ChatService } from '../../../dashboard/services/ChatService';

const MediaObject = defineAsyncComponent(() => import('../MediaObject.vue'));

const props = defineProps<{
  friend: IFriendMessages;
}>();

const friendsService = inject<FriendsService>('friendsService')!;
const gameService = inject<GameService>('gameService')!;
const chatService = inject<ChatService>('chatService')!;

const router = useRouter();
const { socketNotifications } = useSockets(friendsService, chatService);
const firendsStore = useFriendsStore();
const chatStore = useChatStore();
const gameStore = useGameStore();
const { friends } = storeToRefs(firendsStore);

const isOpen = ref<boolean>(false);
const onClickAway = () => {
  isOpen.value = false;
};

const inviteGame = () => {
  onClickAway();
  gameStore.inviteUser = props.friend.profile;
  router.push({ name: 'inviteGame' });
};

const getIdGame = async () => {
  try {
    const game = await gameService.getActiveGameId(props.friend.profile.login);
    router.push({ name: 'online', params: { id: game.id } });
  } catch (error) {}
};

const acceptFriend = async () => {
  try {
    await friendsService.acceptRequest(props.friend.profile.login);
    props.friend.activedAt = new Date().toDateString();
    socketNotifications.value?.emit(
      'accept-request',
      props.friend.profile.login,
    );
  } catch (error) {}
};
const refuseFriend = async () => {
  try {
    await friendsService.unfriend(props.friend.profile.login);
    const i = friends.value.findIndex(
      (f) => f.profile.login == props.friend.profile.login,
    );
    friends.value.splice(i, 1);
    socketNotifications.value?.emit(
      'refuse-request',
      props.friend.profile.login,
    );
  } catch (error) {}
};

const openChat = async () => {
  onClickAway();
  const chat = await chatService.getDirectChat(props.friend.profile.login);
  chatStore.chatId = chat.id;
  chatStore.messages = chat.messages;
  chatStore.open(props.friend.profile);
  firendsStore.resetUserMessages(props.friend.profile.login);
};

const blockUser = async () => {
  try {
    await friendsService.block(props.friend.profile.login);
    props.friend.isBlock = true;
  } catch (error) {}
};

const unblockUser = async () => {
  try {
    await friendsService.unblock(props.friend.profile.login);
    props.friend.isBlock = false;
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
  padding: 0rem;
  aspect-ratio: 1;
}

.icon.text:hover {
  color: rgba(var(--color-primary-rgb), 0.5);
}
</style>
