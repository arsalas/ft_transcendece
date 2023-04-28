<template>
	<!-- <Transition name="custom-classes" enter-active-class="animate__animated animate__slideInRight"
		leave-active-class="animate__animated animate__slideOutRight"> -->
	<div class="notif">
		<div class="text">
			{{ notifications.message }}
		</div>
	</div>
	<!-- </Transition> -->
</template>
<script lang='ts' setup>
import { onMounted } from 'vue';
import { useNotifications } from '../composables/useNotifications';

const notifications = useNotifications();

onMounted(() => {
	setTimeout(() => { notifications.close() }, 2000)
})

</script>
<style lang='scss' scoped>
.notif {
	position: fixed;
	top: 5rem;
	right: 2rem;
	background-color: var(--bg-dark-2);
	padding: 1rem 2rem;
	min-width: 16rem;
	border: var(--border);
	z-index: 2;
}
</style>