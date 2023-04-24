import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const tokenPersist: string = sessionStorage.getItem('token') || '';

interface IUser {
  username: string;
  login: string;
  avatar: string;
  }

export const authStore = defineStore('auth', () => {
  const isAuth = ref<boolean>(false); // const y no let para que no pierda la reactividad
  const token = ref<string>('');
  const user = ref<IUser>();

  const signIn = () => {
    isAuth.value = true;
  }

  return {

  }
})

