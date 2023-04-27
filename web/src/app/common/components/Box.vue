<template>
    <div class="container-profile">
		<header>
			<slot name="header"></slot>
		</header>
		<div class="body">
			<slot name="body"></slot>
		</div>
	</div>
</template>
<script lang='ts' setup>
</script>
<style lang='scss' scoped>

.container-profile {
	border: 1px solid #333;

	& header {
		background-color: red;
		padding: 0.5rem;
		font-weight: bold;
		font-size: 1.2rem;
	}

	& .body {
		padding: 1.5rem;
	}
}

</style>