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

export const useStart = (
  authService: AuthService,
  friendsService: FriendsService,
) => {
  // STORES
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const friendsStore = useFriendsStore();
  const themeStore = useThemeStore();
  const { connectToServerNotifications } = useSockets();
  const { connectToServerGame } = useSocketsGame();
  const { connectToServerChat } = useSocketsChat();

  const startApp = async () => {
    themeStore.loadTheme();
    const authToken = authStore.token;
    if (!authToken) return;
	console.log({authService})
    const { token, user } = await authService.recoverSession();
    authStore.signIn(token);
    userStore.setUser(user);
    friendsStore.friends = await friendsService.get();
    connectToServerNotifications();
    connectToServerGame();
	connectToServerChat();
  };

  return {
    startApp,
  };
};
