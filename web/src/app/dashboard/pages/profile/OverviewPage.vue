<template>
  <!-- aqui: nombre nombre42 -->
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
 
<Flag/>
</header>
    <div class="overview-content"></div>
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
  background-color: yellow;
}

.overview-header {
  height: calc(100vh - 59px - 50px - 60%);
  width: 100%;
  background-position: center;
  background-size: contain;
  //   background-attachment: fixed;
  background-repeat: repeat-x;
}
.overview-content {
  flex: 1;
  background-color: rgb(136, 5, 27);
}
</style>
