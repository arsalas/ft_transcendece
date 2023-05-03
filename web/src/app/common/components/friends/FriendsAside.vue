<template>
  <aside>
    <header class="friends-header">
      <div class="text">SOCIAL</div>
      <span class="icon text">
        <i class="fa-solid fa-user-plus"></i>
      </span>
    </header>

    <header class="friends-header" @click="isOnline = !isOnline">
      <div class="text">
        <span class="icon text">
          <i
            class="fa-solid"
            :class="{
              'fa-angle-right': !isOnline,
              'fa-angle-down': isOnline,
            }"></i>
        </span>
        ONLINE (5/5)
      </div>
    </header>

    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__slideInDown"
      leave-active-class="animate__animated animate__slideOutUp">
      <div v-if="isOnline" style="z-index: -1; position: absolute; width: 100%">
        <div v-for="i in 5" class="container-user">
          <MediaObject
            width="2.5rem"
            :image="friends.avatar"
            :image-fallback="friends.avatar"
            :name="friends.name + i"
            :status="'game'" />
          <div class="actions">
            <div class="badge is-primary">
              <span class="text is-small"> 1 </span>
            </div>
            <button class="ml-2 action-button text">
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </aside>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';
const MediaObject = defineAsyncComponent(() => import('../MediaObject.vue'));

const friends = {
  name: 'user',
  avatar: 'https://i.pravatar.cc/40',
  status: 'online',
};

const isOnline = ref<boolean>(true);
</script>
<style lang="scss" scoped>
.container-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.25rem 0.5rem;
}

aside {
  width: 18rem;
  height: calc(100vh - 59px);
  background-color: var(--bg-dark-0);
  position: sticky;
  top: 59px;
  overflow-y: auto;
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

.actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.action-button {
  background-color: inherit;
  color: var(--text-color);
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  aspect-ratio: 1;
}
</style>
