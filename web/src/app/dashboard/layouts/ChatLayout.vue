<template>
  <article>
    <aside>
      <header>
        <div>
          <input v-model.trim="chatFilter" type="text" class="input is-small" placeholder="Search..." />
        </div>
        <button @click="open" class="ml-2 action-button text">
          <i class="fas fa-plus"></i>
        </button>
      </header>
      <ul>
        <li
          v-for="chat in chatList"
          class="text is-small"
          :class="{ 'is-active': chat.id == route.params.chatId }">
          <router-link :to="{ name: 'chat', params: { chatId: chat.id } }">
            {{ chat.name }}
          </router-link>
        </li>
      </ul>
    </aside>
    <main>
      <!-- <ChatPage /> -->
      <router-view></router-view>
    </main>
  </article>
  <Modal v-if="isOpen" @close="close" :isOpenContent="isOpenContent">
    <Box>
      <template v-slot:header> Create Chat </template>
      <template v-slot:body>
        <NewChat />
      </template>
    </Box>
  </Modal>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import ChatPage from '../pages/ChatPage.vue';
import { computed, defineAsyncComponent, ref } from 'vue';
import { useModal } from '../../common/composables';

// COMPONENTES
const NewChat = defineAsyncComponent(() => import('../components/NewChat.vue'));
const Box = defineAsyncComponent(
  () => import('../../common/components/ui/Box.vue'),
);
const Modal = defineAsyncComponent(
  () => import('../../common/components/ui/Modal.vue'),
);

const route = useRoute();

const { open, isOpen, close, isOpenContent } = useModal();
const chatFilter = ref<string>('');
const chatList = computed(() =>
  chats.filter((chat) =>
    chat.name.toLowerCase().includes(chatFilter.value.toLowerCase()),
  ),
);

const chats = [
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
  {
    id: Math.floor(Math.random() * 100).toString(),
    name: 'Lorem ipsum ' + Math.floor(Math.random() * 100),
  },
];

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
</style>
