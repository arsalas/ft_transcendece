<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <Transition
        name="custom-classes"
        enter-active-class="animate__animated animate__zoomIn animate__faster"
        leave-active-class="animate__animated animate__zoomOut animate__faster">
        <slot v-if="isOpenContent"></slot>
      </Transition>
    </div>
    <button
      @click="close"
      class="modal-close is-large"
      aria-label="close"></button>
  </div>
</template>
<script lang="ts" setup>

defineProps<{
  isOpenContent: boolean;
}>();

const emits = defineEmits(['close']);

const close = () => {
  emits('close');
};
</script>
<style lang="scss" scoped></style>
