<template>
  <section class="section">
    <table class="table text is-bordered is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Player</th>
          <th>Elo</th>
          <th>Coallition</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(userLadder, i) in users"
          :style="{
            backgroundColor:
              userLadder.login == user.login
                ? 'var(--color-primary-hover)'
                : 'inherit',
          }">
          <td>{{ i + 1 }}</td>
          <td>
            <MediaObject
              :image="userLadder.avatar!"
              :image-fallback="userLadder.avatar42"
              :name="userLadder.username!"
              width="2rem" />
          </td>
          <td>
            {{ userLadder.ladder }}
          </td>
          <td class="coallition">
            <Image
              :src="userLadder.icon!"
              :fallback="userLadder.icon!"
              :style="{ backgroundColor: userLadder.color }" />
            {{ userLadder.coallition }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import { IProfile } from '../../../interfaces';
import MediaObject from '../../common/components/MediaObject.vue';
import Image from '../../common/components/images/Image.vue';
import { useUserStore } from '../../../stores';
import { storeToRefs } from 'pinia';
import { ProfileService } from '../services';

const  profileService  = inject<ProfileService>('profileService')!;
const users = ref<IProfile[]>([]);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const loadLadder = async () => {
  try {
    users.value = await profileService.getLadder();
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  loadLadder();
});
</script>
<style lang="scss" scoped>
.coallition {
  display: flex;
  align-items: center;
  & img {
    width: 2rem;
    margin-right: 1rem;
    border-radius: 50%;
    aspect-ratio: 1;
  }
}
</style>
