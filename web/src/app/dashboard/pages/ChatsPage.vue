<template>
  <div class="container">
    <div class="chat">
      <Chat />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

const Chat = defineAsyncComponent(
  () => import('../../chat/components/Chat.vue'),
);

//TODO
/*
-Cambiar esquinas
-Color
-Botones
*/
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 1rem 1rem;
}
.chat {
  // padding: 2px;
  background-color: rgb(0, 2, 68);

  height: 50vh;
  width: 40vw;
}
</style>
