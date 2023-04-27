<template>
	<div class="container-profile">
		<header>
			Two-Factor Auth
		</header>
		<div class="body">
			<p>Two-Factor Auth helps to secure your ArtStation account from takeover and data loss</p>

			<p class="mt-2">To enable Two-Factor Auth:</p>
			<ul class="mt-2">
				<li>
					<span class="tag is-rounded is-primary mr-1">1</span>
					Enabled Two Factor Auth
				</li>
				<li>
					<span class="tag is-rounded is-primary mr-1">2</span>
					Download Google Authenticator
				</li>
			</ul>

			<button class="button is-primary mt-2" :class="{ 'is-outlined': !user.twoFactorAuth }">
				{{ user.twoFactorAuth ? 'Enabled' : 'Disabled' }}
			</button>

			<div class="columns mt-2">
				<div class="column">
					<figure class="image qr">
						<img src="../../../../assets/qr_android.png" alt="">
					</figure>

					<div class="store-btn">

						<span class="icon-text">
							<span class="icon">
								<i class="fa-brands fa-google-play"></i>
							</span>
							<span>Google Play</span>
						</span>
					</div>

					<!-- <i class="fa-brands fa-google-play"></i>
					<a class="appstore-button" href="https://itunes.apple.com/us/app/artstation-app/id924645286"
						target="_blank">App Store</a> -->
				</div>


				<div class="column">
					<figure class="image qr">
						<img src="../../../../assets/qr_ios.png" alt="">
					</figure>

					<div class="store-btn">

						<span class="icon-text">
							<span class="icon">
								<i class="fa-brands fa-apple"></i>
							</span>
							<span>App Store</span>
						</span>
					</div>


					<!-- <i class="fa-brands fa-apple"></i>
					<a class="appstore-button" href="https://itunes.apple.com/us/app/artstation-app/id924645286"
						target="_blank">Google Play</a> -->
				</div>
			</div>

		</div>
	</div>
</template>
<script lang='ts' setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia';

import { useUserStore } from '../../../../stores'
import { useForm } from '../../../common/composables'

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

.container-profile {
	border: 1px solid var(--border-color);

	& header {
		background-color: var(--color-bg-primary);
		padding: 0.5rem;
		font-weight: bold;
		font-size: 1.2rem;
	}

	& .body {
		padding: 1.5rem;
	}


	.qr {
		padding: 2rem;
		background-color: var(--color-bg-primary);

		& img {
			aspect-ratio: 1;
		}
	}
}

.store-btn {
	padding: 1rem;
	background-color: #333;
	// width: 50%;
	border: 1px solid #fff;
	border-radius: 4px;
	color: #fff;
	text-align: center;
}
</style>