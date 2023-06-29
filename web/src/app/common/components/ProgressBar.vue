<template>
  <div class="progress-bar">
    <div class="completed" :style="{ width: `${progress * 100}%` }"></div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  value: number;
  max: number;
}>();

const progress = computed(() => Math.min(props.value, props.max) / props.max);
</script>
<style lang="scss" scoped>
.progress-bar {
  background-color: var(--bg-dark-0);
  height: 10px;
  border: solid 1px var(--color-primary);
  border-radius: var(--border-radius);
}

.completed {
  height: 100%;
  background-color: var(--color-primary-hover);
}
</style>
