import { useRouter } from 'vue-router';
import {
  useAuthStore,
  useFriendsStore,
  useThemeStore,
  useUserStore,
} from '../stores';
import { useSockets, useSocketsChat, useSocketsGame } from '../sockets';
import { AuthService } from '../app/auth/services/authService';
import { FriendsService } from '../app/dashboard/services';
import { ChatService } from '../app/dashboard/services/ChatService';

export const useStart = (
  authService: AuthService,
  friendsService: FriendsService,
  chatService: ChatService,
) => {
  // STORES
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const friendsStore = useFriendsStore();
  const themeStore = useThemeStore();
  const { connectToServerNotifications } = useSockets(friendsService,chatService);
  const { connectToServerGame } = useSocketsGame();
  const { connectToServerChat } = useSocketsChat();

  const startApp = async () => {
    themeStore.loadTheme();
    const authToken = authStore.token;
    if (!authToken) return;
    const { token, user } = await authService.recoverSession();
    authStore.signIn(token);
    userStore.setUser(user);
    friendsStore.setFriends(
      await friendsService.get(),
      await chatService.getFriendsNotRead(),
    );
    connectToServerNotifications();
    connectToServerGame();
    connectToServerChat();
  };

  return {
    startApp,
  };
};
