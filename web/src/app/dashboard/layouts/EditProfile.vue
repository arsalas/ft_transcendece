<template>
	<div class="container">
		<div class="section">
			<div class="columns">
				<div class="column is-4">
					<div class="menu-options">
						<ul>
							<li class="text">
								<router-link :to="{ name: 'editProfile' }">
									Profile
								</router-link>
							</li>
							<li class="text">
								<router-link :to="{ name: 'twoFactorAuth' }">
									Two-Factor Auth
								</router-link>
							</li>
							<!-- <li class="text">
								<router-link :to="{ name: 'profile' }">
									Themes
								</router-link>
							</li> -->
							<li class="text">
								<router-link :to="{ name: 'blocking' }">
									Blocking
								</router-link>
							</li>
						</ul>
					</div>
				</div>
				<div class="column">

					<RouterView />
					<!-- <router-view v-slot="{ Component }">
						<Transition name="custom-classes" enter-active-class="animate__animated animate__fadeIn animate__delay-1s"
							leave-active-class="animate__animated animate__fadeOut">
							<component :is="Component" />
						</Transition>
					</router-view> -->
				</div>
			</div>
		</div>
	</div>
</template>
<script lang='ts' setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia';

import { useUserStore } from '../../../stores'
import { useForm } from '../../common/composables'

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
.custom-classes-enter-from,
.custom-classes-leave-to {
	// display: none;
}



.menu-options {
	& ul {
		border: 1px solid var(--border-color);

		& li {
			background-color: var(--bg-dark-1);

			font-weight: 400;

			border-top: var(--border);

			&:first-child {
				border-top: 0px;
			}

			& a {
				// border-left: 0.3rem solid var(--border-color);
				padding: 0.6rem 1.2rem;
				width: 100%;
				height: 100%;
				display: block;

				&:hover {
					background-color: var(--bg-dark-0);

				}
			}

			.router-link-exact-active {
				width: 100%;
				background-color: var(--color-primary);
				// color: var(--color-primary);
			}
		}
	}

}
</style>