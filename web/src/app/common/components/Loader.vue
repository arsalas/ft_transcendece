<template>
	<div class="loader-box" :class="{ 'full-size': isFullsize }">
		<div class="lds-ring">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
</template>
<script lang='ts' setup>
const props = defineProps<{
	isFullsize?: boolean
}>()
</script>
<style lang='scss' scoped>
.loader-box {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20px;
	height: calc(100vh - 60px - 40px);
}


.full-size {
	// height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: rgba($color: #000000, $alpha: 0.5);
	z-index: 2;
	height: 100vh;
}
</style>