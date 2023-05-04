<template>
  <div class="overview-container">
    <div class="text is-huge">GAMES</div>
    <div v-for="i in 5" class="user">
      <div class="media">
        <img
          class="avatar"
          :src="profile?.profile.avatar || profile?.profile.avatar42"
          alt="" />
        <div class="username-rival">aramirez</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useProfileStore } from '../../../../stores';

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);
</script>

<style lang="scss" scoped>
.overview-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 59px - 50px);
  width: 100%;
}

.avatar
.media {
  padding: 1rem;
}
</style>
