<template>
	<Box>
		<template v-slot:header>
			Profile
		</template>
		<template v-slot:body>
			<div class="container-avatar">
				<figure class="avatar">
					<img class="is-rounded" :src="image">
				</figure>
				<button @click="formRef.click()" class="mt-2 button is-primary">
					<span class="icon">
						<i class="fa-solid fa-upload"></i>
					</span>
					<span> Upload new avatar</span>
				</button>
				<input ref="formRef" @change="handleChange" type="file" hidden>
			</div>
			<form @submit.prevent="" class="container-username mt-4">
				<div class="field">
					<div class="control">
						<input class="input" type="text" placeholder="Username">
					</div>
				</div>
				<div class="field is-grouped">
					<div class="control">
						<button class="button is-primary" @click="notifications.success('Hola')">
							<span class="icon">
								<i class="fa-solid fa-floppy-disk"></i>
							</span>
							<span> Save</span>
						</button>
					</div>

				</div>
			</form>
		</template>
	</Box>
</template>
<script lang='ts' setup>
import { defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from 'pinia';

import { useUserStore } from '../../../../stores'
import { useForm } from '../../../common/composables'
import { useNotifications } from '../../../common/composables/useNotifications';

const notifications = useNotifications()

const Box = defineAsyncComponent(() => import('../../../common/components/Box.vue'))

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const formRef = ref(null);
const image = ref("http://localhost:3000/image/" + user.value.avatar || user.value.avatar42);


const { createImageFromInput } = useForm();
const handleChange = async (e: Event) => {

	image.value = await createImageFromInput(e);

}
</script>
<style lang='scss' scoped>
.avatar img {
	width: 10rem;
	aspect-ratio: 1;
	border-radius: 50%;
	object-fit: cover;
	object-position: center;
}

.container-avatar {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 0.5rem;
}
</style>