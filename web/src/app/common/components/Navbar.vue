<template>
	<header class="navbar">
		<div class="left">
			<div class="brand">
				<img src="../../../assets/pong logo.png" alt="">
			</div>
			<nav>
				<ul>
					<li>
						<router-link :to="{ name: 'chat' }">
							<span class="icon">
								<i class="fa-sharp fa-solid fa-comments"></i>
							</span>
						</router-link>
					</li>
					<li>
						<span class="icon">
							<i class="fa-solid fa-table"></i>
						</span>
					</li>
					<li>
						<span class="icon ">
							<i class="fa-solid fa-trophy"></i>
						</span>
					</li>
					<li>
						<router-link :to="{ name: 'profile' }">
							<span class="icon ">
								<i class="fa-solid fa-user"></i>
							</span>
						</router-link>
					</li>
				</ul>
			</nav>
		</div>
		<aside class="right">
			<div class="media-object">

				<img class="avatar" :src="user.avatar || user.avatar42" alt="">
				<div class="media-text">
					<div class="name">
						{{ user.username || user.login }}
					</div>
					<div class="status">
						conectado
					</div>
				</div>
			</div>
		</aside>
	</header>
</template>
<script lang='ts' setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '../../../stores';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>
<style lang='scss' scoped>
.navbar {
	height: 60px;
	background-color: var(--color-bg-primary);
	display: flex;
	padding: 0rem 0rem;
	justify-content: space-between;
	position: sticky;
	top: 0;
}

.left {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0rem 1rem;
	color: var(--color-text-primary);
	width: 100%;
}

.right {
	padding: 0.4rem 2rem;
	width: 20rem;

}

.brand {
	height: 100%;

	& img {
		height: 100%;
	}
}

nav {
	transition: 300ms;

	& ul {
		display: flex;

		& li {
			padding: 0rem 1rem;
			cursor: pointer;

			& .icon {
				font-size: 1.2rem;
				transition: 300ms;

				&:hover {
					color: var(--color-primary)
				}
			}

			& a {
				color: var(--color-text-primary);
			}

			& .router-link-active {

				color: var(--color-primary);
			}

		}
	}
}

aside {
	height: 100%;
	padding: 0.3rem 0rem;
}

.media-object {
	height: 100%;
	display: flex;

	& .media-text {
		padding-left: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: var(--color-text-primary);

		& .name {
			font-weight: 600;
		}

		& .status {
			font-weight: 600;
			color: greenyellow;
		}
	}
}

.avatar {
	height: 100%;
	border-radius: 100%;
	aspect-ratio: 1;
}
</style>