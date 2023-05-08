<template>
  <div class="overview-container">
    <header
      class="overview-header"
      :style="`background-image: linear-gradient(
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 1)
    ),
    url(${profile!.profile.background});
 `">
      <div class="container details">
        <div class="user-details">
          <img
            class="photo"
            :src="profile?.profile.avatar || profile?.profile.avatar42"
            alt="" />
          <div>
            <div class="text is-extra">{{ profile!.profile.username }}</div>
            <div class="text is-large">{{ profile!.profile.login }}</div>
          </div>
        </div>

        <Flag
          :color="profile!.profile.color"
          :image="profile!.profile.icon"
          width="10rem" />
      </div>
    </header>
    <div class="overview-content">
      <ul class="stadistics">
        <li class="head text">STADISTICS</li>
        <li class="name text">
          Total played: {{ profile?.stadistics.played }}
        </li>
        <li class="name text">Win: {{ profile?.stadistics.win }}</li>
        <li class="name text">Lost: {{ profile?.stadistics.lost }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useProfileStore } from '../../../../stores';
import Flag from '../../../common/components/Flag.vue';

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore); // extraemos una variable reactiva de un store
console.log(profile);
</script>

<style lang="scss" scoped>
.overview-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 59px - 50px);
  width: 100vw;
}

.details {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 30%;
}

.photo {
  width: 15rem;
  border-radius: 100%;
  border: var(--border);
  margin-right: 3rem;
}

.overview-header {
  height: calc(100vh - 59px - 50px - 60%);
  width: 100%;
  background-position: center;
  background-size: contain;
  font-size: 1.5rem;
  // background-repeat: repeat-x;
}
.overview-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & .head {
    font-size: 3rem;
    border-bottom: var(--border);
    padding: 0.35rem 0.5rem;
    font-weight: 700;
  }
  & .name {
    font-size: 2rem;
    border-bottom: var(--border);
    padding: 0.35rem 0.5rem;
    font-weight: 700;
  }
}
.stadistics {
  width: 50%;
  text-align: center;
  border: var(--border);
  background-color: var(--bg-dark-2);
}
</style>
