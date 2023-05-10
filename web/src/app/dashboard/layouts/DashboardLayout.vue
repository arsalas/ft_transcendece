<template>
  <Navbar />
  <div class="container-app">
    <main>
      <router-view></router-view>
    </main>
    <FriendsAside />
    <div class="container-direct-chat" v-if="isOpen">
      <Chat />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import { useChatStore } from '../../../stores/chats';
import { storeToRefs } from 'pinia';

const Navbar = defineAsyncComponent(
  () => import('../../common/components/ui/Navbar.vue'),
);
const FriendsAside = defineAsyncComponent(
  () => import('../../common/components/friends/FriendsAside.vue'),
);

const Chat = defineAsyncComponent(
  () => import('../../chat/components/Chat.vue'),
);

// descomponemos lo que trae, siempre que vemos un use
const chatStore = useChatStore();
const { isOpen } = storeToRefs(chatStore); // para desestructurar variables sin perder reactividad
</script>
<style lang="scss" scoped>
.container-app {
  display: flex;
  justify-content: center;
  & main {
    flex: 1;
  }
}

.container-direct-chat {
  position: fixed;
  bottom: 0;
  right: 18rem;
  width: calc((100% - 18rem) / 2);
  height: 40vh;
}
</style>
