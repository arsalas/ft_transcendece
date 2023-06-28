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

export const useSocketsGame = () => {
  const router = useRouter();

  const connectToServerGame = () => {
    manager = new Manager(CONFIG.API_URL + '/socket.io/socket.io.js', {
      extraHeaders: { authentication: sessionStorage.getItem('token') || '' },
    });
    socketChat.value = manager.socket('/chat');
    addListeners();
  };

  const addListeners = () => {
    socketChat.value?.on('connect', () => {
      console.log('game connected');
    });

    // Escucha el evento cuando el cliente se desconecta
    socketChat.value?.on('disconnect', () => {
      console.log('game disconnect');
    });


	// TODO Crear eventos de escucha

	// Conectar a un channel

	// Conectar a los mensajes directos

	

    // Escucha el evento cuando el cliente se desconecta
    socketChat.value?.on('reject-game', (user: string) => {
      const gameStore = useGameStore();
      const { waitingAccept } = storeToRefs(gameStore);
      waitingAccept.value = false;
    });

    socketChat.value?.on('game-start', (gameId: string) => {
      console.log('El JUEGO ha empezado', gameId);
      router.push({ name: 'online', params: { id: gameId } });
    });
  };

  return {
    socketChat,
    connectToServerGame,
  };
};
