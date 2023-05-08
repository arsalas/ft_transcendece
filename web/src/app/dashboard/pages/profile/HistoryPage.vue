<template>
  <div class="overview-container">
    <div class="text is-huge">GAMES</div>
    <ul class="media">
      <li v-for="i in 5" class="head text">
        <img
          class="avatar"
          :src="profile?.profile.avatar || profile?.profile.avatar42"
          alt="" />
        <div class="text data">
          <div class="text is-large">{{ profile?.history[0].player }}</div>
          <div
            :class="{
              'win-lost': true,
              'text-green': i == 1,
              'text-red': i != 1,
            }">
            {{ i === 1 ? 'Winner' : 'Loser' }}
            <div class="text date">
              {{ profile?.history[0].date }}
            </div>
          </div>
          <!-- <div :class="text win-lost">Winner</div> -->
        </div>
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
}

.avatar {
  width: 9rem;
  border-radius: 100%;
  border: var(--border-big);
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

.text-green {
  color: green;
  text-shadow: -0.05rem -0.05rem 0 rgb(9, 99, 9),
    0.05rem -0.05rem 0 rgb(9, 99, 9), -0.05rem 0.05rem 0 rgb(9, 99, 9),
    0.05rem 0.05rem 0 rgb(9, 99, 9);
}

.text-red {
  color: red;
  text-shadow: -0.05rem -0.05rem 0 rgb(110, 5, 5),
    0.05rem -0.05rem 0 rgb(110, 5, 5), -0.05rem 0.05rem 0 rgb(110, 5, 5),
    0.05rem 0.05rem 0 rgb(110, 5, 5);
}

.data {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  justify-content: space-around;
}
</style>
