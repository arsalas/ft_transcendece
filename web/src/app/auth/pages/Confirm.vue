<template></template>
<script lang='ts' setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { signIn } from '../api'
import { useAuthStore, useUserStore } from '../../../stores';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore)

const route = useRoute();
const router = useRouter();


onMounted(() => {
	signInApp();
})

const signInApp = async (): Promise<void> => {
	try {
		const response = await signIn(route.query.code as string);
		authStore.signIn(response.token);
		userStore.setUser(response.user);
		if (!user.value.username)
			router.push({ name: 'profile' })
		else
			router.push({ name: 'profile' })

	} catch (error) {

	}


}




</script>
<style lang='scss' scoped></style>