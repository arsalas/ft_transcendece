<template>
  <div class="container-profile animate__animated animate__fadeIn">
    <header class="text">
      <slot name="header"></slot>
    </header>
    <div class="body">
      <slot name="body"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
.container-profile {
  border: var(--border);
  border-radius: var(--border-radius);
  overflow: hidden;

  & header {
    background-color: var(--bg-dark-2);
    padding: 0.5rem 1.3rem;
    font-weight: bold;
    font-size: 1.5rem;
    border-bottom: var(--border);
  }

  & .body {
    padding: 1.5rem;
    background-color: var(--bg-dark-0);
  }
}
</style>
