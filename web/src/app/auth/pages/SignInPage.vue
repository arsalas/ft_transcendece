<template>
	<div class="auth-container">

		<div class="auth-aside">
			<div class="login">
				<div>
					<div class="brand text">CYBERP<i class="fa-solid fa-circle"></i>NG</div>
				</div>
				<a class="button is-primary is-outlined is-large"
					:href="CONFIG.API_REDIRECT">
					SIGN IN 42
				</a>
			</div>
			<footer class="text">
				ft_trancendence by -amurcia & aramirez
			</footer>

		</div>
		<div class="auth-image is-hidden-touch">
			<div class="cont-img"></div>
		</div>


	</div>
</template>
<script lang='ts' setup>
import { CONFIG } from '../../../config';



</script>
<style lang='scss' scoped>

.brand{
	font-size: 2.5rem;
}
.auth-container {
	display: flex;
	height: 100vh;
	color: var(--color-text-primary);

	& .auth-aside {
		background-color: var(--bg-dark-1);
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
		background-color: #111;
		flex: 2;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;


		& .cont-img {

			background-image: url('../../../assets/background_pong.jpeg');
			background-size: contain;
			background-repeat: no-repeat;
			background-position: center;
			width: 100%;
			height: 100%;
		}

	}

	& footer {
		font-size: 1.1rem;
		font-weight: 800;
	}
}

.login-btn {
	padding: 1rem 3rem;
	background-color: var(--color-text-primary);
	color: var(--color-primary);
	border: 2px solid var(--color-primary);
	border-radius: 10px;
	font-weight: bold;
	font-size: 1.8rem;
	transition: 300ms;
	cursor: pointer;

	&:hover {
		background-color: var(--color-primary);
		color: var(--color-text-primary);
		-webkit-box-shadow: 2px 4px 18px 1px rgba(#c252e1, 1);
		-moz-box-shadow: 2px 4px 18px 1px rgba(#c252e1, 1);
		box-shadow: 2px 4px 18px 1px rgba(#c252e1, 1);
	}
}
</style>