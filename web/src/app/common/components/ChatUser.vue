<template>
  <div class="user-chat">
    <MediaObject
      width="2.5rem"
      :image="user!.avatar"
      :image-fallback="user!.avatar42"
      :name="user!.username" />
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
              v-if="!user.isOwner"
              @click.stop="addAdmin()"
              class="dropdown-item text is-small">
              Add admin
            </a>
            <a
              v-if="!user.isOwner && isUserAdmin"
              @click.stop="kickUser()"
              class="dropdown-item text is-small">
              Kick
            </a>
            <a
              v-if="isUserAdmin"
              @click.stop="muteUser()"
              class="dropdown-item text is-small">
              Mute User
            </a>
            <a
              v-if="isUserAdmin"
              @click.stop="banUser()"
              class="dropdown-item text is-small">
              Ban User
            </a>
            <router-link
              @click.stop="isOpen = false"
              :to="{
                name: 'profileUser',
                params: { username: user.username },
              }"
              class="dropdown-item text is-small">
              View Profile
            </router-link>
            <router-link
              @click.stop="isOpen = false"
              :to="{
                name: 'profileUser',
                params: { username: user.username },
              }"
              class="dropdown-item text is-small">
              View Profile
            </router-link>
            <!-- <a
              v-if="friend.profile.status == 'online'"
              @click.stop="inviteGame"
              class="dropdown-item text is-small">
              Invite to Game
            </a>
           
            <router-link
              @click.stop="isOpen = false"
              :to="{
                name: 'profileUser',
                params: { username: friend.profile.username },
              }"
              class="dropdown-item text is-small">
              View Profile
            </router-link> -->
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, inject, ref } from 'vue';
import { IUserChat } from '../../../interfaces';
import { ChatService } from '../../dashboard/services/ChatService';

const props = defineProps<{
  user: IUserChat;
  isUserAdmin: boolean;
  isUserOwner: boolean;
  chatId: string;
}>();

const MediaObject = defineAsyncComponent(
  () => import('../../common/components/MediaObject.vue'),
);
const chatService = inject<ChatService>('chatService')!;

const isOpen = ref<boolean>(false);
const onClickAway = () => {
  isOpen.value = false;
};

const addAdmin = async () => {
  try {
    await chatService.addAdmin(props.user.login, props.chatId);
    props.user.isAdmin = true;
    onClickAway();
  } catch (error) {
  } finally {
  }
};

const muteUser = async () => {
  try {
    await chatService.muteUser(props.user.login, props.chatId, 10);
    props.user.isAdmin = true;
    onClickAway();
  } catch (error) {
  } finally {
  }
};

const banUser = async () => {
  try {
    await chatService.banUser(props.user.login, props.chatId);
    props.user.isAdmin = true;
    onClickAway();
  } catch (error) {
  } finally {
  }
};

const kickUser = async () => {
  try {
    await chatService.kickUser(props.user.login, props.chatId);
	// TODO remove user from userArray
    onClickAway();
  } catch (error) {
  } finally {
  }
};

</script>
<style lang="scss" scoped>
.user-chat {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
