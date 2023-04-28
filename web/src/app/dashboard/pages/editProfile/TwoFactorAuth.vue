<template>
	<Box>
		<template v-slot:header>
			Two-Factor Auth
		</template>
		<template v-slot:body>
			<p class="text">Two-Factor Auth helps to secure your ArtStation account from takeover and data loss</p>
			<p class="mt-2 text">To enable Two-Factor Auth:</p>
			<ul class="mt-2">
				<li class="text">
					<div class="list is-text-bold">1</div>
					Enabled Two Factor Auth
				</li>
				<li class="text mt-2">
					<div class="list is-text-bold">2</div>
					Download Google Authenticator
				</li>
			</ul>
			<button @click="handleClick" class="button is-primary mt-4"
				:class="{ 'is-outlined': !user.twoFactorAuth, 'is-loading': isLoading }">
				{{ user.twoFactorAuth ? 'Enabled' : 'Disabled' }}
			</button>
			<div class="columns mt-2">
				<div class="column">
					<a href="https://itunes.apple.com/us/app/artstation-app/id924645286" target="_blank">
						<QRCode icon="fa-brands fa-google-play" image="qr_android.png" text="Google Play" />
					</a>
				</div>
				<div class="column">
					<a href="https://itunes.apple.com/us/app/artstation-app/id924645286" target="_blank">
						<QRCode icon="fa-brands fa-apple" image="qr_ios.png" text="App Store" />
					</a>
				</div>
			</div>
		</template>
	</Box>
</template>
<script lang='ts' setup>
import { defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia';

import { useUserStore } from '../../../../stores'
import { useLoading, useNotifications } from '../../../common/composables'
import { providers } from '../../../../providers';

// COMPONENTES
const Box = defineAsyncComponent(() => import('../../../common/components/Box.vue'))
const QRCode = defineAsyncComponent(() => import('../../components/QRCode.vue'))

// STORES
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// PROVIDERS
const { srvEditProfile } = providers();

// COMPOSABLES
const notifications = useNotifications()
const { isLoading } = useLoading();

// FUNCIONES
const handleClick = async (e: Event): Promise<void> => {
	try {
		isLoading.value = true;
		const body = {
			twoFactorAuth: !user.value.twoFactorAuth
		}
		await srvEditProfile.update(body);
		user.value.twoFactorAuth = body.twoFactorAuth;
		notifications.success("Changes saved");
	} catch (error) {
		notifications.error("Can't save changes");

	} finally {
		isLoading.value = false;
	}
}

</script>
<style lang='scss' scoped>
li {
	display: flex;
	align-items: center;
}

.list {
	background-color: var(--color-primary);
	border-radius: 50%;
	width: 1.6rem;
	height: 1.6rem;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 1rem;
}
</style>