import audioPaddle from '../../../assets/audio/pong1.mp3';
import audioPoint from '../../../assets/audio/pong_defeat.mp3';

import { AudioController } from './AudioController';
import { GameMode, PlayerMovement, Players, Vector } from '../../../interfaces';

const soundPadle = new Audio(audioPaddle);
const soundPoint = new Audio(audioPoint);

export class PongGame {
  protected idAnimationFrame: number = 0;

  protected readonly gameMode: GameMode;

  // Audio
  private readonly audio = new AudioController();

  // Contexto canvas
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  // Dimesiones juego
  protected width: number = 0;
  protected height: number = 0;

  // Paddle
  protected margins = 0.03;
  protected paddleWidth = 0.02;
  protected paddleHeight = 0.12;
  protected paddleDiff = 0.03;
  protected paddlePosition: Players;

  // Ball
  protected ball: Vector;
  protected ballRadius = 0.01;
  protected score: Players = { left: 0, right: 0 };

  // Speed
  protected speed: Vector = { x: 5, y: 5 };
  protected speedBase = 0.005;
  protected playerRightSpeed = 0.01;
  protected playerLeftSpeed = 0.01;
  protected trayectory: Vector;

  // Moviments
  protected playerLeftMovement: PlayerMovement = {
    isMovement: false,
    direction: 'down',
  };
  protected playerRightMovement: PlayerMovement = {
    isMovement: false,
    direction: 'down',
  };

  protected readonly limitPoints = 10;

  protected isPaused = false;
  protected isOver = false;

  private screen = 4 / 3;

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    gameMode: GameMode,
  ) {
    this.gameMode = gameMode;
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.calcDimensionsScreen(width, height);
    this.ball = {
      x: this.width / 2,
      y: this.height / 2,
    };
    this.trayectory = { x: 0, y: 0 };
    this.paddlePosition = { left: this.height / 2, right: this.height / 2 };
    this.audio.addSound('paddle', soundPadle);
    this.audio.addSound('point', soundPoint);
    this.renderCanvas();
  }

  destructor(): void {}

  /**
   * Calcula las dimensiones de la pantalla para cumplir unas proporciones
   * @param width
   * @param height
   */
  private calcDimensionsScreen(width: number, height: number) {
    if (width > height) {
      if (height * this.screen > width) {
        this.width = width;
        this.height = width / this.screen;
      } else {
        this.height = height;
        this.width = height * this.screen;
      }
    } else {
      this.width = width;
      this.height = width / this.screen;
    }
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.calcDimensionObjects();
  }

  /**
   * Calcula las dimensiones de los objectos en funcion del width
   */
  private calcDimensionObjects() {
    this.margins = this.margins * this.width;
    this.paddleWidth = this.paddleWidth * this.width;
    this.paddleHeight = this.paddleHeight * this.width;
    this.paddleDiff = this.paddleDiff * this.width;
    this.ballRadius = this.ballRadius * this.width;
    this.speed = {
      x: this.width * this.speedBase,
      y: this.width * this.speedBase,
    };
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
      this.paddlePosition.right,
    );
  }

  /**
   * Renderiza al jugador
   */
  private renderPlayer() {
    // getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
    this.renderPaddle('white', this.margins, this.paddlePosition.left);
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
      this.score.left.toString(),
      0.2 * this.width,
      0.1 * this.width,
    );
    this.context.fillText(
      this.score.right.toString(),
      0.7 * this.width,
      0.1 * this.width,
    );
  }

  /**
   * Renderiza todos los elementos del canvas
   */
  protected renderCanvas() {
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
  protected ballMove() {
    this.ball.x += this.speed.x;
    this.ball.y += this.speed.y;
  }

  /**
   * Controla el movimiento del jugador
   */
  protected playerMove() {
    if (!this.playerLeftMovement.isMovement) return;
    if (this.playerLeftMovement.direction == 'up')
      this.paddlePosition.left -= this.playerLeftSpeed * this.width;
    if (this.playerLeftMovement.direction == 'down')
      this.paddlePosition.left += this.playerLeftSpeed * this.width;
    if (this.paddlePosition.left < 0) this.paddlePosition.left = 0;

    if (this.paddlePosition.left > this.height - this.paddleHeight)
      this.paddlePosition.left = this.height - this.paddleHeight;
  }

  /**
   * Controla el movimiento del rival
   */
  protected rivalMove() {
    if (!this.playerRightMovement.isMovement) return;
    if (this.playerRightMovement.direction == 'up')
      this.paddlePosition.right -= this.playerRightSpeed * this.width;
    if (this.playerRightMovement.direction == 'down')
      this.paddlePosition.right += this.playerRightSpeed * this.width;
    if (this.paddlePosition.right < 0) this.paddlePosition.right = 0;

    if (this.paddlePosition.right > this.height - this.paddleHeight)
      this.paddlePosition.right = this.height - this.paddleHeight;
  }

  /**
   * Comprueba las colisiones con los limites de la pista
   */
  protected fieldBoundarie() {
    if (this.ball.y < 0 && this.speed.y < 0) this.speed.y = -this.speed.y;
    if (this.ball.y > this.height && this.speed.y > 0)
      this.speed.y = -this.speed.y;
  }

  /**
   * Comprueba las colisiones con la pala del rival
   */
  protected rivalBoundarie() {
    if (this.ball.x > this.width - this.paddleDiff - this.paddleWidth) {
      if (
        this.ball.y > this.paddlePosition.right &&
        this.ball.y < this.paddlePosition.right + this.paddleHeight
      ) {
        this.audio.play('paddle');
        this.speed.x = -this.speed.x;
        const paddleCenter = this.paddlePosition.right + this.paddleHeight / 2;
        const d = paddleCenter - this.ball.y;
        this.speed.y += d * -0.1;
        // this.trayectory.y =
        //   this.ball.y - (this.paddlePosition.right + this.paddleDiff);
        // this.speed.y = this.trayectory.y * 0.3;
      } else if (this.ball.x >= this.width - this.paddleDiff / 2) {
        this.audio.play('point');
        this.score.left++;
        this.ballReset();
      }
    }
  }

  /**
   * Comprueba las colisiones con la pala del jugador
   */
  protected playerBoundarie() {
    if (this.ball.x < this.paddleDiff + this.paddleWidth) {
      if (
        this.ball.y > this.paddlePosition.left &&
        this.ball.y < this.paddlePosition.left + this.paddleHeight
      ) {
        this.audio.play('paddle');
        this.speed.x = -this.speed.x;
        // this.trayectory.y =
        //   this.ball.y - (this.paddlePosition.left + this.paddleDiff);
        // this.speed.y = this.trayectory.y * 0.2;
        const paddleCenter = this.paddlePosition.left + this.paddleHeight / 2;
        const d = paddleCenter - this.ball.y;
        this.speed.y += d * -0.1;
      } else if (this.ball.x <= this.paddleDiff / 2) {
        this.audio.play('point');
        this.score.right++;
        this.ballReset();
      }
    }
  }

  /**
   * Comprueba las colisiones de la pelota
   */
  protected ballBoundaries() {
    this.fieldBoundarie();
    this.rivalBoundarie();
    this.playerBoundarie();
  }

  /**
   * Resetea la posicion de la pelota en el medio de la pista
   */
  private ballReset() {
    if (
      this.score.left == this.limitPoints ||
      this.score.right == this.limitPoints
    ) {
      this.isOver = true;
    }
    this.ball.x = this.width / 2;
    this.ball.y = this.height / 2;
    if (this.speed.x < 0) this.speed.x = -this.speedBase * this.width;
    else this.speed.x = this.speedBase * this.width;
    if (this.speed.y < 0) this.speed.y = -this.speedBase * this.width;
    else this.speed.y = this.speedBase * this.width;
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
   * Recalcula las dimensiones de la pantalla
   * @param width
   * @param height
   */
  public resizeWindows(width: number, height: number) {
    this.calcDimensionsScreen(width, height);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.renderCanvas();
  }

  public startGame(): void {}

  public gameExit(userExit: string): void {}
}
