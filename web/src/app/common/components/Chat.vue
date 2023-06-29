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
        <div v-else class="text">{{ name }} ({{ users?.length }} users)</div>
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
                  Users
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
          <template v-for="(message, index) in messages">
            <li
              class="date text"
              v-if="
                !isSameDay(message.createdAt, messages[index - 1]?.createdAt)
              ">
              <span>
                {{ formatRelativeTime(message.createdAt) }}
              </span>
            </li>
            <li
              class="bubble text"
              :class="message.userId == user.login ? 'me' : 'other'">
              <div
                v-if="message.userId != user.login"
                class="username is-large">
                {{ message.userId }}
              </div>
              {{ message.message }}
            </li>
          </template>
        </ul>
      </div>

      <div class="users-list" v-else>
        <form action="" @submit.prevent="handleAddUser" v-if="isUserOwner()">
          <input
            v-model.trim="addUser"
            type="text"
            class="input"
            placeholder="Add user" />
        </form>
        <div class="item-user" v-for="userDetails in users">
          <ChatUser
            :chat-id="id!"
            :user="userDetails"
            :is-user-admin="isUserAdmin()"
            :is-user-owner="isUserOwner()" />
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
import {
  defineAsyncComponent,
  ref,
  nextTick,
  inject,
  onUnmounted,
  onMounted,
} from 'vue';
import { storeToRefs } from 'pinia';

import { ChatService } from '../../dashboard/services/ChatService';
import { EChatType, IFriendProfile } from '../../../interfaces';
import { IMessage, IUserChat } from '../../../interfaces/chat';
import { useChatStore } from '../../../stores/chats';
import { useUserStore } from '../../../stores';
import { useSocketsChat } from '../../../sockets';

const { socketChat } = useSocketsChat();

onMounted(() => {
  if (props.type != EChatType.Direct) {
    socketChat.value?.emit('chat-connect', props.id);
    socketChat.value?.on('recive-message-group', (payload: IMessage) => {
      props.messages.push(payload);
    });
  }
});

onUnmounted(() => {
  if (props.type != EChatType.Direct)
    socketChat.value?.off('recive-message-group');
});

const isSameDay = (date1: string, date2: string | undefined) => {
  if (!date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  if (d1.getTime() == d2.getTime()) {
    return true;
  }
  return false;
};

const MediaObject = defineAsyncComponent(
  () => import('../../common/components/MediaObject.vue'),
);

const ChatUser = defineAsyncComponent(() => import('./ChatUser.vue'));

const chatService = inject<ChatService>('chatService')!;

const props = defineProps<{
  id?: string;
  userChat?: IFriendProfile;
  name?: string;
  type: EChatType;
  messages: IMessage[];
  users?: IUserChat[];
}>();

const chatStore = useChatStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const addUser = ref<string>('');
const newMessage = ref<string>('');
const refChat = ref<HTMLDivElement>();

const onClickAway = () => {
  isOpen.value = false;
};

const isOpen = ref<boolean>(false);
const isShowUsers = ref<boolean>(false);

const getTimesFormat = (time: number) => {
  const seconds = Math.floor(time / 1000); // -1937124.765
  const minutes = Math.floor(seconds / 60); // -5158.739066666666
  const hours = Math.floor(minutes / 60); // -85.97898444444444
  const days = Math.floor(hours / 24);
  return {
    seconds,
    minutes,
    hours,
    days,
  };
};

const formatRelativeTime = (date: string) => {
  let diff = Math.floor((new Date(date) - new Date()) as number);
  if (diff < 0) diff = 0;
  const { days } = getTimesFormat(diff);
  const formatter = new Intl.RelativeTimeFormat('en-EN', {
    numeric: 'auto',
  });
  return formatter.format(days, 'days');
};

const handleAddUser = async () => {
  try {
    // TODO response incluya el user para hacer push en la array
    const response = await chatService.addUser(addUser.value, props.id!);
  } catch (error) {}
};

const isUserAdmin = (): boolean => {
  const isFind = props.users!.find(
    (us) => us.isAdmin && us.login == user.value.login,
  );
  return isFind ? true : false;
};
const isUserOwner = () => {
  const isFind = props.users!.find(
    (us) => us.isOwner && us.login == user.value.login,
  );
  return isFind ? true : false;
};

const exitChannel = () => {};

const showUsers = () => {
  onClickAway();
  isShowUsers.value = true;
};

const onSubmit = async () => {
  if (newMessage.value.length == 0) return;

  props.messages.push({
    createdAt: new Date().toDateString(),
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

.users-list form {
  position: sticky;
  top: 0;
}

.date {
  position: relative;
  width: 100%;
  margin-bottom: 27px;
  text-align: center;
  text-transform: capitalize;
  span {
    display: inline-block;
    // color: var(--grey);
    &:before,
    &:after {
      position: absolute;
      top: 10px;
      display: inline-block;
      width: 40%;
      height: 3px;
      content: '';
      background-color: var(--color-text-primary);
      border: solid 1px var(--color-primary);
    }

    &:before {
      left: 0;
    }
    &:after {
      right: 0;
    }
  }
}
</style>
