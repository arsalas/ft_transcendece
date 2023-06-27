<template>
  <div class="chat pattern">
    <Chat :type="EChatType.Protected" :messages="messages" name="Lorem ipsum" />
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import { EChatType, IChat } from '../../../interfaces';

const Chat = defineAsyncComponent(
  () => import('../../common/components/Chat.vue'),
);

const user = {
  login: 'amurcia-',
  username: 'amurcia-',
  avatar: null,
  avatar42: 'https://cdn.intra.42.fr/users/f9d736eaefdcc160d0f742b44a8f5d4a/amurcia-.jpg',
  status: 'offline',
};

const messages: IChat[] = [
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
.chat {
  height: 100%;
}
</style>
