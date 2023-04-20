<template></template>
<script lang='ts' setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { signIn } from '../api'

const route = useRoute();

const user = ref<any>("NADA");

onMounted(() => {
    signInApp();
})

const signInApp = async (): Promise<void> => {
    try {
        const response = await signIn(route.query.code as string);
        user.value = response;
    } catch (error) {

    }


}




</script>
<style lang='scss' scoped></style>