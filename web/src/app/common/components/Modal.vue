<template>
	<div class="modal is-active" >
		<div class="modal-background"></div>
		<div class="modal-content">

			<Transition name="custom-classes" enter-active-class="animate__animated animate__zoomIn animate__faster"
				leave-active-class="animate__animated animate__zoomOut animate__faster">
				<slot v-if="isOpenContent"></slot>
			</Transition>
		</div>
		<button @click="close" class="modal-close is-large" aria-label="close"></button>
	</div>
</template>
<script lang='ts' setup>
import { onMounted } from 'vue';
import { useModal } from '../composables';

const { isOpen, isOpenContent, close } = useModal();

useModal
	// const { close, message, type } = use;();



</script>
<style lang='scss' scoped></style>