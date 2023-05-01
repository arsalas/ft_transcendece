<template>
  <img loading="lazy" :src="src ? src : fallback" @error="handleError" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  src?: string;
  fallback?: string;
  isRounded?: boolean;
  isExternal?: boolean;
}>();

const img = ref<string>('');

// Importacion dinamica
if (!props.isExternal)
  import('../../../assets/' + props.src!)
    .then((data) => (img.value = data.default))
    .catch((e) => e);
else img.value = props.src!;

const handleError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (props.fallback) img.src = props.fallback;
  else img.src = 'props.fallback';
  // TODO poner una imagen generica de fallo
};
</script>
<style lang="scss" scoped></style>
