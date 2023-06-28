<template>
	<Box>
		<template v-slot:header>
			Profile
		</template>
		<template v-slot:body>
			<div class="container-avatar">
				<figure class="avatar">
					<Image class="is-rounded" :src="image" :fallback="user.avatar42"/>
				</figure>
				<button @click="formRef!.click()" class="mt-2 button is-primary">
					<span class="icon">
						<i class="fa-solid fa-upload"></i>
					</span>
					<span> Upload new avatar</span>
				</button>
				<input ref="formRef" @change="handleChange" type="file" hidden>
			</div>
			<form @submit.prevent="handleSubmit" class="container-username mt-4">
				<div class="field">
					<div class="control">
						<input v-model="username" class="input" type="text" placeholder="Username">
					</div>
				</div>
				<div class="field is-grouped">
					<div class="control">
						<button class="button is-primary" :class="{ 'is-loading': isLoading }">
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
import { defineAsyncComponent, inject, ref } from 'vue'
import { storeToRefs } from 'pinia';

import { useForm, useLoading, useNotifications } from '../../../common/composables'
import { useUserStore } from '../../../../stores'
import { EditProfieService } from '../../services';

// COMPONENTES
const Box = defineAsyncComponent(() => import('../../../common/components/ui/Box.vue'))
const Image = defineAsyncComponent(() => import('../../../common/components/images/Image.vue'))

// STORES
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// PROVIDERS
const  editProfileService  = inject<EditProfieService>('editProfileService')!;

// COMPOSABLES
const notifications = useNotifications()
const { createImageFromInput } = useForm();
const { isLoading } = useLoading();

// VARIABLES
const formRef = ref<HTMLInputElement>();
const image = ref(user.value.avatar || user.value.avatar42);
const file = ref<File>();
const username = ref<string>(user.value.username || "")

// FUNCIONES
/**
 * Envio del formulario
 * @param e evento submit formulario
 */
const handleSubmit = async (e: Event): Promise<void> => {
	try {
		isLoading.value = true;
		const formData = new FormData();
		formData.append('username', username.value);
		if (file.value)
			formData.append('file', file.value);
		const res = await editProfileService.update(formData);
		user.value.username = username.value;
		user.value.avatar = res?.avatar
		notifications.success("Changes saved");
	} catch (error) {
		notifications.error("Can't save changes");

	} finally {
		isLoading.value = false;
	}
}

/**
 * Se guarda la imagen subida y se actualiza la imagen del usuario
 * @param e evento change input file
 */
const handleChange = async (e: Event) => {

	const element = e.target as HTMLInputElement;

	if (element.files && element.files.length) {
		file.value = element.files[0];
		image.value = await createImageFromInput(e);
	}
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