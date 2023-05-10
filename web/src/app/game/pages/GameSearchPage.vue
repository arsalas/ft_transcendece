<template>
  <div class="container-app">
    <main>
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
      <h2 class="text is-extra">SEARCHING GAME</h2>
      <h3 class="text is-extra">{{ timmer }}</h3>
      <button class="button is-primary mt-4" :disabled="counter < 30">
        CANCEL
      </button>
    </main>
    <FriendsAside />
  </div>
</template>
<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import { providers } from '../../../providers';
import { useRouter } from 'vue-router';

const FriendsAside = defineAsyncComponent(
  () => import('../../common/components/friends/FriendsAside.vue'),
);
const { gameService } = providers();

const router = useRouter();

const counter = ref<number>(0);

const timmer = computed(() => {
  let minutes = Math.floor(counter.value / 60);
  let extraSeconds = counter.value % 60;
  const secStr = extraSeconds < 10 ? '0' + extraSeconds : extraSeconds;
  return `${minutes}:${secStr}`;
});

const interval = setInterval(() => {
  counter.value++;
}, 1000);

const findGame = async () => {
  const res = await gameService.searchGame('original');
  console.log({ res });
};

onMounted(() => {
  findGame();
});
</script>
<style lang="scss" scoped>
.container-app {
  display: flex;
  justify-content: center;
  height: 100vh;
  & main {
    flex: 1;
    // background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
