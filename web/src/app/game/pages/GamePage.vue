<template>
	<div class="main-container">
		<div class="actions">
			<div class="brand">
				<div class="text">CYBERP<i class="fa-solid fa-circle"></i>NG
				</div>
			</div>
			<div class="action-buttons buttons">

				<button v-if="isMuted" @click="unmutedGame" class="button is-primary is-large is-outlined">
					<span class="icon is-small">
						<i class="fa-solid fa-volume-xmark"></i>
					</span>
				</button>
				
				<button v-if="!isMuted" @click="mutedGame" class="button is-primary is-large">
					<span class="icon is-small">
						<i class="fa-solid fa-volume-high"></i>
					</span>
				</button>
				<button v-if="!isStart" @click="startGame" class="button is-primary is-large">
					<span class="icon is-small">
						<i class="fa-solid fa-play"></i>
					</span>
				</button>
				<button v-if="isStart" @click="exitGame" class="button is-primary is-large">
					<span class="icon is-small">
						<i class="fa-solid fa-person-running"></i>
					</span>
				</button>

			</div>
		</div>
		<div class="game-container">
			<div id="game" ref="app"></div>
		</div>
	</div>
</template>
<script lang='ts' setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { PongGame } from '../helpers'
import { useRouter } from 'vue-router';

const router = useRouter();

const isMuted = ref<boolean>(false);
const isStart = ref<boolean>(false);
const app = ref<HTMLDivElement>()
const game = ref<PongGame>()
const canvas = document.createElement('canvas');

const mutedGame = () => {
	isMuted.value = true;
	game.value?.muted()
}

const unmutedGame = () => {
	isMuted.value = false;
	game.value?.unMuted()
}

const startGame = () => {
	isStart.value = true;
	game.value?.startGame();
}

const exitGame = () => {
	router.push({ name: 'home' })
}

onMounted(() => {

	console.log(getComputedStyle(document.documentElement)
		.getPropertyValue('--color-primary'))

	canvas.height = app.value!.clientHeight - 1;
	canvas.width = app.value!.clientWidth - 1;
	document.querySelector('#game')!.appendChild(canvas)

	game.value = new PongGame(canvas, canvas.width, canvas.height)

})

onUnmounted(() => {
	game.value?.destructor();
	delete game.value
})


</script>
<style lang='scss' scoped>
.main-container {
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.game-container {
	width: 100%;
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;

}

.brand div {
	font-size: 2rem;
}

.actions {
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 5rem;
	width: 100%;
	background-color: var(--bg-dark-0);
	border-bottom: var(--border);
}

#game {
	width: 80%;
	height: 80%;
	border: var(--border);
	border-radius: 20px;
	overflow: hidden;
	-webkit-box-shadow: 0px 0px 38px 5px rgba(var(--color-primary-rgb), 0.75);
	-moz-box-shadow: 0px 0px 38px 5px rgba(var(--color-primary-rgb), 0.75);
	box-shadow: 0px 0px 38px 5px rgba(var(--color-primary-rgb), 0.75);
}
</style>