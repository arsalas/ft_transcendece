import { Manager, Socket } from 'socket.io-client';
import { useAuthStore, useFriendsStore } from '../stores';
import { storeToRefs } from 'pinia';
import { providers } from '../providers';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
  extraHeaders: { authentication: sessionStorage.getItem('token') || '' },
});

const socketGame = ref<Socket>();

export const useSocketsGame = () => {
  const router = useRouter();
  
  const connectToServerGame = () => {
    socketGame.value = manager.socket('/game');
    console.log(socketGame);
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
