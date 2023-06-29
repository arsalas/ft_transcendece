<template>
  <Box>
    <template v-slot:header> Blocking </template>
    <template v-slot:body>
      <p class="text">
        Block Users Blocking a user prevents that user from messaging you. The
        purpose of this feature is to prevent users from harassing you on
        Cyberpong.
      </p>

      <form class="mt-5" @submit.prevent="handleSubmit">
        <label class="label text"
          >Search for a user’s name you wish to block</label
        >
        <div class="field is-grouped">
          <p class="control is-expanded">
            <input
              v-model.trim="userBlock"
              class="input"
              type="text"
              placeholder="Search username" />
          </p>
          <p class="control">
            <button class="button is-primary">Block</button>
          </p>
        </div>
      </form>

      <div class="mt-4 text">Blocked Users</div>

      <!-- TODO preparar con componente -->
      <div class="panel mt-3">
        <header class="text">USER</header>
        <div class="body">
          <div v-for="user in block" class="user">
            <MediaObject
              :image="user.profile.avatar"
              :image-fallback="user.profile.avatar42"
              :name="user.profile.username"
              width="2.2rem" />

            <div @click="unblockUser(user)" class="button is-primary is-small">
              Unblock
            </div>
          </div>
        </div>
      </div>
    </template>
  </Box>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, inject, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore, useFriendsStore } from '../../../../stores';
import { useForm, useNotifications } from '../../../common/composables';
import { IFriend } from '../../../../interfaces/friends';
import { FriendsService } from '../../services';

const notifications = useNotifications();

const Box = defineAsyncComponent(
  () => import('../../../common/components/ui/Box.vue'),
);
const MediaObject = defineAsyncComponent(
  () => import('../../../common/components/MediaObject.vue'),
);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const friendStore = useFriendsStore();
const { block, friends } = storeToRefs(friendStore);

const friendsService = inject<FriendsService>('friendsService')!;

const userBlock = ref<string>('');

const handleSubmit = async () => {
  try {
    const userFind = friends.value.findIndex(
      (u) => u.profile.username == userBlock.value,
    );
    if (userFind == -1) {
      notifications.error("User don't exist");
      return;
    }
    await friendsService.block(friends.value[userFind].profile.login);
    friends.value[userFind].isBlock = true;
    userBlock.value = '';
  } catch (error) {
    notifications.error('Something is wrong');
  }
};

const unblockUser = async (user: IFriend) => {
  try {
    await friendsService.unblock(user.profile.login);
    user.isBlock = false;
  } catch (error) {}
};
</script>
<style lang="scss" scoped>
.panel {
  border: var(--border);
  border-radius: var(--border-radius);

  & header {
    background-color: var(--bg-dark-2);
    border-bottom: var(--border);
    padding: 0.35rem 0.5rem;
    font-weight: 700;
  }
}

.media {
  display: flex;
  align-items: center;

  & img {
    width: 2.4rem;
    aspect-ratio: 1;
    border-radius: 50%;
  }

  & .username {
    padding-left: 1.25rem;
  }
}

.user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--border);
  padding: 0.25rem 0.5rem;

  &:last-child {
    border-bottom: 0px;
  }
}
</style>
