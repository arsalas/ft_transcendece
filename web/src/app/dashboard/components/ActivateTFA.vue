<template>
	<Box>
		<template v-slot:header>
			QR Code
		</template>
		<template v-slot:body>
			<p class="text field">
				Save this image in a safety place
			</p>
			<div class="qrCode">
				<QRCode icon="" :image="qr" text="" isExternal />
			</div>
			<p class="text field mt-4"> Insert the app code to confirm</p>
			<form @submit.prevent="handleSubmit">
				<div class="field">

					<div class="control">
						<input ref="codeRef" v-model.trim="code" class="input" placeholder="code" />
					</div>
				</div>
				<div class="field">
					<button type="submit" class="button is-primary is-fullwidth"
						:class="{ 'is-loading': isLoading }">Send</button>
				</div>
			</form>
		</template>
	</Box>
</template>
<script lang='ts' setup>
// IMPORTACIONES
import { defineAsyncComponent, onMounted, ref } from 'vue';

import { useLoading, useModal, useNotifications } from '../../common/composables';
import { providers } from '../../../providers';
import { useUserStore } from '../../../stores';
import { storeToRefs } from 'pinia';

// COMPONENTES
const Box = defineAsyncComponent(() => import('../../common/components/Box.vue'))
const QRCode = defineAsyncComponent(() => import('./QRCode.vue'))

// STORES
const userStore = useUserStore()
const { user } = storeToRefs(userStore);

// COMPOSABLES
const notifications = useNotifications()
const { isLoading } = useLoading();
const { close } = useModal();

// PROVIDERS
const { editProfileService } = providers();

// PROPS
defineProps<{
	qr: string
}>()

// VARIABLES
const codeRef = ref<HTMLInputElement>();
const code = ref<string>("");

// FUNCIONES

onMounted(() => {
	// Ponemos el foco en el input
	setTimeout(() => codeRef.value?.focus(), 100);
})

const handleSubmit = async () => {
	try {
		isLoading.value = true;
		await editProfileService.activateTFA(code.value);
		close();
		user.value.twoFactorAuth = true;
		notifications.success("Two Factor Authenticate Actived")
	} catch (error) {
		notifications.error("Can't activate Two Factor Authenticate Actived")
	} finally {
		isLoading.value = false;
	}
}

</script>
<style lang='scss' scoped>
.qrCode {
	justify-content: center;
	display: flex;

}
</style>