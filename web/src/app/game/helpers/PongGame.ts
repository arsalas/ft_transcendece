import audioPaddle from '../../../assets/audio/pong1.mp3'
import audioPoint from '../../../assets/audio/pong_defeat.mp3'

const soundPadle = new Audio(audioPaddle)
const soundPoint = new Audio(audioPoint)


interface Vector {
	x: number;
	y: number;
}

interface Players {
	player: number;
	rival: number;
}

class AudioController {

	private traks: { [key: string]: HTMLAudioElement } = {}
	private isMuted = false;

	addSound(name: string, audio: HTMLAudioElement) {
		this.traks[name] = audio;
	}

	async play(name: string) {
		try {
			if (this.isMuted) return;
			await this.traks[name].play();
		} catch (error) {

		}
	};

	muted() {
		this.isMuted = true
	};

	unMuted() {
		this.isMuted = false

	}
}

type AudioPong = "paddle" | "point"

export class PongGame {


	private idAnimationFrame: number;
	// Audio
	private readonly audio = new AudioController;

	// Contexto canvas
	private readonly canvas: HTMLCanvasElement;
	private readonly context: CanvasRenderingContext2D;

	// Dimesiones juego
	private readonly width: number;
	private readonly height: number;

	// Paddle
	private readonly margins = 10;
	private readonly paddleWidth = 20
	private readonly paddleHeight = 50
	private paddlePosition: Players;
	private paddleDiff = 25

	private ball: Vector
	private readonly ballRadius = 8;
	private score: Players = { player: 0, rival: 0 }

	private speed: Vector = { x: 5, y: 5 }
	private computerSpeed = 5;

	private trayectory: Vector

	constructor(
		canvas: HTMLCanvasElement,
		width: number,
		height: number
	) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d')!;
		this.width = width;
		this.height = height
		this.ball = {
			x: width / 2,
			y: height / 2
		};
		this.trayectory = { x: 0, y: 0 }
		this.paddlePosition = { player: height / 2, rival: height / 2 }
		this.audio.addSound('paddle', soundPadle);
		this.audio.addSound('point', soundPoint);
		this.renderCanvas()
	}

	destructor() {
		window.cancelAnimationFrame(this.idAnimationFrame);
	}



	private renderField() {
		// Color del canvas
		this.context.fillStyle = 'black';
		//Creamos el fondo
		this.context.fillRect(0, 0, this.width, this.height)
	}

	private renderPaddle(color: string, x: number, y: number) {
		this.context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
		this.context.fillRect(x - 2, y - 2, this.paddleWidth + 4, this.paddleHeight + 4);
		this.context.fillStyle = color;
		this.context.fillRect(x, y, this.paddleWidth, this.paddleHeight);
	}

	private renderRival() {
		this.renderPaddle('white', this.width - this.margins - this.paddleWidth, this.paddlePosition.rival);
	}

	private renderPlayer() {
		// getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
		this.renderPaddle('white', this.margins, this.paddlePosition.player);
	}

	private renderDashLine() {
		for (let index = 1; index < 5; index++) {
			// Linea discontinua del centroDashed center
			this.context.beginPath();
			// Cantidad de espacios en la linea
			this.context.setLineDash([10])
			this.context.moveTo(this.width / 2 + index - 2, 0)
			this.context.lineTo(this.width / 2 + index - 2, this.height)
			// Color de la linea
			this.context.strokeStyle = 'white';
			this.context.stroke();
		}

	}

	private renderBall() {
		this.context.beginPath();
		this.context.arc(this.ball.x, this.ball.y, this.ballRadius, 2 * Math.PI, 0)
		this.context.fillStyle = "white";
		// Pinta en pantalla
		this.context.fill();
	}

	private renderScore() {
		this.context.font = '50px Orbitron'
		this.context.fillText(this.score.player.toString(), this.width / 2 - 50 - 25, 50)
		this.context.fillText(this.score.rival.toString(), this.width / 2 + 50, 50)
	}

	private renderCanvas() {
		this.renderField();
		this.renderPlayer();
		this.renderRival();
		this.renderDashLine();
		this.renderScore();
		this.renderBall();
	}


	private ballMove() {
		this.ball.x += this.speed.x;
		this.ball.y += this.speed.y
	}

	private ballBoundaries() {
		// Limites del campo
		if (this.ball.y < 0 && this.speed.y < 0) {
			this.speed.y = -this.speed.y
		}
		if (this.ball.y > this.height && this.speed.y > 0) {
			this.speed.y = -this.speed.y
		}

		// Choca con el rival
		if (this.ball.x > this.width - this.paddleDiff) {
			if (this.ball.y > this.paddlePosition.rival && this.ball.y < this.paddlePosition.rival + this.paddleHeight) {
				this.audio.play('paddle')

				this.speed.x = -this.speed.x;
				this.trayectory.y = this.ball.y - (this.paddlePosition.rival + this.paddleDiff)
				this.speed.y = this.trayectory.y * 0.3
			} else if (this.ball.x > this.width) {
				this.audio.play('point')
				this.ballReset();
				this.score.player++;
			}
		}


		// Choca con el jugador
		if (this.ball.x < this.paddleDiff) {
			if (this.ball.y > this.paddlePosition.player && this.ball.y < this.paddlePosition.player + this.paddleHeight) {
				this.audio.play('paddle')
				this.speed.x = -this.speed.x;
				this.trayectory.y = this.ball.y - (this.paddlePosition.player + this.paddleDiff)
				this.speed.y = this.trayectory.y * 0.3

			} else if (this.ball.x < 0) {
				this.audio.play('point')
				this.ballReset();
				this.score.rival++;
			}
		}
	}

	private paddleIA() {
		if (this.paddlePosition.rival + this.paddleDiff > Math.floor(this.ball.y) + 5 || this.paddlePosition.rival + this.paddleDiff < Math.floor(this.ball.y) - 5) {
			if (this.paddlePosition.rival + this.paddleDiff < this.ball.y) {
				this.paddlePosition.rival += this.computerSpeed
			} else {
				this.paddlePosition.rival -= this.computerSpeed;
			}
		}

	}

	private ballReset() {
		this.ball.x = this.width / 2;
		this.ball.y = this.height / 2;
	}

	private tick() {
		this.ballBoundaries();
		this.renderCanvas();
		this.ballMove();
		this.paddleIA();
		// Llama a la funcion animate en cada frame
		this.idAnimationFrame = window.requestAnimationFrame(this.tick.bind(this))
	}

	public startGame() {
		this.tick()
		this.score.player = 0;
		this.score.rival = 0;

		this.canvas.addEventListener('mousemove', this.movePaddle.bind(this))
	}

	public muted() {
		this.audio.muted()
	}

	public unMuted() {
		this.audio.unMuted();
	}

	public movePaddle(e: MouseEvent) {
		this.paddlePosition.player = e.clientY - 96;
		if (this.paddlePosition.player < this.paddleDiff) {
			this.paddlePosition.player = 0
		}
		if (this.paddlePosition.player > this.height - this.paddleHeight) {
			this.paddlePosition.player = this.height - this.paddleHeight;
		}
	}


}
