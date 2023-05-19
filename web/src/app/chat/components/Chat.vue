<template>
  <div v-if="isOpenChat" class="chat-container">
    <div class="chat-container">
      <header>
        <div class="left">
          <div class="media-object">
            <!-- <img
          class="avatar"
          :src="profile?.profile.avatar || profile?.profile.avatar42"
          alt="" /> -->
            <img
              class="avatar"
              src="https://cdn.intra.42.fr/users/61da00534362577f043e040efaf1a1e7/aramirez.jpg"
              alt="" />
            <!-- <MediaObject
              width="2.5rem"
              :image="friend.profile.avatar"
              :image-fallback="friend.profile.avatar42"
              :name="friend.profile.username"
              :status="friend.profile.status" /> -->
            <div class="media-text">
              <div class="text is-large name">aramirez</div>
              <div class="text is-small status">conectado</div>
            </div>
          </div>
        </div>

        <div class="right">
          <button @click="chatStore.close" class="close-chat button is-primary">
            X
          </button>
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
                  <a href="#" class="dropdown-item text is-small">
                    Invite to group
                  </a>
                  <a href="#" class="dropdown-item text is-small">
                    Send Message
                  </a>
                  <a href="#" class="dropdown-item text is-small">
                    View Profile
                  </a>
                  <a href="#" class="dropdown-item text is-small"> Unfriend </a>
                  <a href="#" class="dropdown-item text is-small"> Block </a>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <div class="chat">
        <div class="conversation-start">
          <span>Today, 9:00 PM</span>
        </div>

        <div class="conversation-msg">
          <ul>
            <li
              class="bubble"
              :class="chat.login == 'amurcia-' ? 'me' : 'other'"
              v-for="chat in chats">
              <div v-if="chat.login != 'amurcia-'" class="username">
                {{ chat.login }}
              </div>
              <!-- si el usuario no soy yo, printa el nombre del login  -->
              {{ chat.message }}
            </li>
          </ul>
        </div>
      </div>

      <footer>
        <form @submit.prevent="sendMsg()">
          <input
            v-model.trim="message"
            type="text"
            placeHolder="Enviar mensaje"
            class="input" />
        </form>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineStore } from 'pinia';
import { defineAsyncComponent, computed, ref } from 'vue';
import { useChatStore } from '../../../stores';
import { IFriend } from '../../../interfaces/friends';
import { providers } from '../../../providers';

const Avatar = defineAsyncComponent(
  () => import('../../common/components/images/Avatar.vue'),
);

interface IChat {
  login: string;
  message: string;
  date: string;
}

const MediaObject = defineAsyncComponent(
  () => import('../../common/components/MediaObject.vue'),
);
const { friendsService } = providers();
const props = defineProps<{
  friend: IFriend;
}>();

// export class UsersTpeComponent implements OnInit {
//   public formMessage = new FormGrop({
//     message: new FormControl('');
//   });
// }

const chatStore = useChatStore();
const message = ref<string>('');

const sendMsg = () => {
  if (message.value.length > 0) {
    chats.value.push({
      login: 'amurcia-',
      message: message.value,
      date: '10.05.2023',
    });
    message.value = '';
  }
};

const isOpenChat = ref<boolean>(true);
const isOpen = ref<boolean>(false);
const onClickAway = (event: any) => {
  isOpen.value = false;
};

const chats = ref<IChat[]>([
  // const y no let para que no pierda la reactividad
  {
    login: 'amurcia-',
    message: 'Hola Alberto',
    date: '10.05.2023',
  },
  {
    login: 'aramirez',
    message: 'Hola Alicia',
    date: '11.05.2023',
  },
]);

const closeChat = () => {
  isOpenChat.value = false;
};
</script>

<style lang="scss" scoped>
.chat-container {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: var(--color-primary-rgb);
  border: solid 1px var(--color-primary);

  & header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.2rem 1rem;
    background-color: var(--color-bg-primary);
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
    background: rgb(0, 0, 0);
    overflow: auto;
    padding: 0.5rem;

    & .input {
      align-items: center;
      vertical-align: bottom;
      border: none;
    }

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
      padding: 0.2rem 0.5rem;
      border-radius: 1rem;

      & .username {
        font-size: 0.8rem;
        font-weight: bold;
      }
    }

    .bubble.other {
      align-self: flex-start;
      color: rgba(0, 0, 128, 0.931);
      background-color: rgb(4, 223, 223);
      box-shadow: -1px 2px 0px rgba(0, 0, 128, 0.931);
      border-radius: 0px var(--border-radius-chat) var(--border-radius-chat)
        var(--border-radius-chat);
    }

    .bubble.me {
      align-self: flex-end;
      color: rgb(115, 8, 115);
      background-color: rgb(255, 158, 255);
      box-shadow: -1px 2px 0px rgb(115, 8, 115);
      border-radius: var(--border-radius-chat) 0px var(--border-radius-chat)
        var(--border-radius-chat);
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
</style>
