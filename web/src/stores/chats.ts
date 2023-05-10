import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useChatStore = defineStore('chat', () => {
  const isOpen = ref<boolean>(false); // const y no let para que no pierda la reactividad

  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };
  return { isOpen, open, close };
});
