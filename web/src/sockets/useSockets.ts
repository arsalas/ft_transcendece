// import { inject } from 'vue';
import { Manager, Socket } from 'socket.io-client';
import { useAuthStore, useFriendsStore, useGameStore } from '../stores';
import { storeToRefs } from 'pinia';
import { CONFIG } from '../config';
import { FriendsService } from '../app/dashboard/services';
import { ref } from 'vue';
import { ChatService } from '../app/dashboard/services/ChatService';

// TODO Crear varias conexiones a diferentes namespaces?
// Sockets con nofificaciones, game, chat

let manager: Manager;

const socketNotifications = ref<Socket>();

export const useSockets = (
  friendsService: FriendsService,
  chatService: ChatService,
) => {
  const friendsStore = useFriendsStore();
  const gameStore = useGameStore();
  const { friends } = storeToRefs(friendsStore);
  const { invitations } = storeToRefs(gameStore);
  //   const friendsService = inject<FriendsService>('friendsService')!;

  const connectToServerNotifications = () => {
    manager = new Manager(CONFIG.API_URL + '/socket.io/socket.io.js', {
      extraHeaders: { authentication: sessionStorage.getItem('token') || '' },
    });
    socketNotifications.value = manager.socket('/notifications');
    addListenersNotifications();
  };

  const addListenersNotifications = () => {
    socketNotifications.value?.on('connect', () => {
    });

    // Escucha el evento cuando el cliente se desconecta
    socketNotifications.value?.on('disconnect', () => {
    });

    socketNotifications.value?.on('request-recived', (payload: any) => {
      friendsStore.friends.push(payload);
    });
    socketNotifications.value?.on('refresh-friends', async () => {
      if (friendsService && chatService) {
        friendsStore.setFriends(
          await friendsService.get(),
          await chatService.getFriendsNotRead(),
        );
      }
    });

    socketNotifications.value?.on('invite-game', async (payload: any) => {
      invitations.value.push(payload);
    });

    // Escucha el evento clients-updated
    socketNotifications.value?.on('clients-connect', (clients: any) => {
      const haveFriend = friends.value.find(
        (fr) => fr.profile.login == (clients.userId as string),
      );
      if (haveFriend) haveFriend.profile.status = 'online';
    });
    socketNotifications.value?.on('clients-disconect', (clients: any) => {
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
