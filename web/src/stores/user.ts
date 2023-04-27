import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { IUser } from '../interfaces';

const userPersist: IUser = sessionStorage.getItem('user')
	? JSON.parse(sessionStorage.getItem('user')!)
	: JSON.parse(JSON.stringify({
		avatar: undefined,
		avatar42: '',
		login: '',
		status: '',
		twoFactorAuth: false,
		username: undefined
	}));

export const useUserStore = defineStore('user', () => {

	const user = ref<IUser>(userPersist);

	const setUser = (userData: IUser): void => {
		user.value = userData;
		sessionStorage.setItem('user', JSON.stringify(user.value))
	}

	return {
		user,
		setUser
	}
})

