<template>
	<div class="container">

		<div class="section">

			<div class="columns">
				<div class="column is-4">
					<div class="menu-options">
						<ul>
							<li>
								<router-link :to="{ name: 'profile' }">

									Profile
								</router-link>
							</li>
							<li>
								<router-link :to="{ name: 'twoFactorAuth' }">
									Two-Factor Auth
								</router-link>
							</li>
							<li>Themes</li>
							<li>Blocking</li>
						</ul>
					</div>
				</div>
				<div class="column">
					<RouterView />
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
.menu-options {
	& ul {
		border: 1px solid var(--border-color);

		& li {
			padding: 0.6rem 1.2rem;
			border-top: 1px solid var(--border-color);
			border-left: 5px solid var(--border-color);
			font-weight: 400;

			&:first-child {
				border-top: 0px;
			}
		}
	}

}
</style>