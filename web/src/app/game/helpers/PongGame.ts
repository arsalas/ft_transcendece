import { Router } from 'vue-router';
import audioPaddle from '../../../assets/audio/pong1.mp3';
import audioPoint from '../../../assets/audio/pong_defeat.mp3';

const soundPadle = new Audio(audioPaddle);
const soundPoint = new Audio(audioPoint);

interface Vector {
  x: number;
  y: number;
}

interface Players {
  player: number;
  rival: number;
}

class AudioController {
  private traks: { [key: string]: HTMLAudioElement } = {};
  private isMuted = false;

  addSound(name: string, audio: HTMLAudioElement) {
    this.traks[name] = audio;
  }

  async play(name: string) {
    try {
      if (this.isMuted) return;
      await this.traks[name].play();
    } catch (error) { }
  }

  muted() {
    this.isMuted = true;
  }

  unMuted() {
    this.isMuted = false;
  }
}

interface PlayerMovement {
  isMovement: boolean;
  direction: 'up' | 'down';
}

type GameMode = 'pvp' | 'pve' | 'online';
type AudioPong = 'paddle' | 'point';

export class PongGame {
  private idAnimationFrame: number = 0;

  private playerPressKey = this.handlePressKeyPlayer.bind(this);
  private playerReleaseKey = this.handleReleaseKeyPlayer.bind(this);

  private rivalPressKey = this.handlePressKeyRival.bind(this);
  private rivalReleaseKey = this.handleReleaseKeyRival.bind(this);
  // private playerEventMouse = this.movePaddleMouse.bind(this);

  private readonly gameMode: GameMode;

  // Audio
  private readonly audio = new AudioController();

  // Contexto canvas
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  // Dimesiones juego
  private width: number = 0;
  private height: number = 0;

  // Paddle
  private readonly margins = 10;
  private readonly paddleWidth = 20;
  private readonly paddleHeight = 100;
  private paddlePosition: Players;
  private paddleDiff = 25;

  private ball: Vector;
  private readonly ballRadius = 8;
  private score: Players = { player: 0, rival: 0 };

  private speed: Vector = { x: 5, y: 5 };
  private rivalSpeed = 10;
  private playerSpeed = 10;

  private trayectory: Vector;

  private playerMovement: PlayerMovement = {
    isMovement: false,
    direction: 'down',
  };
  private rivalMovement: PlayerMovement = {
    isMovement: false,
    direction: 'down',
  };

  private readonly limitPoints = 10;

  private isPaused = false;

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    gameMode: GameMode,
    private router: Router,
  ) {
    this.gameMode = gameMode;
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.calcDimensionsScreen(width, height)
    this.ball = {
      x: width / 2,
      y: height / 2,
    };
    this.trayectory = { x: 0, y: 0 };
    this.paddlePosition = { player: height / 2, rival: height / 2 };
    this.audio.addSound('paddle', soundPadle);
    this.audio.addSound('point', soundPoint);
    this.renderCanvas();
  }

  destructor() {
    window.cancelAnimationFrame(this.idAnimationFrame);
    document.removeEventListener('keydown', this.playerPressKey);
    document.removeEventListener('keyup', this.playerReleaseKey);
    if (this.gameMode == 'pvp') {
      document.removeEventListener('keydown', this.rivalPressKey);
      document.removeEventListener('keyup', this.rivalReleaseKey);
    }
  }

  private calcDimensionsScreen(width: number, height: number) {
    console.log('calc')
    // DIMENSIONES 16/9
    if (width > height) {
      this.height = height;
      this.width = height * (16 / 9);
    } else {
      this.width = width;
      this.height = width * (16 / 9)
    }


  }

  /**
   * Renderiza la pista de juego
   */
  private renderField() {
    // Color del canvas
    this.context.fillStyle = 'black';
    //Creamos el fondo
    this.context.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Renderiza una pala
   * @param color color
   * @param x posicion x
   * @param y posicion y
   */
  private renderPaddle(color: string, x: number, y: number) {
    this.context.shadowColor = getComputedStyle(
      document.documentElement,
    ).getPropertyValue('--color-primary');
    this.context.shadowBlur = 20;
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;

    this.context.fillStyle = getComputedStyle(
      document.documentElement,
    ).getPropertyValue('--color-primary');
    this.context.fillRect(
      x - 2,
      y - 2,
      this.paddleWidth + 4,
      this.paddleHeight + 4,
    );
    this.context.fillStyle = color;
    this.context.fillRect(x, y, this.paddleWidth, this.paddleHeight);
  }

  /**
   * Renderiza al rival
   */
  private renderRival() {
    this.renderPaddle(
      'white',
      this.width - this.margins - this.paddleWidth,
      this.paddlePosition.rival,
    );
  }

  /**
   * Renderiza al jugador
   */
  private renderPlayer() {
    // getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
    this.renderPaddle('white', this.margins, this.paddlePosition.player);
  }

  /**
   * Renderiza la linea divisoria
   */
  private renderDashLine() {
    for (let index = 1; index < 5; index++) {
      // Linea discontinua del centroDashed center
      this.context.beginPath();
      // Cantidad de espacios en la linea
      this.context.setLineDash([10]);
      this.context.moveTo(this.width / 2 + index - 2, 0);
      this.context.lineTo(this.width / 2 + index - 2, this.height);
      // Color de la linea
      this.context.strokeStyle = 'white';
      this.context.stroke();
    }
  }

  /**
   * Renderiza la pelota
   */
  private renderBall() {
    this.context.beginPath();
    this.context.arc(
      this.ball.x,
      this.ball.y,
      this.ballRadius + 2,
      2 * Math.PI,
      0,
    );
    this.context.fillStyle = getComputedStyle(
      document.documentElement,
    ).getPropertyValue('--color-primary');
    this.context.fill();

    this.context.beginPath();
    this.context.arc(this.ball.x, this.ball.y, this.ballRadius, 2 * Math.PI, 0);
    this.context.fillStyle = 'white';
    // Pinta en pantalla
    this.context.fill();
  }

  /**
   * Renderiza el marcador
   */
  private renderScore() {
    this.context.font = `${0.1 * this.width}px Orbitron`;
    this.context.fillText(
      this.score.player.toString(),
      0.2 * this.width,
      0.1 * this.width,
    );
    this.context.fillText(
      this.score.rival.toString(),
      0.7 * this.width,
      0.1 * this.width,
    );
  }

  /**
   * Renderiza todos los elementos del canvas
   */
  private renderCanvas() {
    this.renderField();
    this.renderPlayer();
    this.renderRival();
    this.renderDashLine();
    this.renderScore();
    this.renderBall();
  }

  /**
   * Hace que la pelota tenga movimiento
   */
  private ballMove() {
    this.ball.x += this.speed.x;
    this.ball.y += this.speed.y;
  }

  /**
   * Controla el movimiento del jugador
   */
  private playerMove() {
    if (!this.playerMovement.isMovement) return;
    if (this.playerMovement.direction == 'up')
      this.paddlePosition.player -= this.playerSpeed;
    if (this.playerMovement.direction == 'down')
      this.paddlePosition.player += this.playerSpeed;
    if (this.paddlePosition.player < 0) this.paddlePosition.player = 0;

    if (this.paddlePosition.player > this.height - this.paddleHeight)
      this.paddlePosition.player = this.height - this.paddleHeight;
  }

  /**
   * Controla el movimiento del rival
   */
  private rivalMove() {
    if (!this.rivalMovement.isMovement) return;
    if (this.rivalMovement.direction == 'up')
      this.paddlePosition.rival -= this.rivalSpeed;
    if (this.rivalMovement.direction == 'down')
      this.paddlePosition.rival += this.rivalSpeed;
    if (this.paddlePosition.rival < 0) this.paddlePosition.rival = 0;

    if (this.paddlePosition.rival > this.height - this.paddleHeight)
      this.paddlePosition.rival = this.height - this.paddleHeight;
  }

  /**
   * Comprueba las colisiones con los limites de la pista
   */
  private fieldBoundarie() {
    if (this.ball.y < 0 && this.speed.y < 0) this.speed.y = -this.speed.y;
    if (this.ball.y > this.height && this.speed.y > 0)
      this.speed.y = -this.speed.y;
  }

  /**
   * Comprueba las colisiones con la pala del rival
   */
  private rivalBoundarie() {
    if (this.ball.x > this.width - this.paddleDiff) {
      if (
        this.ball.y > this.paddlePosition.rival &&
        this.ball.y < this.paddlePosition.rival + this.paddleHeight
      ) {
        this.audio.play('paddle');

        this.speed.x = -this.speed.x;
        this.trayectory.y =
          this.ball.y - (this.paddlePosition.rival + this.paddleDiff);
        this.speed.y = this.trayectory.y * 0.3;
      } else if (this.ball.x >= this.width - this.paddleDiff / 2) {
        this.audio.play('point');
        this.score.player++;
        this.ballReset();
      }
    }
  }

  /**
   * Comprueba las colisiones con la pala del jugador
   */
  private playerBoundarie() {
    if (this.ball.x < this.paddleDiff) {
      if (
        this.ball.y > this.paddlePosition.player &&
        this.ball.y < this.paddlePosition.player + this.paddleHeight
      ) {
        this.audio.play('paddle');
        this.speed.x = -this.speed.x;
        this.trayectory.y =
          this.ball.y - (this.paddlePosition.player + this.paddleDiff);
        this.speed.y = this.trayectory.y * 0.3;
      } else if (this.ball.x <= this.paddleDiff / 2) {
        this.audio.play('point');
        this.score.rival++;
        this.ballReset();
      }
    }
  }

  /**
   * Comprueba las colisiones de la pelota
   */
  private ballBoundaries() {
    this.fieldBoundarie();
    this.rivalBoundarie();
    this.playerBoundarie();
  }

  /**
   * Ejecuta la IA para las partidas PVE
   */
  private paddleIA() {
    if (
      this.paddlePosition.rival + this.paddleDiff >
      Math.floor(this.ball.y) + 5 ||
      this.paddlePosition.rival + this.paddleDiff < Math.floor(this.ball.y) - 5
    ) {
      if (this.paddlePosition.rival + this.paddleDiff < this.ball.y) {
        this.paddlePosition.rival += this.rivalSpeed;
      } else {
        this.paddlePosition.rival -= this.rivalSpeed;
      }
    }
  }

  /**
   * Resetea la posicion de la pelota en el medio de la pista
   */
  private ballReset() {
    if (
      this.score.player == this.limitPoints ||
      this.score.rival == this.limitPoints
    )
      // this.router.push({ name: 'home' });
      this.isPaused = true;

    this.ball.x = this.width / 2;
    this.ball.y = this.height / 2;
    if (this.speed.x < 0) this.speed.x = -5;
    else this.speed.x = 5;
    if (this.speed.y < 0) this.speed.y = -5;
    else this.speed.y = 5;
  }

  private tick() {
    if (this.isPaused) return;
    this.ballBoundaries();
    this.renderCanvas();
    this.ballMove();
    this.playerMove();
    if (this.gameMode == 'pvp') this.rivalMove();
    if (this.gameMode == 'pve') this.paddleIA();
    // Llama a la funcion animate en cada frame
    this.idAnimationFrame = window.requestAnimationFrame(this.tick.bind(this));
  }

  /**
   * Inicia la partida
   */
  public startGame() {
    this.tick();
    this.score.player = 0;
    this.score.rival = 0;

    // this.canvas.addEventListener('mousemove', this.movePaddleMouse.bind(this))
    document.addEventListener('keydown', this.playerPressKey);
    document.addEventListener('keyup', this.playerReleaseKey);
    if (this.gameMode == 'pvp') {
      document.addEventListener('keydown', this.rivalPressKey);
      document.addEventListener('keyup', this.rivalReleaseKey);
    }
  }

  /**
   * Quita el sonido del juego
   */
  public muted() {
    this.audio.muted();
  }

  /**
   * Restablece el sonido del juego
   */
  public unMuted() {
    this.audio.unMuted();
  }

  /**
   * Comprueba cuando el jugador ha pulsado una tecla
   * @param e evento
   */
  public handlePressKeyPlayer(e: KeyboardEvent) {
    if (e.key == 'w') {
      this.playerMovement.isMovement = true;
      this.playerMovement.direction = 'up';
    }
    if (e.key == 's') {
      this.playerMovement.isMovement = true;
      this.playerMovement.direction = 'down';
    }
  }

  /**
   * Comprueba cuando el jugador ha soltado una tecla
   * @param e evento
   */
  public handleReleaseKeyPlayer(e: KeyboardEvent) {
    this.playerMovement.isMovement = false;
  }

  /**
   * Comprueba cuando el rival ha pulsado una tecla
   * @param e evento
   */
  public handlePressKeyRival(e: KeyboardEvent) {
    if (e.key == 'ArrowUp') {
      this.rivalMovement.isMovement = true;
      this.rivalMovement.direction = 'up';
    }
    if (e.key == 'ArrowDown') {
      this.rivalMovement.isMovement = true;
      this.rivalMovement.direction = 'down';
    }
  }

  /**
   * Comprueba cuando el rival ha soltado una tecla
   * @param e evento
   */
  public handleReleaseKeyRival(e: KeyboardEvent) {
    this.rivalMovement.isMovement = false;
  }

  /**
   * Mueve al jugador con el mouse
   * @param e evento
   */
  public movePaddleMouse(e: MouseEvent) {
    this.paddlePosition.player = e.clientY - 96;
    if (this.paddlePosition.player < this.paddleDiff)
      this.paddlePosition.player = 0;

    if (this.paddlePosition.player > this.height - this.paddleHeight)
      this.paddlePosition.player = this.height - this.paddleHeight;
  }

  public resizeWindows(width: number, height: number) {
    this.calcDimensionsScreen(width, height)
    console.log(this.width, this.height);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.renderCanvas();
  }
}
