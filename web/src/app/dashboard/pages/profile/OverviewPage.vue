<template>
  <div class="overview-container">
    <div class="flag-container">
      <div class="flag" :style="{ backgroundColor: profile?.profile.color }">
        <div class="info">
          <Avatar
            class="bordered"
            :src="profile!.profile.avatar!"
            :fallback="profile!.profile.avatar42"
            width="8rem" />
          <div class="text is-extra mt-5">{{ profile?.profile.username }}</div>
          <div class="text">{{ profile?.profile.login }}</div>
        </div>
        <Avatar
          class="mt-6"
          :src="profile!.profile.icon!"
          :fallback="profile!.profile.icon"
          width="4rem" />
      </div>
      <div class="flag-corner">
        <div class="flag-corner-left"></div>
        <div class="flag-corner-right"></div>
      </div>
    </div>

    <div class="stadistics-container">
      <header>
        <ul>
          <li class="has-text-centered text is-extra">Win Rate</li>
          <li class="has-text-centered text is-extra">Victories</li>
          <li class="has-text-centered text is-extra">Defeats</li>
          <li class="has-text-centered text is-extra">Ladder</li>
        </ul>
      </header>
      <footer>
        <ul>
          <li>
            <circle-progress
              class="text is-extra"
              :percent="(profile!.stadistics.victories / (profile!.stadistics.victories + profile!.stadistics.defeats)) * 100"
              fill-color="var(--color-primary)"
              show-percent
              :size="100"
              :border-width="8"
              :border-bg-width="8"
              unit="%" />
          </li>
          <li>
            <div class="has-text-centered text is-huge">
              {{ profile?.stadistics.victories }}
            </div>
          </li>
          <li>
            <div class="has-text-centered text is-huge">
              {{ profile?.stadistics.defeats }}
            </div>
          </li>
          <li><div class="has-text-centered text is-huge">{{profile?.profile.ladder}}</div></li>
        </ul>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useProfileStore } from '../../../../stores';
import Flag from '../../../common/components/Flag.vue';
import { computed, defineAsyncComponent, ref } from 'vue';

import 'vue3-circle-progress/dist/circle-progress.css';
import CircleProgress from 'vue3-circle-progress';

const Avatar = defineAsyncComponent(
  () => import('../../../common/components/images/Avatar.vue'),
);
const Box = defineAsyncComponent(
  () => import('../../../common/components/ui/Box.vue'),
);

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore); // extraemos una variable reactiva de un store

const color = computed(() => `6rem solid ${profile.value?.profile.color}`);
</script>

<style lang="scss" scoped>
.bordered {
  border: solid var(--border-color) 0.3rem;
}
.overview-container {
  display: flex;
  height: calc(100vh - var(--header-h) - var(--subheader-h));
  //   width: 100vw;

  & .flag-container {
    flex: 2;
    display: flex;
    // justify-content: center;
    flex-direction: column;
    align-items: center;
    & .flag {
      padding: 2rem 0;
      width: 12rem;
      min-height: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      & .info {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }

    & .flag-corner {
      display: flex;
      & .flag-corner-right {
        width: 6rem;
        border-bottom: 4rem solid transparent;
        border-left: v-bind(color);
      }
      & .flag-corner-left {
        width: 6rem;
        border-bottom: 4rem solid transparent;
        border-right: v-bind(color);
      }
    }
  }
  & .stadistics-container {
    flex: 8;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    padding-bottom: 5rem;
    & header,
    footer {
      width: 80%;
    }
    & ul {
      display: flex;
      justify-content: center;
      align-items: center;
      & li {
        flex: 1;
        display: flex;
        justify-content: center;
      }
    }

    // & .stadistics {
    //   display: flex;
    //   align-items: center;

    //   justify-content: space-between;
    //   & .numbers {
    //     display: flex;
    //     flex: 1;
    //     justify-content: space-between;
    //     align-items: center;
    //   }
    // }
  }
}
</style>
