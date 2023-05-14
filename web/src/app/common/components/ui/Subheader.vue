<template>
  <header class="sub-header">
    <nav>
      <slot name="left" />
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
      <slot name="right" />
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
  //   background-color: var(--bg-dark-1);
  //   border-bottom: var(--border);
  .nav-items {
    display: flex;
    justify-content: center;
    text-transform: uppercase;
  }

  .actions {
    padding: 0rem 1rem;
  }

  nav,
  ul,
  li{
	  height: 100% ;
	  display: flex;
	  align-items: center;

  }
  a {
    height: calc(100% - 2px);
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
  }

  .nav-items li a {
    padding: 0rem 1rem;
    font-weight: bold;
    color: var(--color-text);
    &:hover {
        color: rgba(255, 255, 255, 0.8);
    //   background-image: linear-gradient(
    //     rgba(255, 255, 255, 0),
    //     rgba(var(--color-primary-rgb), 0.2)
    //   );
    }
  }

  .router-link-exact-active {
    // background-image: linear-gradient(
    //   rgba(255, 255, 255, 0),
    //   rgba(var(--color-primary-rgb), 0.7)
    // );

    border-color: var(--border-color);
    // height: 100%;
  }
}
</style>
