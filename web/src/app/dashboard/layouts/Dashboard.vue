<template>
    <Navbar />
    <div>

        <router-view></router-view>
    </div>
</template>
<script lang='ts' setup>
import { defineAsyncComponent } from 'vue';

const Navbar = defineAsyncComponent(() => import('../../common/components/Navbar.vue'))

</script>
<style lang='scss' scoped>
</style>