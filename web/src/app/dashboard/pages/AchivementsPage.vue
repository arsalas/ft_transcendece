<template>
  <div v-if="playerAchivements" class="container p-3">
    <div class="columns is-multiline">
      <div class="column is-12-mobile is-4-tablet is-4-desktop is-3-widescreen " v-for="achivement in achivements">
        <div class="achivement-box">
          <h1 class="text is-large">
            {{ achivement.name }}
          </h1>
          <p class="text">
            {{ achivement.description }}
          </p>
          <ProgressBar
		  class="mt-2"
            :value="playerAchivements.wins"
            :max="achivement.target" />
			<p class="text mt-1 is-small">
				{{ Math.min(playerAchivements.wins, achivement.target)}}/{{ achivement.target}}
			</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import { AchivementsService } from '../services';
import { IAchivements } from '../../../interfaces';
import ProgressBar from '../../common/components/ProgressBar.vue';
const achivementsService = inject<AchivementsService>('achivementsService')!;

const playerAchivements = ref<IAchivements>();
const achivements = [
  {
    name: 'Principiant',
    description: 'Win 1 online game',
    target: 1,
  },
  {
    name: 'Beginner',
    description: 'Win 10 online games',
    target: 10,
  },
  {
    name: 'Intermediate',
    description: 'Win 20 online games',
    target: 20,
  },
  {
    name: 'Expert',
    description: 'Win 42 online games',
    target: 42,
  },
];

const fetchData = async () => {
  playerAchivements.value = await achivementsService.get();
};

onMounted(() => {
  fetchData();
});
</script>
<style lang="scss" scoped>
.achivement-box {
  background-color: var(--bg-dark-2);
  padding: 1rem;
  height: 100%;
  border: var(--border);
}
</style>
