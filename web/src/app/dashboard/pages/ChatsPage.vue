<template>
  <div
    style="
      height: 100vh;
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
    ">
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
</script>
<style lang="scss" scoped>
.chat {
  padding: 20px;
  background-color: red;

  height: 50vh;
  width: 40vw;
}
</style>
