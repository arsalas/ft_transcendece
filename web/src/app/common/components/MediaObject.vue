<template>
  <div class="media-object">
    <Avatar :src="image" :fallback="imageFallback" :width="width" />
    <div>
      <div class="text">{{ name }}</div>
      <div class="text is-small">{{ status }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
const Avatar = defineAsyncComponent(() => import('./images/Avatar.vue'));

const props = defineProps<{
  image: string;
  imageFallback: string;
  name: string;
  status?: string;
  width: string;
}>();
</script>

<style lang="scss" scoped>
.media-object {
  display: flex;
  align-items: center;
//   padding: 0.25rem 0.5rem;

  & img {
    margin-right: 1rem;
    border: 2px solid var(--color-online-0);
  }
}
</style>
