<template>
    <div class="container">

        <div class="section">

            <div class="columns">
                <div class="column is-4">


                    <div class="menu-options">
                        <ul>
                            <li>Username</li>
                            <li>Avatar</li>
                            <li>Two Factor Authenticate</li>
                            <li>Themes</li>
                            <li>Usuarios bloqueados</li>
                        </ul>
                    </div>
                </div>
                <div class="column">
                    <form>
                        <div class="field">
                            <div class="control">
                                <input class="input" type="text" placeholder="Text input">
                            </div>
                        </div>





                        <div class="field">
                            <div class="control">
                                <label class="checkbox">
                                    <input type="checkbox">
                                    Two Factor Authenticate
                                </label>
                            </div>
                        </div>



                        <div class="field is-grouped">
                            <div class="control">
                                <button class="button is-link">Submit</button>
                            </div>

                        </div>


                    </form>
                </div>
            </div>





        </div>
    </div>
</template>
<script lang='ts' setup>
</script>
<style lang='scss' scoped>
.menu-options {
    & ul {
        border: 1px solid #333;

        & li {
            padding: 1rem 2rem;
            border-top: 1px solid #333;
            border-left: 5px solid #333;

            &:first-child {
                border-top: 0px;
            }
        }
    }
}
</style>