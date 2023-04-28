<script setup lang="ts">
// TODO asyncLoad
import Notification from './app/common/components/Notification.vue';
import { useNotifications } from './app/common/composables/useNotifications';

const { isOpen } = useNotifications();

</script>

<template>
	<div class="app">
		<Transition name="custom-classes" enter-active-class="animate__animated animate__slideInRight animate__faster"
			leave-active-class="animate__animated animate__slideOutRight animate__faster">
			<Notification v-if="isOpen" message="Holasfdad" />
		</Transition>
		<RouterView />
	</div>
</template>

<style scoped>
.app {
	background-image:
		linear-gradient(rgba(0, 0, 0, 1),
			rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 1)),
		url("./assets/bg_spash.jpg");
	background-position: center;
	background-size: cover;
	background-attachment: fixed;
	min-height: 100vh;
}
</style>
