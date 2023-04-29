import { ref } from 'vue'
import { defineStore } from 'pinia'

const tokenPersist: string = sessionStorage.getItem('token') || '';
const auth = tokenPersist ? true : false

export const useAuthStore = defineStore('auth', () => {
	const isAuth = ref<boolean>(auth); // const y no let para que no pierda la reactividad
	const token = ref<string>(tokenPersist);

	const signIn = (authToken: string) => {
		isAuth.value = true;
		token.value = authToken;
		sessionStorage.setItem('token', authToken);
	}

	const logOut = () => {
		isAuth.value = false;
		token.value = '';
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('user');
	}

	return {
		isAuth,
		token,
		signIn,
		logOut
	}
})

