<template>
	<header class="navbar">
		<div class="left">
			<div class="brand">
				<div class="text">CYBERP<i class="fa-solid fa-circle"></i>NG
				</div>
				<!-- <img src="../../../assets/pong logo.png" alt=""> -->
			</div>
			<nav>
				<ul>
					<li>


						<span class="icon-text text">
							<span class="icon">
								<i class="fa-solid fa-table-tennis-paddle-ball"></i>
							</span>
							<span>Play</span>
						</span>

					</li>
					<li>
						<router-link :to="{ name: 'chat' }">
							<span class="icon-text text">
								<span class="icon">
									<i class="fa-sharp fa-solid fa-comments"></i>
								</span>
								<span>Chats</span>
							</span>

						</router-link>
					</li>
					<li>


						<span class="icon-text text">
							<span class="icon">
								<i class="fa-solid fa-table"></i>
							</span>
							<span>Ladder</span>
						</span>

					</li>
					<li>
						<span class="icon-text text">
							<span class="icon">
								<i class="fa-solid fa-trophy"></i>
							</span>
							<span>Achivements</span>
						</span>

					</li>
					<li>
						<!-- <router-link :to="{ name: 'profile' }"> -->

						<span class="icon-text text">
							<span class="icon">
								<i class="fa-solid fa-user"></i>
							</span>
							<span>Profile</span>
						</span>


						<!-- </router-link> -->
					</li>
				</ul>
			</nav>
			<!-- </div>
		<aside class="right"> -->
			<!-- <div class="right"> -->

			<div class="media-object right">

				<Image class="avatar" :src="user.avatar!" :fallback="user.avatar42"/>
				<!-- <img class="avatar" :src="user.avatar || user.avatar42" alt=""> -->
				<div class="media-text">
					<div class="name text">
						{{ user.username || user.login }}
					</div>
					<div class="status">
						conectado
					</div>
				</div>
				<router-link :to="{ name: 'editProfile' }">
					<span class="icon text" style="font-size: 1rem; margin-left: 1rem;">
						<i class="fa-solid fa-gear"></i>
					</span>
				</router-link>
				<span @click="logout" class="icon text is-clickable" style="font-size: 1rem; margin-left: 1rem;">
					<i class="fa-solid fa-right-from-bracket"></i>
				</span>
			</div>
			<!-- </div> -->
			<!-- </aside> -->
		</div>
	</header>
</template>
<script lang='ts' setup>
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUserStore, useAuthStore } from '../../../stores';
import Image from './Image.vue';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const logout = () => {
	authStore.logOut();
	router.push({ name: 'signin' })
}

</script>
<style lang='scss' scoped>
.navbar {
	height: 59px;
	background-color: var(--bg-dark-0);
	display: flex;
	padding: 0rem 0rem;
	justify-content: space-between;
	position: sticky;
	top: 0;
	border-bottom: var(--border);
	z-index: 1;
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
	// width: 20rem;

}

.brand {
	height: 100%;
	display: flex;
	align-items: center;
	font-weight: bold;

	& .text {
		font-size: 1.5rem;

	}

	& i {
		padding: 0;
		margin: 0;
	}

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

			& .icon-text {
				font-size: 1.0rem;
				transition: 300ms;

				&:hover {
					color: var(--color-primary)
				}
			}

			& a {
				color: var(--color-text-primary);
			}

			& .router-link-active .icon-text {

				color: var(--color-primary)
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
	align-items: center;

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