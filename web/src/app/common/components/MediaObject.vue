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

const props = defineProps({ task: Object });
</script>

<script lang="scss" scoped></script>
