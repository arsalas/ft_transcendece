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
        <li class="text">STADISTICS</li>
      </ul>
    </nav>
    <div class="actions">
      <div class="control">
        <input ref="userRef" class="input" placeholder="Find user" />
      </div>
    </div>
  </header>
  <!-- <img v-if="profile" :src="profile.profile.icon" alt="" />
      <img v-if="profile" :src="profile.profile.background" alt="" /> -->
  <!-- {{ profile }} -->
  <RouterView v-if="profile" />
  <!-- TODO PONER DESPUES v-model.trim="user" -->
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
