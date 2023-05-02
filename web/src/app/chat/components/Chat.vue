<!-- To cast a string to Date
const str = '2024-07-21';
const date = new Date(str);
date.toDateString(); -->

<template>
  <div class="chat-container">
    <header>
      <div class="left">
        <div class="media-object">
          <img
            class="avatar"
            src="https://cdn.intra.42.fr/users/61da00534362577f043e040efaf1a1e7/aramirez.jpg"
            alt="" />
          <div class="media-text">
            <div class="name">aramirez</div>
            <div class="status">conectado</div>
          </div>
        </div>
      </div>
      <div class="right"></div>
    </header>
    <div class="chat">
      <div class="conversation-start">
        <span>Today, 9:00 PM</span>
      </div>

      <div
        class="bubble"
        :class="chat.login == 'amurcia-' ? 'me' : 'other'"
        v-for="chat in chats">
        <div v-if="chat.login != 'amurcia-'" class="username">
          {{ chat.login }}
        </div>
        <!-- si el usuario no soy yo, printa el nombre del login  -->
        {{ chat.message }}
      </div>

      <!-- <button @click="closeChat">CLOSE</button>
            <button @click="addMsg">ADD</button>
 -->
      <!--    <form @submit.prevent="Send msg"></form>
            <input class="input" type="text"> -->
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
  // display: flex;
  // height: 100vh;
  height: 100%;
  width: 100%;
  background-color: yellow;
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;

  & header {
    height: 50px;
    background-color: green;

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
        padding-left: 1rem;
        flex-direction: column;
        justify-content: center;
      }
    }
  }

  & footer {
    height: 50px;
    background-color: pink;

    & form,
    input {
      height: 100%;
    }
  }

  & .chat {
    // position: fixed;
    // bottom: 1rem;
    // left: 1rem;
    // height: 50vh;
    // width: calc((100vw) / 2);
    flex: 1;
    background: rgb(193, 255, 250);
    border: 1px solid #333;
    overflow: auto;
    padding: 0.5rem;

    & .input {
      position: relative;
      align-items: center;
      vertical-align: bottom;
    }

    & .conversation-start {
      position: relative;
      width: 100%;
      margin-bottom: 2rem;
      text-align: center;
      align-items: center;
      justify-content: space-between;

      span {
        font-size: 1rem;
        padding: 0.5rem 2rem;
        display: inline-block;
        background: white;
        color: black;
        border: 1px black;
        border-radius: 5px;
      }
    }

    & .bubble {
      font-size: 1rem;
      position: relative;
      display: inline-block;
      clear: both;
      margin-bottom: 1rem;
      padding: 0.2rem 0.5rem;
      vertical-align: top;
      border-radius: 1rem;
      border-top-left-radius: 0rem;

      & .username {
        font-size: 0.8rem;
        font-weight: bold;
      }
    }

    #message-input {
      height: 3rem;
      width: 70%;
      border: 1px solid #8e8888;
      border-radius: 0.5rem;
      padding: 0.5rem;
      margin-right: 1rem;
    }

    #send-button {
      height: 30px;
      width: 20%;
      border: none;
      border-radius: 0.5rem;
      background-color: #35e93b;
      color: rgb(0, 0, 0);
      cursor: pointer;
    }

    & .other {
      float: left;
      color: rgba(0, 0, 128, 0.931);
      background-color: rgb(4, 223, 223);
      animation-name: slideFromLeft;
      box-shadow: -1px 2px 0px rgba(0, 0, 128, 0.931);
    }

    & .me {
      float: right;
      color: rgb(115, 8, 115);
      background-color: rgb(255, 158, 255);
      animation-name: slideFromRight;
      box-shadow: -1px 2px 0px rgb(115, 8, 115);
    }
  }
}
</style>
