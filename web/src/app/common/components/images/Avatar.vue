<template>
  <Image class="avatar" :src="src" :fallback="fallback" />
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

const Image = defineAsyncComponent(() => import('../Image.vue'));

const props = defineProps<{
  src: string;
  width: string;
  fallback?: string;
}>();
</script>
<style lang="scss" scoped>
.avatar {
  width: v-bind(width);
  border-radius: 50%;
  aspect-ratio: 1;
}
</style>
