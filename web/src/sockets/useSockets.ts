// import { inject } from 'vue';
import { Manager, Socket } from 'socket.io-client';
import { useAuthStore, useFriendsStore, useGameStore } from '../stores';
import { storeToRefs } from 'pinia';
import { CONFIG } from '../config';
import { FriendsService } from '../app/dashboard/services';

// TODO Crear varias conexiones a diferentes namespaces?
// Sockets con nofificaciones, game, chat

let manager: Manager;

let socketNotifications: Socket;

export const useSockets = (friendsService?: FriendsService) => {
  const friendsStore = useFriendsStore();
  const gameStore = useGameStore();
  const { friends } = storeToRefs(friendsStore);
  const { invitations } = storeToRefs(gameStore);
  //   const friendsService = inject<FriendsService>('friendsService')!;

  const connectToServerNotifications = () => {
    manager = new Manager(CONFIG.API_URL + '/socket.io/socket.io.js', {
      extraHeaders: { authentication: sessionStorage.getItem('token') || '' },
    });
    socketNotifications = manager.socket('/notifications');
    addListenersNotifications();
  };

  const addListenersNotifications = () => {
    socketNotifications.on('connect', () => {
      console.log('notifications connected');
    });

    // Escucha el evento cuando el cliente se desconecta
    socketNotifications.on('disconnect', () => {
      console.log('notifications disconnect');
    });

    socketNotifications.on('request-recived', (payload: any) => {
      console.log('request-recived', { payload });
      friendsStore.friends.push(payload);
    });
    socketNotifications.on('refresh-friends', async () => {
      if (friendsService) friendsStore.friends = await friendsService.get();
    });

    socketNotifications.on('invite-game', async (payload: any) => {
      console.log('INVITED');
      invitations.value.push(payload);
    });

    // Escucha el evento clients-updated
    socketNotifications.on('clients-connect', (clients: any) => {
      console.log('clients-connect', clients);
      const haveFriend = friends.value.find(
        (fr) => fr.profile.login == (clients.userId as string),
      );
      if (haveFriend) haveFriend.profile.status = 'online';
    });
    socketNotifications.on('clients-disconect', (clients: any) => {
      console.log('clients-disconect', clients);
      const haveFriend = friends.value.find(
        (fr) => fr.profile.login == (clients.userId as string),
      );
      if (haveFriend) haveFriend.profile.status = 'offline';
    });
  };

  return {
    socketNotifications,
    connectToServerNotifications,
  };
};
