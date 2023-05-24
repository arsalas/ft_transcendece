<template>
  <div class="container">
    <div class="title">LADDER</div>

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
        <tr v-for="(user, i) in users">
          <td>{{ i + 1 }}</td>
          <td>
            <MediaObject
              :image="user.avatar!"
              :image-fallback="user.avatar42"
              :name="user.username!"
              width="2rem" />
          </td>
          <td>
            {{ user.ladder }}
          </td>
          <td>
            <MediaObject
              :style="{ backgroundColor: user.color }"
              :image="user.icon!"
              :image-fallback="user.icon"
              :name="user.coallition!"
              width="2rem" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { providers } from '../../../providers';
import { IProfile } from '../../../interfaces';
import MediaObject from '../../common/components/MediaObject.vue';

const { profileService } = providers();
const users = ref<IProfile[]>([]);

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
<style lang="scss" scoped></style>
