<template>
    <div class="auth-container">

        <div class="auth-aside">
            <div class="login">
                <div>

                    <img src="../../../assets/pong logo.png" alt="" srcset="">
                </div>
                <a class="login-btn"
                    href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-002f8307ed61fa03609f72d495d3a6e7efe6c446b08744c9b33e4ea27e613829&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fauth%2Fconfirm&response_type=code">
                    SIGN IN 42
                </a>
            </div>
            <footer>
                Ft transendence by -amurcia & aramirez
            </footer>

        </div>
        <div class="auth-image is-hidden-touch">
        </div>


    </div>
</template>
<script lang='ts' setup>


</script>
<style lang='scss' scoped>
.auth-container {
    display: flex;
    height: 100vh;
    color: #ddd;

    & .auth-aside {
        background-color: #001339;
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

        & .login {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            &>* {
                margin-bottom: 2rem;
            }
        }

    }

    & .auth-image {
        background-image: url('../../../assets/background_pong.jpeg');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background-color: #111;
        flex: 2;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    & footer {
        font-size: 1.3rem;
        font-weight: 800;
    }
}

.login-btn {
    padding: 1rem 3rem;
    background-color: #00babc;
    color: #ddd;
    border-radius: 10px;
    font-weight: bold;
    font-size: 1.8rem;
    transition: 300ms;
    cursor: pointer;

    &:hover {
        background-color: #009699;
        -webkit-box-shadow: 2px 4px 18px 1px rgba(#00babc,1);
-moz-box-shadow: 2px 4px 18px 1px rgba(#00babc,1);
box-shadow: 2px 4px 18px 1px rgba(#00babc,1);
    }
}
</style>