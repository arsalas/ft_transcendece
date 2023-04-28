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
			<button class="button is-primary mt-4" :class="{ 'is-outlined': !user.twoFactorAuth }">
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
import { defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from 'pinia';

import { useUserStore } from '../../../../stores'
import { useForm } from '../../../common/composables'

const Box = defineAsyncComponent(() => import('../../../common/components/Box.vue'))
const QRCode = defineAsyncComponent(() => import('../../components/QRCode.vue'))

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const formRef = ref(null);
const image = ref(user.value.avatar || user.value.avatar42);


const { createImageFromInput } = useForm();
const handleChange = async (e: Event) => {

	image.value = await createImageFromInput(e);

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
	// aspect-ratio: 1;
}
</style>