import { ref } from 'vue';

const isOpen = ref<boolean>(false);
const message = ref<string>('');
const type = ref<'success' | 'error' | 'info'>('info');

export const useNotifications = () => {
  const open = (msg: string) => {
    message.value = msg;
    isOpen.value = true;
  };

  const success = (msg: string) => {
    type.value = 'success';
    open(msg);
  };

  const error = (msg: string) => {
    type.value = 'error';
    open(msg);
  };

  const info = (msg: string) => {
    type.value = 'info';
    open(msg);
  };

  const close = () => {
    isOpen.value = false;
    message.value = '';
  };

  return {
    message,
    isOpen,
    success,
    error,
    info,
    close,
    type,
  };
};
