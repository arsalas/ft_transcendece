<template>
  <router-view></router-view>
</template>
<script lang="ts" setup>
import { onUnmounted, onMounted } from 'vue';
import { useSocketsGame } from '../../../sockets';

const { connectToServerGame, socketGame } = useSocketsGame();

onMounted(() => {
	connectToServerGame();
});

onUnmounted(() => {

  socketGame.value?.disconnect();
});
</script>
<style lang="scss" scoped></style>
