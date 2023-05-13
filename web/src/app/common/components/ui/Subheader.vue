<template>
  <header class="sub-header">
    <nav>
      <ul class="nav-items">
        <li class="text" v-for="item in items">
          <router-link
            :to="{
              name: item.route.path,
              params: item.route.params,
            }">
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="actions">
      <slot />
    </div>
  </header>
</template>
<script lang="ts" setup>
import { RouteParamsRaw } from 'vue-router';

defineProps<{
  items: {
    name: string;
    route: { path: string; params: RouteParamsRaw };
  }[];
}>();
</script>
<style lang="scss" scoped>
.sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--subheader-h);
  background-color: var(--bg-dark-1);
  border-bottom: var(--border);
  text-transform: uppercase;
  .nav-items {
    display: flex;
    justify-content: center;
  }

  .actions{
	padding: 0rem 1rem;
  }

  nav,
  ul,
  li,
  a {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .nav-items li a {
    padding: 0rem 1rem;
    font-weight: bold;
    color: var(--color-text);
    &:hover {
      //   color: rgba(255, 255, 255, 0.5);
      background-image: linear-gradient(
        rgba(255, 255, 255, 0),
        rgba(var(--color-primary-rgb), 0.2)
      );
    }
  }

  .router-link-exact-active {
    // color: rgba(255, 255, 255, 0.4);
    // background-color: rgba(var(--color-primary-rgb), 0.5);
    background-image: linear-gradient(
      rgba(255, 255, 255, 0),
      rgba(var(--color-primary-rgb), 0.7)
    );
    // border-bottom: 1px solid red;
    // height: 100%;
  }
}
</style>
