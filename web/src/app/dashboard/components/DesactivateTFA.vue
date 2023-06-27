<template>
  <Box>
    <template v-slot:header> Desactivate Two Factor Authenticate </template>
    <template v-slot:body>
      <p class="text field">
        Are you sure want desactivate Two Factor Authenticate?
      </p>

      <p class="text field mt-4">Insert the app code to confirm</p>
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <div class="control">
            <input ref="codeRef" v-model.trim="code" class="input" placeholder="code" />
          </div>
        </div>
        <div class="field">
          <button type="submit" class="button is-primary is-fullwidth" :class="{ 'is-loading': isLoading }">
            Send
          </button>
        </div>
      </form>
    </template>
  </Box>
</template>
<script lang="ts" setup>
// IMPORTACIONES
import { defineAsyncComponent, onMounted, ref } from 'vue';

import {
  useLoading,
  useModal,
  useNotifications,
} from '../../common/composables';
import { providers } from '../../../providers';
import { useUserStore } from '../../../stores';
import { storeToRefs } from 'pinia';

// COMPONENTES
const Box = defineAsyncComponent(
  () => import('../../common/components/ui/Box.vue'),
);

// STORES
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// COMPOSABLES
const notifications = useNotifications();
const { isLoading } = useLoading();
const { close } = useModal();

// PROVIDERS
const { editProfileService } = providers();

// VARIABLES
const codeRef = ref<HTMLInputElement>();
const code = ref<string>('');

// FUNCIONES

onMounted(() => {
  // Ponemos el foco en el input
  setTimeout(() => codeRef.value?.focus(), 100);
});

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    await editProfileService.desactivateTFA(code.value);
    close();
    user.value.twoFactorAuth = false;
    notifications.success('Two Factor Authenticate Desactived');
  } catch (error) {
    notifications.error("Can't desactivate Two Factor Authenticate Actived");
  } finally {
    isLoading.value = false;
  }
};
</script>
<style lang="scss" scoped>
.qrCode {
  justify-content: center;
  display: flex;
}
</style>
