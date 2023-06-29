import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Manager, Socket } from 'socket.io-client';

import { CONFIG } from '../config';
import { useGameStore } from '../stores';
import { storeToRefs } from 'pinia';

let manager: Manager = new Manager(CONFIG.API_URL + '/socket.io/socket.io.js', {
  extraHeaders: { authentication: sessionStorage.getItem('token') || '' },
});

const socketChat = ref<Socket>();

export const useSocketsChat = () => {
  const router = useRouter();

  const connectToServerChat = () => {
    manager = new Manager(CONFIG.API_URL + '/socket.io/socket.io.js', {
      extraHeaders: { authentication: sessionStorage.getItem('token') || '' },
    });
    socketChat.value = manager.socket('/chat');
    addListeners();
  };

  const addListeners = () => {

    socketChat.value?.on('recive-message-direct', (payload) => {
      console.log('recive-message-direct', payload);
    });

  
  };

  return {
    socketChat,
    connectToServerChat,
  };
};
