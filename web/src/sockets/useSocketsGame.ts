import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Manager, Socket } from 'socket.io-client';

import { CONFIG } from '../config';

let manager
console.log('manager: ', sessionStorage.getItem('token'))

const socketGame = ref<Socket>();

export const useSocketsGame = () => {
  const router = useRouter();

  const connectToServerGame = () => {
    manager = new Manager(CONFIG.API_URL + '/socket.io/socket.io.js', {
      extraHeaders: { authentication: sessionStorage.getItem('token') || '' },
    });
    socketGame.value = manager.socket('/game');
    console.log('socket-game: ', socketGame);
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

    socketGame.value?.on('game-start', (gameId: string) => {
      console.log('El JUEGO ha empezado', gameId);
      console.log(router, gameId);
      router.push({ name: 'online', params: { id: gameId } });
    });


  };

  return {
    socketGame,
    connectToServerGame,
  };
};
