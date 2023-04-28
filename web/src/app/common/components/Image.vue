<template>
	<img loading="lazy" :src="src ? src : fallback" @error="handleError">
</template>
<script lang='ts' setup>
const props = defineProps<{
	src?: string;
	fallback?: string;
	isRounded?: boolean;
}>()

const handleError = (event: Event) => {
	const img = event.target as HTMLImageElement;
	if (props.fallback)
		img.src = props.fallback;
	else
		img.src = 'props.fallback';
	// TODO poner una imagen generica de fallo
} 
</script>
<style lang='scss' scoped></style>