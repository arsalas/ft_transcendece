import { useAuthStore } from "../stores";

export const isAuth = (): boolean => {
	const authStore = useAuthStore();
	return authStore.isAuth;
}