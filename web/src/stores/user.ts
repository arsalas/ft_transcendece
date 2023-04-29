import {  ref } from 'vue'
import { defineStore } from 'pinia'

import { IUser } from '../interfaces';


export const useUserStore = defineStore('user', () => {

	const user = ref<IUser>({
		avatar: undefined,
		avatar42: '',
		login: '',
		status: '',
		twoFactorAuth: false,
		username: undefined
	});

	const setUser = (userData: IUser): void => {
		user.value = userData;
	}

	return {
		user,
		setUser
	}
})

