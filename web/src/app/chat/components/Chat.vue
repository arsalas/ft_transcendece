<!-- To cast a string to Date
const str = '2024-07-21';
const date = new Date(str);
date.toDateString(); -->

<template>
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
          <div class="media-text">
            <div class="text is-large name">aramirez</div>
            <div class="text is-small status">conectado</div>
          </div>
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

    <!-- <button @click="closeChat">CLOSE</button>
            <button @click="addMsg">ADD</button>
 -->
    <!--    <form @submit.prevent="Send msg"></form>
            <input class="input" type="text"> -->

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
</template>

<script lang="ts" setup>
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

interface IChat {
  open: boolean;
  login: string;
  message: string;
  date: string;
}

const message = ref<string>('');

const sendMsg = () => {
  if (message.value.length > 0) {
    chats.value.push({
      open: true,
      login: 'amurcia-',
      message: message.value,
      date: '10.05.2023',
    });
    message.value = '';
  }
};

const closeChat = () => {
  chats.value.push({
    open: true,
    login: 'amurcia-',
    message: 'ADIOS!',
    date: '10.05.2023',
  });
};

const addMsg = () => {
  chats.value.push({
    open: true,
    login: 'amurcia-',
    message: 'Hola Alberto',
    date: '10.05.2023',
  });
};

const chats = ref<IChat[]>([
  // const y no let para que no pierda la reactividad
  {
    open: true,
    login: 'amurcia-',
    message: 'Hola Alberto',
    date: '10.05.2023',
  },
  {
    open: true,
    login: 'aramirez',
    message: 'Hola Alicia',
    date: '11.05.2023',
  },
]);
</script>

<style lang="scss" scoped>
.chat-container {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: var(--color-primary-rgb);

  & header {
    height: 50px;
    display: flex;

    background-color: var(--color-bg-dark);

    .left {
      height: 100%;
      padding: 0.2rem;

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
        // flex-direction: column;
        // justify-content: center;
      }
    }
  }

  & footer {
    height: 70px;
    background-color: pink;

    & form,
    input {
      height: 100%;
    }
  }

  & .chat {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: calc(100% - 50px);
    align-items: end;
    background: rgb(193, 255, 250);
    border: 1px solid #333;
    overflow: auto;
    padding: 0.5rem;

    & .input {
      align-items: center;
      vertical-align: bottom;
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
        color: black;
        border: 1px black;
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

    // .conversation-msg {
    //   width: 100%;
    //   display: flex;
    //   flex-direction: column;
    //   border: #3835e9 1px solid;
    // }

    & .bubble {
      max-width: 75%;
      margin-bottom: 10px;
      padding: 0.2rem 0.5rem;
      border-radius: 1rem;
      // display: flex;
      // flex-direction: column;
      // align-self: flex-start;

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
    }

    .bubble.me {
      align-self: flex-end;
      color: rgb(115, 8, 115);
      background-color: rgb(255, 158, 255);
      box-shadow: -1px 2px 0px rgb(115, 8, 115);
    }
  }
}
</style>
