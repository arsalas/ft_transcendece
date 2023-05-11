<template>
  <div class="start-container">
    <div class="player left animate__animated animate__slideInLeft">
      <Image
        :style="`border: 0.2rem solid ${playerLeft.color}`"
        class="avatar"
        :src="playerLeft.avatar"
        :fallback="playerLeft.avatar42" />

      <!-- <MediaObject
        :image="playerLeft.avatar"
        :image-fallback="playerLeft.avatar42"
        :name="playerLeft.username"
        width="25%" /> -->

      <div class="text is-extra px-4">
        {{ playerLeft.username }}
      </div>
      <Flag :color="playerLeft.color" :image="playerLeft.icon" width="5rem" />
    </div>
    <div class="player right animate__animated animate__slideInRight">
      <Image
        class="avatar"
        :style="`border: 0.2rem solid ${playerRight.color}`"
        :src="playerRight.avatar"
        :fallback="playerRight.avatar42" />

      <div class="text is-extra px-4">
        {{ playerRight.username }}
      </div>
      <Flag :color="playerRight.color" :image="playerRight.icon" width="5rem" />
    </div>
    <div class="center text">
      <div class="animate__animated animate__zoomIn">VS</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import { GamePlayer } from '../../../interfaces';
const Image = defineAsyncComponent(
  () => import('../../common/components/images/Image.vue'),
);
const MediaObject = defineAsyncComponent(
  () => import('../../common/components/MediaObject.vue'),
);
const Flag = defineAsyncComponent(
  () => import('../../common/components/Flag.vue'),
);

defineProps<{ playerLeft: GamePlayer; playerRight: GamePlayer }>();
</script>
<style lang="scss" scoped>
.start-container {
  width: 100%;
  height: 100vh;
  background-color: var(--bg-dark-0);
  display: flex;
  overflow: hidden;
  & .player {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    // flex-direction: column;
  }

  .avatar {
    width: 25%;
    aspect-ratio: 1;
    border-radius: 50%;
  }
}

.center {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  font-weight: 900;
  background-color: rgba($color: #000000, $alpha: 0.3);
}
</style>
