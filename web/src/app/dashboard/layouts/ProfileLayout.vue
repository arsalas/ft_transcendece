<template>
  <!-- Necesita tener un RouterView por ser un layout
    Lo que este en routerview es lo que se mantiene -->
  <!-- aqui solo la barrita de arriba -->
  <div class="container">
    <div class="section">
      <div class="control">
        <input
          ref="userRef"
          v-model.trim="user"
          class="input"
          placeholder="user" />
      </div>
    </div>
  </div>
  <img v-if="profile" :src="profile.profile.icon" alt="">
  <img v-if="profile" :src="profile.profile.background" alt="">
  {{ profile }}
  <RouterView />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '../../../stores';
import { useRoute } from 'vue-router';
import { providers } from '../../../providers';

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);

const route = useRoute();

// PROVIDERS
const { profileService } = providers();

// watch(()=>{})

// Pedir informacion al backend y guardarla en el store

onMounted(async () => {
  console.log(route.params.username);
  // Pedir la informacion del usuario
  profile.value = await profileService.get(route.params.username as string); // indicamos que lo trate como un string
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
</style>
