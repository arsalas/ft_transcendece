import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Manager, Socket } from 'socket.io-client';

import { CONFIG } from '../config';
import { useGameStore } from '../stores';
import { storeToRefs } from 'pinia';

let manager: Manager = new Manager(CONFIG.API_URL + '/socket.io/socket.io.js', {
  extraHeaders: { authentication: sessionStorage.getItem('token') || '' },
});
console.log({ manager });
const socketGame = ref<Socket>();

export const useSocketsGame = () => {
  const router = useRouter();

  const connectToServerGame = () => {
    manager = new Manager(CONFIG.API_URL + '/socket.io/socket.io.js', {
      extraHeaders: { authentication: sessionStorage.getItem('token') || '' },
    });
    socketGame.value = manager.socket('/game');
    addListeners();
  };

  const addListeners = () => {
    socketGame.value?.on('connect', () => {
      console.log('game connected');
    });

    // Escucha el evento cuando el cliente se desconecta
    socketGame.value?.on('disconnect', () => {
      console.log('game disconnect');
    });

    // Escucha el evento cuando el cliente se desconecta
    socketGame.value?.on('reject-game', (user: string) => {
      const gameStore = useGameStore();
      const { waitingAccept } = storeToRefs(gameStore);
      waitingAccept.value = false;
    });

    socketGame.value?.on('game-start', (gameId: string) => {
      console.log('El JUEGO ha empezado', gameId);
      router.push({ name: 'online', params: { id: gameId } });
    });
  };

  return {
    socketGame,
    connectToServerGame,
  };
};