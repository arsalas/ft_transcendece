<template>
  <!-- <Transition name="custom-classes" enter-active-class="animate__animated animate__slideInRight"
		leave-active-class="animate__animated animate__slideOutRight"> -->
  <div class="notif" :class="[type]">
    <div class="text">
      {{ message }}
    </div>
  </div>
  <!-- </Transition> -->
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { useNotifications } from '../composables';

const { close, message, type } = useNotifications();

onMounted(() => {
  setTimeout(() => {
    close();
  }, 2000);
});
</script>
<style lang="scss" scoped>
.notif {
  position: fixed;
  top: 5rem;
  right: 2rem;
  background-color: var(--bg-dark-2);
  padding: 1rem 2rem;
  min-width: 16rem;
  border: var(--border);
  z-index: 41;
  border-left: 5px solid var(--border-color);
}

.notif.success {
  border-color: var(--color-sucess);
}
.notif.error {
  border-color: var(--color-danger);
}
.notif.info {
  border-color: var(--border-color);
}
</style>
