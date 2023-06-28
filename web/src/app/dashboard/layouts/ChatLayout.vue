<template>
  <article>
    <aside>
      <ul>
        <li class="text is-small is-active">
          <router-link :to="{ name: 'chat', params: {chatId: 'abc'} }"> Lorem ipsum dolor </router-link>
        </li>
        <li class="text is-small">
          <router-link :to="{ name: 'chat', params: {chatId: 'abc'} }"> Lorem ipsum dolor </router-link>
        </li>
        <li class="text is-small">
          <router-link :to="{ name: 'chat', params: {chatId: 'abc'} }"> Lorem ipsum dolor </router-link>
        </li>
        <li class="text is-small">
          <router-link :to="{ name: 'chat', params: {chatId: 'abc'} }"> Lorem ipsum dolor </router-link>
        </li>
        <li class="text is-small">
          <router-link :to="{ name: 'chat', params: {chatId: 'abc'} }"> Lorem ipsum dolor </router-link>
        </li>
        <li class="text is-small">
          <router-link :to="{ name: 'chat', params: {chatId: 'abc'} }"> Lorem ipsum dolor </router-link>
        </li>
      </ul>
    </aside>
    <main>
      <ChatPage />
      <!-- <router-view></router-view> -->
    </main>
  </article>
</template>
<script lang="ts" setup>
import ChatPage from '../pages/ChatPage.vue';
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
}

main {
  flex: 1;
  height: 100%;
  width: 100%;
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
</style>
