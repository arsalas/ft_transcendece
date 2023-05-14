<template>
  <div class="start-container">
    <div class="player left animate__animated animate__slideInLeft">
      <div>
        <Image
          :style="`border: 0.2rem solid ${playerLeft.color}`"
          class="avatar"
          :src="playerLeft.avatar"
          :fallback="playerLeft.avatar42" />
        <div class="text is-extra px-4">
          {{ playerLeft.username }}
        </div>
        <Flag :color="playerLeft.color" :image="playerLeft.icon" width="5rem" />
      </div>
      <div class="result">
        <div
          class="text is-huge"
          :class="{
            away: !result[0].isWinner,
            online: result[0].isWinner,
          }">
          {{ result[0].isWinner ? 'WIN' : 'LOSER' }}
        </div>
        <div class="text is-huge">
          {{ result[0].score }}
        </div>
      </div>
    </div>
    <div class="player right animate__animated animate__slideInRight">
      <div>
        <Image
          class="avatar"
          :style="`border: 0.2rem solid ${playerRight.color}`"
          :src="playerRight.avatar"
          :fallback="playerRight.avatar42" />

        <div class="text is-extra px-4">
          {{ playerRight.username }}
        </div>
        <Flag
          :color="playerRight.color"
          :image="playerRight.icon"
          width="5rem" />
      </div>
      <div class="result">
        <div
          class="text is-huge"
          :class="{
            away: !result[1].isWinner,
            online: result[1].isWinner,
          }">
          {{ result[1].isWinner ? 'WIN' : 'LOSER' }}
        </div>
        <div class="text is-huge">
          {{ result[1].score }}
        </div>
      </div>
    </div>
    <div class="center text">
      <div class="animate__animated animate__zoomIn">VS</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import { GamePlayer, Scores } from '../../../interfaces';
const Image = defineAsyncComponent(
  () => import('../../common/components/images/Image.vue'),
);
const MediaObject = defineAsyncComponent(
  () => import('../../common/components/MediaObject.vue'),
);
const Flag = defineAsyncComponent(
  () => import('../../common/components/Flag.vue'),
);

const props = defineProps<{
  playerLeft: GamePlayer;
  playerRight: GamePlayer;
  result: Scores[];
}>();
</script>
<style lang="scss" scoped>
.start-container {
  width: 100%;
  height: 100vh;
  background-color: var(--bg-dark-0);
  display: flex;
  overflow: hidden;
  position: fixed;
  z-index: 2;
  & .player {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    & > div {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    // flex-direction: column;
  }

  .avatar {
    width: 25%;
    aspect-ratio: 1;
    border-radius: 50%;
  }
}

.result {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
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
