<template>
  <Navbar />
  <div class="container-app">
    <main>
      <router-view></router-view>
    </main>
    <FriendsAside />
    <div class="chat-direct" v-if="isOpen">
      <Chat
        :type="EChatType.Direct"
        :user-chat="activeFriend"
        :messages="messages"
        name="Lorem ipsum" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import { EChatType } from '../../../interfaces';
import { useChatStore } from '../../../stores/chats';
import { storeToRefs } from 'pinia';

const Navbar = defineAsyncComponent(
  () => import('../../common/components/ui/Navbar.vue'),
);
const FriendsAside = defineAsyncComponent(
  () => import('../../common/components/friends/FriendsAside.vue'),
);

const Chat = defineAsyncComponent(
  () => import('../../common/components/Chat.vue'),
);

const chatStore = useChatStore();
const { isOpen, activeFriend } = storeToRefs(chatStore);

const user = {
  login: 'amurcia-',
  username: 'amurcia-',
  avatar: null,
  avatar42:
    'https://cdn.intra.42.fr/users/f9d736eaefdcc160d0f742b44a8f5d4a/amurcia-.jpg',
  status: 'offline',
};

const messages = [
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'aramirez',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'aramirez',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'amurcia-',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'aramirez',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'amurcia-',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'amurcia-',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'amurcia-',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'amurcia-',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'amurcia-',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'amurcia-',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'aramirez',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'amurcia-',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
  {
    isRead: true,
    createdAt: new Date(),
    userId: 'aramirez',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, voluptate explicabo ullam ipsam pariatur tenetur eveniet cum provident ipsum unde.',
  },
];
</script>
<style lang="scss" scoped>
.container-app {
  display: flex;
  justify-content: center;
  & main {
    flex: 1;
  }
}

.chat-direct {
  position: fixed;

  bottom: 0;
  right: 0;
  height: 50vh;
  width: 50%;
}
</style>
