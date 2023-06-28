import { useRouter } from 'vue-router';
import {
  useAuthStore,
  useFriendsStore,
  useThemeStore,
  useUserStore,
} from '../stores';
import { useSockets, useSocketsGame } from '../sockets';
import { AuthService } from '../app/auth/services/authService';
import { FriendsService } from '../app/dashboard/services';

export const useStart = (
  authService: AuthService,
  friendsService: FriendsService,
) => {
  // PROVIDERS
  //   const authService = inject<AuthService>('authService')!;
  //   const friendsService = inject<FriendsService>('friendsService')!;

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
    if (!authToken) return;
	console.log({authService})
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
