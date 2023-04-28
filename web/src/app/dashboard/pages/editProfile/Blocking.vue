<template>
	<Box>
		<template v-slot:header>
			Blocking
		</template>
		<template v-slot:body>

			<p class="text">Block Users
				Blocking a user prevents that user from messaging you. The purpose of this feature is to prevent users from
				harassing you on Cyberpong.
			</p>


			<form class="mt-5">


				<label class="label text">Search for a user’s name you wish to block</label>
				<div class="field is-grouped">
					<p class="control is-expanded">
						<input class="input" type="text" placeholder="Search username">
					</p>
					<p class="control">
						<a class="button is-primary">
							Block
						</a>
					</p>
				</div>
			</form>


			<div class="mt-4 text">
				Blocked Users
			</div>

			<div class="panel mt-3">
				<header class="text">USER</header>
				<div class="body">


					<div v-for="i in 5" class="user">

						<div class="media">
							<img
								src="https://cdnb.artstation.com/p/users/avatars/000/272/313/medium/947dd2575788d5366e38f91fc1deed59.jpg?1681406726">
							<div class="username text">aramirez</div>

						</div>

						<div class="button is-primary is-small">Unblock</div>
					</div>

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
.panel {
	border: var(--border);
	border-radius: var(--border-radius);

	& header {
		background-color: var(--bg-dark-2);
		border-bottom: var(--border);
		padding: 0.35rem 0.5rem;
		font-weight: 700;

	}

}

.media {
	display: flex;
	align-items: center;


	& img {

		width: 2.4rem;
		aspect-ratio: 1;
		border-radius: 50%;
	}

	& .username {
		padding-left: 1.25rem;
	}
}

.user {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: var(--border);
	padding: 0.25rem 0.5rem;

	&:last-child {
		border-bottom: 0px;
	}

}
</style>