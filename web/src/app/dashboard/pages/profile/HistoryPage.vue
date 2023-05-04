<template>
  <div class="overview-container">
    <div class="text is-huge">GAMES</div>
    <ul class="media">
      <li v-for="i in 5" class="head text">
        <img
          class="avatar"
          :src="profile?.profile.avatar || profile?.profile.avatar42"
          alt="" />
        <div class="text is-large">aramirez</div>
      </li>
    </ul>
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
  justify-content: space-around;
  align-items: center;
  height: calc(100vh - 59px - 50px);
  width: 100%;
}
.media {
  height: 70%;
  width: 70%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  border: solid red 1px;
}

.avatar {
  width: 8rem;
  border-radius: 100%;
  border: var(--border);
  margin-right: 3rem;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--border);
  padding: 0.35rem 0.5rem;
  font-weight: 700;
}
</style>
