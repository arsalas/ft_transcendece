import { Socket } from 'socket.io-client';

import { PongGame } from './PongGame';
import { GameMode, PlayerType, Players } from '../../../interfaces';
import { ETypeGame } from '../interfaces/game';

export class PongCPU extends PongGame {
  private playerLeftPressKey = this.handlePressKeyPlayerLeft.bind(this);
  private playerLeftReleaseKey = this.handleReleaseKeyPlayerLeft.bind(this);

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    gameMode: GameMode,
    type: ETypeGame,
  ) {
    super(canvas, width, height, gameMode, type);
  }

  destructor(): void {
    window.cancelAnimationFrame(this.idAnimationFrame);
    document.removeEventListener('keydown', this.playerLeftPressKey);
    document.removeEventListener('keyup', this.playerLeftReleaseKey);
  }

  public gameOver() {}

  public gameExit() {}

  /**
   * Evento que se ejecuta en cada frame
   */
  private tick() {
    if (this.isPaused) return;
    if (this.isOver) {
      this.gameOver();
      this.isPaused = true;
      return;
    }

    this.ballBoundaries();
    this.ballMove();
    this.playerMove();
    this.paddleIA();
    this.renderCanvas();
    this.idAnimationFrame = window.requestAnimationFrame(this.tick.bind(this));
  }

  /**
   * Ejecuta la IA para las partidas PVE
   */
  private paddleIA() {
    if (
      this.paddlePosition.right + this.paddleDiff >
        Math.floor(this.ball.y) + 5 ||
      this.paddlePosition.right + this.paddleDiff < Math.floor(this.ball.y) - 5
    ) {
      if (this.paddlePosition.right + this.paddleDiff < this.ball.y) {
        this.paddlePosition.right += this.playerRightSpeed * this.width;
      } else {
        this.paddlePosition.right -= this.playerRightSpeed * this.width;
      }
    }
  }

  /**
   * Inicia la partida
   */
  public startGame() {
    this.tick();
    this.score.left = 0;
    this.score.right = 0;

    document.addEventListener('keydown', this.playerLeftPressKey);
    document.addEventListener('keyup', this.playerLeftReleaseKey);
  }

  /**
   * Comprueba cuando el jugador de la izquierda ha pulsado una tecla
   * @param e evento
   */
  public handlePressKeyPlayerLeft(e: KeyboardEvent) {
    if (e.key == 'w') {
      this.playerLeftMovement.isMovement = true;
      this.playerLeftMovement.direction = 'up';
    }

    if (e.key == 's') {
      this.playerLeftMovement.isMovement = true;
      this.playerLeftMovement.direction = 'down';
    }
  }

  /**
   * Comprueba cuando el jugador de la izquierda ha soltado una tecla
   * @param e evento
   */
  public handleReleaseKeyPlayerLeft(e: KeyboardEvent) {
    this.playerLeftMovement.isMovement = false;
  }
}
