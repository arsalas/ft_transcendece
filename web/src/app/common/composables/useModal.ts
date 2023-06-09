import { ref } from 'vue';

const timeOut = 100;

export const useModal = () => {
  const isOpen = ref<boolean>(false);
  const isOpenContent = ref<boolean>(false);

  const open = () => {
    isOpen.value = true;
    setTimeout(() => {
      isOpenContent.value = true;
    }, timeOut);
  };

  const close = () => {
    isOpenContent.value = false;
    setTimeout(() => {
      isOpen.value = false;
    }, timeOut);
  };

  return {
    isOpen,
    isOpenContent,
    close,
    open,
  };
};
