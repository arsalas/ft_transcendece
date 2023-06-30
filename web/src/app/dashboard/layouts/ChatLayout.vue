<template>
  <article>
    <aside>
      <header>
        <div>
          <input
            v-model.trim="chatFilter"
            type="text"
            class="input is-small"
            placeholder="Search..." />
        </div>
        <button @click="open" class="ml-2 action-button text">
          <i class="fas fa-plus"></i>
        </button>
      </header>
      <ul>
        <li
          v-for="chat in chatList"
          class="text is-small chat-item"
          :class="{ 'is-active': chat.id == route.params.chatId }">
          <a
            @click="handleProtectedGroup(chat.id)"
            v-if="chat.type == EChatType.Protected">
            <span> {{ chat.name }}</span>
            <span class="icon">
              <i class="fas fa-lock"></i>
            </span>
          </a>
          <router-link
            v-else
            :to="{ name: 'chat', params: { chatId: chat.id } }">
            <span> {{ chat.name }}</span>
          </router-link>
        </li>
      </ul>
    </aside>
    <main>
      <router-view></router-view>
    </main>
  </article>
  <Modal v-if="isOpen" @close="close" :isOpenContent="isOpenContent">
    <Box>
      <template v-slot:header> Create Chat </template>
      <template v-slot:body>
        <NewChat @close="close" />
      </template>
    </Box>
  </Modal>
  <ModalPass
    v-if="isOpenPass"
    @close="closePass"
    :isOpenContent="isOpenContentPass">
    <Box>
      <template v-slot:header> Password Chat </template>
      <template v-slot:body>
        <form @submit.prevent="handleFormPass">
          <div class="field">
            <div class="control">
              <input
                v-model.trim="password"
                type="password"
                class="input"
                placeholder="password" />
            </div>
          </div>

          <div class="field">
            <button type="submit" class="button is-primary is-fullwidth">
              Enter
            </button>
          </div>
        </form>
      </template>
    </Box>
  </ModalPass>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { defineAsyncComponent, inject, onMounted, ref } from 'vue';
import { useModal } from '../../common/composables';
import { ChatService } from '../services/ChatService';
import { useChatStore } from '../../../stores/chats';
import { storeToRefs } from 'pinia';
import { EChatType } from '../../../interfaces';

// COMPONENTES
const NewChat = defineAsyncComponent(() => import('../components/NewChat.vue'));
const Box = defineAsyncComponent(
  () => import('../../common/components/ui/Box.vue'),
);
const Modal = defineAsyncComponent(
  () => import('../../common/components/ui/Modal.vue'),
);
const ModalPass = defineAsyncComponent(
  () => import('../../common/components/ui/Modal.vue'),
);

const chatStore = useChatStore();
const { chatFilter, chatList, chats, password } = storeToRefs(chatStore);
const route = useRoute();
const chatService = inject<ChatService>('chatService')!;

const { open, isOpen, close, isOpenContent } = useModal();
const {
  open: openPass,
  isOpen: isOpenPass,
  close: closePass,
  isOpenContent: isOpenContentPass,
} = useModal();

const fetchChats = async () => {
  try {
    chats.value = await chatService!.getAllChatsByUser();
  } catch (error) {
  } finally {
  }
};

const chatSelect = ref<string>('');
const handleProtectedGroup = (chatId: string) => {
  password.value = '';
  chatSelect.value = chatId;
  openPass();
};
const router = useRouter();
const handleFormPass = () => {
  closePass();
  router.push({
    name: 'chat',
    params: {
      chatId: chatSelect.value,
    },
  });
};

onMounted(() => {
  fetchChats();
});
</script>
<style lang="scss" scoped>
article {
  width: 100%;
  height: calc(100vh - var(--header-h));
  display: flex;
}

aside {
  width: 15rem;
  height: 100%;
  background-color: var(--bg-dark-1);
  overflow-y: auto;
}

main {
  flex: 1;
  height: 100%;
  width: 100%;
}

header {
  position: sticky;
  top: 0;
  padding: 0.5rem;
  background-color: var(--bg-dark-0);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

li {
  border-bottom: var(--border);
  // border-left: var(--border);
  background-color: var(--bg-dark-2);
  transition: 300ms;
  cursor: pointer;
  &:hover {
    background-color: var(--color-primary-hover);
  }
  &:last-child {
    border: 0;
  }
  &.is-active {
    border-left: 0.4rem solid var(--border-color);
  }

  & a {
    padding: 1rem;
    display: block;
    width: 100%;
    height: 100%;
  }
}

.action-button {
  height: 100%;
  background-color: inherit;
  color: var(--text-color);
  border: none;
  cursor: pointer;
  aspect-ratio: 1;
  //   display: flex;
  //   align-items: center;
}

.chat-item a {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
