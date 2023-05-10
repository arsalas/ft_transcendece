import { useRouter } from 'vue-router';
import {
  useAuthStore,
  useFriendsStore,
  useThemeStore,
  useUserStore,
} from '../stores';
import { useSockets, useSocketsGame } from '../sockets';
import { providers } from '../providers';

export const useStart = () => {
  // PROVIDERS
  const { authService, friendsService } = providers();

  // STORES
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const friendsStore = useFriendsStore();
  const themeStore = useThemeStore();
  const { connectToServerNotifications } = useSockets();
  const { connectToServerGame } = useSocketsGame();

  const startApp = async () => {
    themeStore.loadTheme();
    const authToken = authStore.token;
    console.log({ authToken });
    if (!authToken) return;
    const { token, user } = await authService.recoverSession();
    authStore.signIn(token);
    userStore.setUser(user);
    friendsStore.friends = await friendsService.get();
    connectToServerNotifications();
    connectToServerGame();
  };

  return {
    startApp,
  };
};
