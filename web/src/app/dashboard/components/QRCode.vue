<template>
	<div class="qr-code">
		<figure class="image qr">
			<img :src="src" alt="">
		</figure>

		<div class="store-btn">

			<span class="icon-text">
				<span class="icon text">
					<i :class="icon"></i>
				</span>
				<span class="text is-text-bold">{{ text }}</span>
			</span>
		</div>
	</div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';


const props = defineProps<{
	image: string;
	icon: string;
	text: string;
}>()
const src = ref<string>("");

// Importacion dinamica
import('../../../assets/' + props.image).then(data => src.value = data.default).catch(e => e)

</script>
<style lang='scss' scoped>
.qr-code {
	background-color: var(--bg-dark-1);
	border: var(--border);

}

.qr {
	padding: 2rem;

	& img {
		aspect-ratio: 1;
	}
}


.store-btn {
	padding: 1rem;
	background-color: var(--bg-dark-2);
	border-top: var(--border);

	// width: 50%;
	// border: 1px solid #fff;
	// border-radius: 4px;
	color: #fff;
	text-align: center;
}
</style>