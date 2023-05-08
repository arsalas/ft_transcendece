<template>
  <!-- Necesita tener un RouterView por ser un layout
    Lo que este en routerview es lo que se mantiene -->
  <!-- aqui solo la barrita de arriba -->
  <header class="sub-header">
    <nav>
      <ul class="nav-items">
        <li class="text">
          <router-link
            :to="{
              name: 'overview',
              params: { username: route.params.username },
            }">
            OVERVIEW
          </router-link>
        </li>
        <li class="text">
          <router-link
            :to="{
              name: 'history',
              params: { username: route.params.username },
            }">
            HISTORY
          </router-link>
        </li>
        <li class="text">FRIENDS</li>
      </ul>
    </nav>
    <div class="actions">
      <div class="control">
        <form @submit.prevent="handleSubmit">
          <input
            class="input"
            v-model.trim="userSearch"
            placeholder="Search user..." />
        </form>
      </div>
    </div>
  </header>
  <Loader v-if="isLoading" is-fullsize />
  <RouterView v-else />
  <!-- TODO PONER DESPUES v-model.trim="user" -->
</template>

<script lang="ts" setup>
// prevent para que no se recargue la pagina
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '../../../stores';
import { useRoute, useRouter } from 'vue-router';
import { providers } from '../../../providers';
import { useLoading } from '../../common/composables';

const userSearch = ref<string>('');

const handleSubmit = () => {
  router.push({ name: 'profileUser', params: { username: userSearch.value } }); // vamos a index.ts de dashboard/router para saber donde hay que ir (string)
};

const Loader = defineAsyncComponent(
  () => import('../../common/components/Loader.vue'),
);

const { isLoading } = useLoading();
const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);

isLoading.value = true;

const route = useRoute();
const router = useRouter();

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

// PROVIDERS
const { profileService } = providers();

// watch(()=>{})

// Pedir informacion al backend y guardarla en el store

onMounted(async () => {
  loadProfileUser();
});
</script>

<style lang="scss" scoped>
.overview {
  & ul {
    border: 1px solid var(--border-color);

    & li {
      background-color: var(--bg-dark-1);

      font-weight: 300;

      border-top: var(--border);

      &:first-child {
        border-top: 0px;
      }

      & a {
        // border-left: 0.3rem solid var(--border-color);
        padding: 0.6rem 1.2rem;
        width: 100%;
        height: 100%;
        display: block;

        &:hover {
          background-color: var(--bg-dark-0);
        }
      }
    }
  }
}
.sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  height: 50px;
  background-color: var(--bg-dark-1);
  border-bottom: var(--border);
  .nav-items {
    display: flex;
    justify-content: center;
  }

  .nav-items li {
    margin-right: 2rem;
    font-weight: bold;
  }
}
</style>
