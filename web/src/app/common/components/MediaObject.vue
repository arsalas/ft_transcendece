<template>
  <div class="media-object">
    <Avatar
      :class="status ?? 'bordered'"
      :src="image"
      :fallback="imageFallback"
      :width="width" />
    <div>
      <div class="text">{{ name }}</div>
      <div
        @click="click"
        class="text is-small"
        :class="[status, click ? 'is-clickable' : '']">
        {{ status }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
const Avatar = defineAsyncComponent(() => import('./images/Avatar.vue'));

defineProps<{
  image: string | null;
  imageFallback: string;
  name: string;
  status?: string;
  width: string;
  click?: () => void;
}>();
</script>

<style lang="scss" scoped>
.media-object {
  display: flex;
  align-items: center;
  //   padding: 0.25rem 0.5rem;

  & img {
    margin-right: 1rem;
  }
}
</style>
