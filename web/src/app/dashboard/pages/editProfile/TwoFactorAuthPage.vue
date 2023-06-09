<template>
  <Box>
    <template v-slot:header> Two-Factor Auth </template>
    <template v-slot:body>
      <p class="text">
        Two-Factor Auth helps to secure your ArtStation account from takeover
        and data loss
      </p>
      <p class="mt-2 text">To enable Two-Factor Auth:</p>
      <ul class="mt-2">
        <li class="text">
          <div class="list is-text-bold">1</div>
          Download and install an authenticaro app on your mobile
        </li>
        <li class="text mt-2">
          <div class="list is-text-bold">2</div>
          Click Generate QR code
        </li>
        <li class="text mt-2">
          <div class="list is-text-bold">3</div>
          Use the app to scan this QR code
        </li>
        <li class="text mt-2">
          <div class="list is-text-bold">4</div>
          Enter the code generated by the app
        </li>
      </ul>
      <button
        v-if="!user.twoFactorAuth"
        @click="handleClick"
        class="button is-primary mt-4 is-outlined">
        Genetate QR code
      </button>
      <button v-else @click="open" class="button is-primary mt-4">
        Desactivate
      </button>

      <div class="columns mt-2">
        <div class="column">
          <a
            href="https://itunes.apple.com/us/app/artstation-app/id924645286"
            target="_blank">
            <QRCode
              icon="fa-brands fa-google-play"
              image="qr_android.png"
              text="Google Play"
              haveFooter />
          </a>
        </div>
        <div class="column">
          <a
            href="https://itunes.apple.com/us/app/artstation-app/id924645286"
            target="_blank">
            <QRCode
              icon="fa-brands fa-apple"
              image="qr_ios.png"
              text="App Store"
              haveFooter />
          </a>
        </div>
      </div>
    </template>
  </Box>
  <Modal v-if="isOpen" @close="close" :isOpenContent="isOpenContent">
    <DesactivateTFA v-if="user.twoFactorAuth" />
    <ActivateTFA v-else :qr="qrImg" />
  </Modal>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, inject, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore } from '../../../../stores';
import {
  useLoading,
  useModal,
  useNotifications,
} from '../../../common/composables';
import { EditProfieService } from '../../services';

// COMPONENTES
const Box = defineAsyncComponent(
  () => import('../../../common/components/ui/Box.vue'),
);
const QRCode = defineAsyncComponent(
  () => import('../../components/QRCode.vue'),
);
const ActivateTFA = defineAsyncComponent(
  () => import('../../components/ActivateTFA.vue'),
);
const DesactivateTFA = defineAsyncComponent(
  () => import('../../components/DesactivateTFA.vue'),
);
const Modal = defineAsyncComponent(
  () => import('../../../common/components/ui/Modal.vue'),
);

// STORES
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// PROVIDERS
const editProfileService = inject<EditProfieService>('editProfileService')!;

// COMPOSABLES
const notifications = useNotifications();
const { isLoading } = useLoading();
const { open, isOpen, close, isOpenContent } = useModal();

// VARIABLES
const qrImg = ref<string>('');

// FUNCIONES
const handleClick = async (e: Event): Promise<void> => {
  try {
    isLoading.value = true;
    const { qr } = await editProfileService.generateQRCode();
    open();
    qrImg.value = qr;
  } catch (error) {
    notifications.error("Can't save changes");
    close();
  } finally {
    isLoading.value = false;
  }
};
</script>
<style lang="scss" scoped>
li {
  display: flex;
  align-items: center;
}

.list {
  background-color: var(--color-primary);
  border-radius: 50%;
  width: 1.6rem;
  height: 1.6rem;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
}
</style>
