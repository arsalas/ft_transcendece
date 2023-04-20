<template>
    <div class="section">

        <div class="title">

            SIGIN
        </div>

        <a class="button is-primary"
            href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-002f8307ed61fa03609f72d495d3a6e7efe6c446b08744c9b33e4ea27e613829&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fauth%2Fconfirm&response_type=code">
            Login
        </a>

        <!-- <button @click="" class="button is-primary">LOG IN 42</button> -->

    </div>
</template>
<script lang='ts' setup>

import { signIn } from '../api'



</script>
<style lang='scss' scoped></style>