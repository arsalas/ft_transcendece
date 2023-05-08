import { ref } from 'vue';
import { defineStore } from 'pinia';
import { IUserProfile } from '../interfaces';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<IUserProfile>();

  return { profile }; // llaves porque es un objeto
});
