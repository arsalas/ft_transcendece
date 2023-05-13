<template>
  <!-- Necesita tener un RouterView por ser un layout
    Lo que este en routerview es lo que se mantiene -->
  <!-- aqui solo la barrita de arriba -->
  <Subheader :items="items">
    <div class="control">
      <form @submit.prevent="handleSubmit">
        <input
          class="input"
          v-model.trim="userSearch"
          placeholder="Search user..." />
      </form>
    </div>
  </Subheader>

  <Loader v-if="isLoading" is-fullsize />
  <RouterView v-else />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '../../../stores';
import { useRoute, useRouter } from 'vue-router';
import { providers } from '../../../providers';
import { useLoading } from '../../common/composables';

// COMPONENTES
const Subheader = defineAsyncComponent(
  () => import('../../common/components/ui/Subheader.vue'),
);

const Loader = defineAsyncComponent(
  () => import('../../common/components/Loader.vue'),
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
const { profileService } = providers();

// VARIABLES
const items = [
  {
    name: 'overview',
    route: {
      path: 'overview',
      params: { username: route.params.username },
    },
  },
  {
    name: 'history',
    route: {
      path: 'history',
      params: { username: route.params.username },
    },
  },
];

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
    userSearch.value = '';
    loadProfileUser();
  },
);

onMounted(async () => {
  loadProfileUser();
});
</script>

<style lang="scss" scoped></style>
