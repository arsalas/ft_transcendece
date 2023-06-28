<template>
  <div class="chat-container">
    <header>
      <div class="left">
        <div v-if="type == EChatType.Direct" class="media-object">
          <MediaObject
            width="2.5rem"
            :image="userChat!.avatar"
            :image-fallback="userChat!.avatar42"
            :name="userChat!.username"
            :status="userChat!.status" />
        </div>
        <div v-else class="text">{{ name }} ({{ users?.length() }} users)</div>
      </div>

      <div class="right">
        <!-- <button @click="chatStore.close" class="close-chat button is-primary">
            X
          </button> -->
        <div
          v-if="type != EChatType.Direct && !isShowUsers"
          class="dropdown is-right is-active"
          @click="isOpen = true">
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
                  @click.stop="showUsers()"
                  class="dropdown-item text is-small">
                  See users
                </a>
                <a
                  @click.stop="exitChannel()"
                  class="dropdown-item text is-small">
                  Exit channel
                </a>
              </div>
            </div>
          </Transition>
        </div>
        <div v-if="type != EChatType.Direct && isShowUsers">
          <button @click="isShowUsers = false" class="ml-2 action-button text">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div v-if="type == EChatType.Direct">
          <button @click="chatStore.close()" class="ml-2 action-button text">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </header>

    <div class="chat pattern" ref="refChat">
      <!-- <div class="conversation-start">
          <span>Today, 9:00 PM</span>
        </div> -->

      <div class="conversation-msg" v-if="!isShowUsers">
        <ul>
          <li
            v-for="message in messages"
            class="bubble text"
            :class="message.userId == user.login ? 'me' : 'other'">
            <div v-if="message.userId != user.login" class="username is-large">
              {{ message.userId }}
            </div>
            {{ message.message }}
          </li>
        </ul>
      </div>

      <div class="users-list" v-else>
        <div class="item-user" v-for="userDetails in users">
          <MediaObject
            width="2.5rem"
            :image="userDetails!.avatar"
            :image-fallback="userDetails!.avatar42"
            :name="userDetails!.username" />
        </div>
      </div>
    </div>

    <footer v-if="!isShowUsers">
      <form @submit.prevent="onSubmit()">
        <input
          v-model.trim="newMessage"
          type="text"
          placeHolder="Enviar mensaje"
          class="input" />
      </form>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref, onMounted, nextTick } from 'vue';

import { useUserStore } from '../../../stores';
import { EChatType } from '../../../interfaces';
import { IChat } from '../../../interfaces/chat';
import { IFriendProfile } from '../../../interfaces';
import { storeToRefs } from 'pinia';
import { useChatStore } from '../../../stores/chats';

const MediaObject = defineAsyncComponent(
  () => import('../../common/components/MediaObject.vue'),
);

const props = defineProps<{
  id?: string;
  userChat?: IFriendProfile;
  name?: string;
  type: EChatType;
  messages: IChat[];
  users?: IFriendProfile[];
}>();

const chatStore = useChatStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
// const {} = storeToRefs(chatStore)

const newMessage = ref<string>('');
const refChat = ref<HTMLDivElement>();

const onClickAway = (event: any) => {
  isOpen.value = false;
};

const isOpen = ref<boolean>(false);
const isShowUsers = ref<boolean>(false);

onMounted(() => {});

const exitChannel = () => {};

const showUsers = () => {
  onClickAway();
  isShowUsers.value = true;
};

const onSubmit = async () => {
  if (newMessage.value.length == 0) return;

  props.messages.push({
    createdAt: new Date(),
    isRead: true,
    message: newMessage.value,
    userId: user.value.login,
  });
  newMessage.value = '';
  if (!refChat.value) return;
  nextTick(() => {
    refChat.value!.scroll({
      top: refChat.value!.scrollHeight - refChat.value!.clientHeight,
      behavior: 'smooth',
    });
  });
};
</script>

<style lang="scss" scoped>
.chat-container {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  //   background-color: var(--bg-dark-0);
  border: solid 1px var(--color-primary);

  & header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.2rem 1rem;
    background-color: var(--bg-dark-1);
    border-bottom: solid 1px var(--color-primary);

    .left {
      height: 100%;
      display: flex;
      align-items: center;

      & .media-object {
        height: 100%;
        display: flex;

        & .avatar {
          height: 100%;
          aspect-ratio: 1;
          border-radius: 50%;
        }
      }

      & .media-text {
        display: flex;
        flex-direction: column;
        padding-left: 1rem;
      }
    }

    .right {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }

  & footer {
    height: 70px;

    & form,
    input {
      height: 100%;
      border: none;
      border-top: solid 0.5px var(--color-primary);
    }
  }

  & .chat {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: calc(100% - 50px);
    align-items: end;
    overflow: auto;
    overflow-x: hidden;
    padding: 0.5rem;

    & .conversation-start {
      height: 10%;
      width: 100%;
      margin-bottom: 2rem;
      text-align: center;
      width: 100%;

      span {
        display: flex;
        font-size: 1rem;
        padding: 0.5rem 2rem;
        display: inline-block;
        background: white;
        color: var(--color-bg-primary);
        border-radius: 5px;
      }
    }

    & .conversation-msg {
      width: 100%;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }

    ul {
      width: 100%;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }

    & .bubble {
      max-width: 75%;
      margin-bottom: 10px;
      padding: 0.4rem 0.5rem;
      border-radius: 1rem;

      & .username {
        font-weight: bold;
      }
    }

    .bubble.other {
      align-self: flex-start;
      background-color: var(--bg-dark-2);
      box-shadow: -1px 2px 0px var(--bg-dark-2);
      border-radius: 0px 10px 10px 10px;
    }

    .bubble.me {
      align-self: flex-end;
      background-color: var(--color-primary);
      box-shadow: -1px 2px 0px var(--color-primary);
      border-radius: 10px 0px 10px 10px;
    }
  }
}
.action-button {
  height: 100%;
  background-color: inherit;
  color: var(--text-color);
  border: none;
  cursor: pointer;
  aspect-ratio: 1;
}

.users-list {
  width: 100%;
}
.item-user {
  width: 100%;
  padding: 0.5rem;
  border-bottom: var(--border);
  &:last-child {
    border: 0;
  }
}
</style>
