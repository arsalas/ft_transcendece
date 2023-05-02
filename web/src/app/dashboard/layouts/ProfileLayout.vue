<template>
    <!-- Necesita tener un RouterView por ser un layout
    Lo que este en routerview es lo que se mantiene -->
    <!-- aqui solo la barrita de arriba -->
    <div class="container">
        <div class="section">
            <div class="control">
                <input ref="userRef" v-model.trim="user" class="input" placeholder="user" />
            </div>
            <div class="columns">
                <div class="column is-10">
                    <div class="overview">
                        <!-- v-for='HOLA' -->
                        <ul>
                            <li class="text">
                                Username:
                            </li>
                            <li class="text">
                                42-username:
                            </li>
                            <li class="text">
                                Stadistics
                            <li class="text">
                                Winned:
                            </li>
                            <li class="text">
                                Losed:
                            </li>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    LAYOUT
    <RouterView />
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia';

const user = ref<string>("");

const successAuth = (login: string) => {

}

</script>

<style lang='scss' scoped>
.overview {
    & ul {
        border: 1px solid var(--border-color);

        & li {
            background-color: var(--bg-dark-1);

            font-weight: 300;

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
        }
    }
}
</style>