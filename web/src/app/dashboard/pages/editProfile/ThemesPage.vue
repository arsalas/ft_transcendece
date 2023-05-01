<template>
  <Box>
    <template v-slot:header> Themes </template>
    <template v-slot:body>
      <p class="text">Select theme for app:</p>
      <br />
      <div class="columns is-multiline is-centered">
        <div v-for="th in themes" class="column is-4">
          <button
            class="button is-primary is-fullwidth"
            :class="[theme != th && 'is-outlined', th]"
            @click="themeStore.setTheme(th)">
            <span class="is-capitalized">{{ th }}</span>
          </button>
        </div>
      </div>
    </template>
  </Box>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { useThemeStore, Theme } from '../../../../stores';

// COMPONENTES
const Box = defineAsyncComponent(
  () => import('../../../common/components/Box.vue'),
);

// STORES
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

// VARIABLES
const themes: Theme[] = ['purple', 'orange', 'blue', 'red', 'green'];

// FUNCIONES
const changeTheme = (newTheme: Theme) => {
  themeStore.setTheme(newTheme);
};
</script>
<style lang="scss" scoped></style>
