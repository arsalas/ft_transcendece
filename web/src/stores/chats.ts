import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { IFriendProfile } from '../interfaces/friends';
import { EChatType, IChatRoomResponse, IMessage, IResponseChatRoom } from '../interfaces';

export const useChatStore = defineStore('chat', () => {
  const isOpen = ref<boolean>(false); // const y no let para que no pierda la reactividad

  const activeFriend = ref<IFriendProfile>();
  const chatId = ref<string>('');
  const messages = ref<IMessage[]>([]);

  const password = ref<string>('');

  const chats = ref<IChatRoomResponse[]>([]);

  const chat = ref<IResponseChatRoom>();

  const open = (friend: IFriendProfile) => {
    activeFriend.value = friend;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  const chatFilter = ref<string>('');
  const chatList = computed(() =>
    chats.value.filter((chat) =>
      chat.name.toLowerCase().includes(chatFilter.value.toLowerCase()),
    ),
  );

  return {
    chats,
    password,
	chat,
    chatFilter,
    chatList,
    isOpen,
    open,
    close,
    activeFriend,
    messages,
    chatId,
  };
});
