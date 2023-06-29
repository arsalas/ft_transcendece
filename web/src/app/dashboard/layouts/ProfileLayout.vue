<template>
  <Loader v-if="isLoading" is-fullsize />
  <main
    v-else
    :style="`background-image: linear-gradient(
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 1)
    ),
    url(${profile!.profile.background});
 `">
    <Subheader :items="items">
      <template v-slot:left>
        <div class="player-info">
          <Avatar
            :src="profile!.profile.avatar!"
            :fallback="profile!.profile.avatar42"
            width="2.5rem" />
          <div class="text ml-4">
            {{ profile?.profile.username }}
          </div>
        </div>
        <div class="corner-border">
          <div class="corner"></div>
        </div>
      </template>
      <template v-slot:right>
        <div class="control">
          <form @submit.prevent="handleSubmit">
            <input
              class="input"
              v-model.trim="userSearch"
              placeholder="Search user..." />
          </form>
        </div>
      </template>
    </Subheader>

    <RouterView />
  </main>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, inject, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '../../../stores';
import { useRoute, useRouter } from 'vue-router';
import { useLoading } from '../../common/composables';
import { ProfileService } from '../services';

// COMPONENTES
const Subheader = defineAsyncComponent(
  () => import('../../common/components/ui/Subheader.vue'),
);

const Loader = defineAsyncComponent(
  () => import('../../common/components/Loader.vue'),
);

const Avatar = defineAsyncComponent(
  () => import('../../common/components/images/Avatar.vue'),
);

// COMPOSABLES
const route = useRoute();
const router = useRouter();
const { isLoading } = useLoading();
isLoading.value = true;

// STORES
const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);

// PROVIDERS
const profileService = inject<ProfileService>('profileService')!;

const getNavItems = () => [
  {
    name: 'overview',
    route: {
      path: 'overview',
      params: { username: route.params.username },
    },
  },
  {
    name: 'match history',
    route: {
      path: 'history',
      params: { username: route.params.username },
    },
  },
];

// VARIABLES
const items = ref(getNavItems());

const userSearch = ref<string>('');

// FUNCIONES
const handleSubmit = () => {
  router.push({ name: 'profileUser', params: { username: userSearch.value } }); // vamos a index.ts de dashboard/router para saber donde hay que ir (string)
};

const loadProfileUser = async () => {
  // Pedir la informacion del usuario
  isLoading.value = true;
  try {
    profile.value = await profileService.get(route.params.username as string); // indicamos que lo trate como un string
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => route.params.username,
  (newValue) => {
    if (!newValue) return;
    userSearch.value = '';
    loadProfileUser();
    items.value = getNavItems();
  },
);

onMounted(async () => {
  loadProfileUser();
});
</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-h));
  background-position: center;
  background-size: contain;
  //   background-repeat: repeat-x;
}

.player-info {
  background-color: var(--bg-dark-2);
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0rem 2rem;
  border-bottom: var(--border);
  min-width: 20vw;
  & img {
    border: solid 0.2rem var(--border-color);
  }
}

.corner {
  width: var(--subheader-h);
  border-bottom: var(--subheader-h) solid transparent;
  border-left: var(--subheader-h) solid var(--bg-dark-2);
  position: absolute;
  left: calc(var(--subheader-h) * -1 - 2px);
  top: 0;
  z-index: 1;
}
.corner-border {
  width: var(--subheader-h);
  border-bottom: calc(var(--subheader-h) + 1px) solid transparent;
  border-left: calc(var(--subheader-h) + 1px) solid var(--border-color);
  position: relative;
  margin-right: 2rem;
}
</style>
