<template>
    <div class="media-object">
        
        <img class="avatar" src="https://cdn.intra.42.fr/users/61da00534362577f043e040efaf1a1e7/aramirez.jpg"
            alt="">
        <div class="media-text">
            <div class="name">
                aramirez
            </div>
            <div class="status">
                conectado
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue';

const props = defineProps<{
    avatar: string;
    status: string;
    username: string;
}>()
console.log("ALBERTO");
</script>

<style lang="scss" scoped>
    .media-object {
        height: 100%;
        display: flex;

        & .avatar {
            height: 100%;
            aspect-ratio: 1;
            border-radius: 50%;
        }
    }

    .status {
        color: white;
    }

    // .name { // este name hace referencia al html, que conectado con Chat.vue irá conectado a props
    //     color: black;

    // }

    .media-text { // esto es una clase, no una variable
        display: flex;
        padding-left: 1rem;
        flex-direction: column;
        justify-content: center;
    }

</style>