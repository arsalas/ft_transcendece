import { Socket } from 'socket.io-client';

import { PongGame } from './PongGame';
import { GameMode, PlayerType, Players } from '../../../interfaces';
import { ETypeGame } from '../interfaces/game';

export class PongPlayer extends PongGame {
  private playerLeftPressKey = this.handlePressKeyPlayerLeft.bind(this);
  private playerRightPressKey = this.handlePressKeyPlayerRight.bind(this);
  private playerLeftReleaseKey = this.handleReleaseKeyPlayerLeft.bind(this);
  private playerRightReleaseKey = this.handleReleaseKeyPlayerRight.bind(this);

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
    document.removeEventListener('keydown', this.playerRightPressKey);
    document.removeEventListener('keyup', this.playerLeftReleaseKey);
    document.removeEventListener('keyup', this.playerRightReleaseKey);
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
    this.rivalMove();

    this.renderCanvas();
    this.idAnimationFrame = window.requestAnimationFrame(this.tick.bind(this));
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
    document.addEventListener('keydown', this.playerRightPressKey);
    document.addEventListener('keyup', this.playerRightReleaseKey);
  }

  /**
   * Comprueba cuando el jugador de la derecha ha pulsado una tecla
   * @param e evento
   */
  public handlePressKeyPlayerRight(e: KeyboardEvent) {
    if (e.key == 'w') {
      this.playerRightMovement.isMovement = true;
      this.playerRightMovement.direction = 'up';
    }

    if (e.key == 's') {
      this.playerRightMovement.isMovement = true;
      this.playerRightMovement.direction = 'down';
    }
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

  /**
   * Comprueba cuando el jugador de la derecha ha soltado una tecla
   * @param e evento
   */
  public handleReleaseKeyPlayerRight(e: KeyboardEvent) {
    this.playerRightMovement.isMovement = false;
  }
}
