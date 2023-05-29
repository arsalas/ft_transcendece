import { ref } from 'vue';
import { defineStore } from 'pinia';
import { IFriendProfile } from '../interfaces/friends';

export const useChatStore = defineStore('chat', () => {
  const isOpen = ref<boolean>(false); // const y no let para que no pierda la reactividad

  const activeFriend = ref<IFriendProfile>();

  const open = (friend: IFriendProfile) => {
    activeFriend.value = friend;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  return { isOpen, open, close, activeFriend };
});
