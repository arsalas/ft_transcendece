<template>
  <Navbar />
  <div class="container-app">
    <main>
      <router-view></router-view>
    </main>
    <FriendsAside />
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

const Navbar = defineAsyncComponent(
  () => import('../../common/components/Navbar.vue'),
);
const FriendsAside = defineAsyncComponent(
  () => import('../../common/components/friends/FriendsAside.vue'),
);
</script>
<style lang="scss" scoped>
.container-app {
  display: flex;
  justify-content: center;
  & main {
    flex: 1;
  }
}
</style>
