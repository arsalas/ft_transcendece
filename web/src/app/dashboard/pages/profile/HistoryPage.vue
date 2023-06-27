<template>
  <div class="overview-container">
    <div class="section">
      <div class="text mb-3">RECENT GAMES (LAST 5 PLAYED)</div>
      <ul class="">
        <li v-for="game in profile?.history" class="history-box">
          <HistoryBox :game="game" :username="profile!.profile.username!" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useProfileStore } from '../../../../stores';
import { defineAsyncComponent } from 'vue';

const HistoryBox = defineAsyncComponent(
  () => import('../../components/HistoryBox.vue'),
);

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);
</script>

<style lang="scss" scoped>
.overview-container {
  height: calc(100vh - var(--header-h) -  var(--subheader-h));
  overflow-y: auto;
  width: 100%;
}


</style>
