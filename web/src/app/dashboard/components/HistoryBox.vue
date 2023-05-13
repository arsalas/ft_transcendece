<template>
  <div class="history-box">
    <div class="media-object left">
      <Image
        :style="`border:0.15rem solid ${game.playerLeft.profile.color}`"
        :src="game.playerLeft.profile.avatar!"
        :fallback="game.playerLeft.profile.avatar42" />
      <div>
        <h3 class="text ml-4 is-large">
          {{ game.playerLeft.profile.username }}
        </h3>
        <h3 class="text ml-4 has-text-centered">
          <img
            class="icon-coallition"
            :style="`background-color:${game.playerLeft.profile.color}`"
            :src="game.playerLeft.profile.icon"
            alt="" />
        </h3>
      </div>
    </div>
    <div class="score">
      <div
        class="text"
        :class="{
          out: !isUserWinner(game),
          online: isUserWinner(game),
        }">
        {{ isUserWinner(game) ? 'VICTORY' : 'DEFEAT' }}
      </div>
      <h3 class="text mr-4">
        {{ game.playerLeft.result }} -
        {{ game.playerRight.result }}
      </h3>
    </div>
    <div class="media-object right">
      <div>
        <h3 class="text mr-4 is-large">
          {{ game.playerRight.profile.username }}
        </h3>
        <h3 class="mr-4 has-text-centered">
          <img
            class="icon-coallition"
            :style="`background-color:${game.playerRight.profile.color}`"
            :src="game.playerRight.profile.icon"
            alt="" />
        </h3>
      </div>
      <Image
        :style="`border:0.15rem solid ${game.playerRight.profile.color}`"
        :src="game.playerRight.profile.avatar!"
        :fallback="game.playerRight.profile.avatar42" />
    </div>
    <div class="text has-text-centered">
      {{ game.type }}
      <br />
      {{ new Date(game.date).toLocaleDateString() }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import { IHistoryGame } from '../../../interfaces';
const props = defineProps<{ game: IHistoryGame; username: string }>();
const Image = defineAsyncComponent(
  () => import('../../common/components/images/Image.vue'),
);

const isUserWinner = (game: IHistoryGame) => {
  if (props.username == game.playerLeft.profile.username) {
    return game.playerLeft.isWinner;
  }
  return game.playerRight.isWinner;
};
</script>
<style lang="scss" scoped>
.history-box {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  align-items: center;
  background-color: var(--bg-dark-2);
  border: var(--border);
  padding: 1rem;
  & > * {
    flex: 1;
  }
}
.media-object {
  display: flex;
  align-items: center;

  & img {
    width: 4rem;
    border-radius: 50%;
  }

  &.right{
	justify-content: flex-end;
  }
}

.icon-coallition {
  width: 1.4rem !important;
}

.score {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & * {
    font-size: x-large;
  }
}

@media (max-width: 1250px) {
  .history-box {
    flex-direction: column;
	& > * {
		margin: 0.5rem;
	}
  }
}

// 1023
</style>
