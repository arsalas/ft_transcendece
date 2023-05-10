<template>
  <div class="agruped-box">
    <header class="friends-header" @click="isOpen = !isOpen">
      <div class="text">
        <span class="icon text">
          <i
            class="fa-solid"
            :class="{
              'fa-angle-right': !isOpen,
              'fa-angle-down': isOpen,
            }"></i>
        </span>
        {{ title }} ({{ friends.length }}/{{ total }})
      </div>
    </header>

    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__slideInDown z-transition"
      leave-active-class="animate__animated animate__slideOutUp z-transition">
      <div v-if="isOpen" style="position: relative; width: 100%">
        <div v-for="friend in friends" class="container-user">
          <FriendBox :friend="friend" />
        </div>
      </div>
    </Transition>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';
import { IFriend } from '../../../../interfaces/friends';
const FriendBox = defineAsyncComponent(() => import('./FriendBox.vue'));

defineProps<{
  title: string;
  total: number;
  friends: IFriend[];
}>();

const openButton = document.getElementById('open-chat');
const isOpen = ref<boolean>(true);

// document.addEventListener('click', (event: MouseEvent) => {
//   // Check if the clicked element is the chat box or its child elements
//   if ((event.target as HTMLElement).closest('#chat-container')) {
//     return;
//   }
//   chatContainer!.style.display = 'none'; // Hide the chat box
// });
</script>

<style lang="scss" scoped>
.z-transition {
  z-index: -1;
}

.container-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: 300ms;
  background-color: var(--bg-dark-0);
}
.container-user:hover {
  background-color: var(--color-primary-hover);
}

.friends-header {
  padding: 0.25rem 0.5rem;
  display: flex;
  justify-content: space-between;
  background-color: var(--bg-dark-2);
  position: sticky;
  top: 0px;
  cursor: pointer;
}
</style>
