import { Socket } from 'socket.io-client';

import { PongGame } from './PongGame';
import { GameMode, PlayerType, Players } from '../../../interfaces';

export class PongOnline extends PongGame {
  private playerLeftPressKey = this.handlePressKeyPlayerLeft.bind(this);
  private playerRightPressKey = this.handlePressKeyPlayerRight.bind(this);
  private playerLeftReleaseKey = this.handleReleaseKeyPlayerLeft.bind(this);
  private playerRightReleaseKey = this.handleReleaseKeyPlayerRight.bind(this);

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    gameMode: GameMode,
    private readonly playerSide: PlayerType,
    private readonly socket: Socket,
    private readonly gameId: string,
    private readonly playerNames: { left: string; right: string },
  ) {
    super(canvas, width, height, gameMode);

    this.listenSockets();
  }

  destructor(): void {
    window.cancelAnimationFrame(this.idAnimationFrame);
    document.removeEventListener('keydown', this.playerLeftPressKey);
    document.removeEventListener('keydown', this.playerRightPressKey);
    document.removeEventListener('keyup', this.playerLeftReleaseKey);
    document.removeEventListener('keyup', this.playerRightReleaseKey);
  }

  private listenSockets() {
    this.socket.on('playerLeft-move-up', () => {
      this.playerLeftMovement.isMovement = true;
      this.playerLeftMovement.direction = 'up';
    });
    this.socket.on('playerLeft-move-down', () => {
      this.playerLeftMovement.isMovement = true;
      this.playerLeftMovement.direction = 'down';
    });
    this.socket.on('playerLeft-stop', () => {
      this.playerLeftMovement.isMovement = false;
    });
    this.socket.on('playerRight-move-up', () => {
      this.playerRightMovement.isMovement = true;
      this.playerRightMovement.direction = 'up';
    });
    this.socket.on('playerRight-move-down', () => {
      this.playerRightMovement.isMovement = true;
      this.playerRightMovement.direction = 'down';
    });
    this.socket.on('playerRight-stop', () => {
      this.playerRightMovement.isMovement = false;
    });
    console.log('LISTEN');
    this.socket.on('update-game', (gameData) => {
      this.paddlePosition.left = (gameData.playerLeft * this.height) / 100;
      this.paddlePosition.right = (gameData.playerRight * this.height) / 100;
      this.ball.x = (gameData.ball.x * this.width) / 100;
      this.ball.y = (gameData.ball.y * this.height) / 100;
      this.score.left = gameData.score.playerLeft;
      this.score.right = gameData.score.playerRight;
    });
  }

  public gameOver() {
    if (this.playerSide == 'left')
      this.socket.emit('finish-game', {
        gameId: this.gameId,
        scores: [
          {
            userId: this.playerNames.left,
            score: this.score.left,
            isWinner: this.score.left == 10 ? true : false,
          },
          {
            userId: this.playerNames.right,
            score: this.score.right,
            isWinner: this.score.right == 10 ? true : false,
          },
        ],
      });
  }

  public gameExit(userExit: string) {
    this.socket.emit('finish-game', {
      gameId: this.gameId,
      scores: [
        {
          userId: this.playerNames.left,
          score: this.score.left,
          isWinner: this.playerNames.left == userExit ? false : true,
        },
        {
          userId: this.playerNames.right,
          score: this.score.right,
          isWinner: this.playerNames.right == userExit ? false : true,
        },
      ],
    });
  }

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
    if (this.playerSide == 'left') {
      this.ballBoundaries();
      this.ballMove();
      this.playerMove();
      this.rivalMove();
      const data = {
        gameId: this.gameId,
        playerLeft: (this.paddlePosition.left * 100) / this.height,
        playerRight: (this.paddlePosition.right * 100) / this.height,
        ball: {
          x: (this.ball.x * 100) / this.width,
          y: (this.ball.y * 100) / this.height,
        },
        score: {
          playerLeft: this.score.left,
          playerRight: this.score.right,
        },
      };
      this.socket.emit('update-game', data);
    }
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

    if (this.playerSide == 'left') {
      document.addEventListener('keydown', this.playerLeftPressKey);
      document.addEventListener('keyup', this.playerLeftReleaseKey);
    }
    if (this.playerSide == 'right') {
      document.addEventListener('keydown', this.playerRightPressKey);
      document.addEventListener('keyup', this.playerRightReleaseKey);
    }
  }

  /**
   * Comprueba cuando el jugador de la derecha ha pulsado una tecla
   * @param e evento
   */
  public handlePressKeyPlayerRight(e: KeyboardEvent) {
    if (e.key == 'w') this.socket.emit('playerRight-move-up', this.gameId);

    if (e.key == 's') this.socket.emit('playerRight-move-down', this.gameId);
  }

  /**
   * Comprueba cuando el jugador de la izquierda ha pulsado una tecla
   * @param e evento
   */
  public handlePressKeyPlayerLeft(e: KeyboardEvent) {
    if (e.key == 'w') this.socket.emit('playerLeft-move-up', this.gameId);

    if (e.key == 's') this.socket.emit('playerLeft-move-down', this.gameId);
  }

  /**
   * Comprueba cuando el jugador de la izquierda ha soltado una tecla
   * @param e evento
   */
  public handleReleaseKeyPlayerLeft(e: KeyboardEvent) {
    this.socket.emit('playerLeft-stop', this.gameId);
  }

  /**
   * Comprueba cuando el jugador de la derecha ha soltado una tecla
   * @param e evento
   */
  public handleReleaseKeyPlayerRight(e: KeyboardEvent) {
    this.socket.emit('playerRight-stop', this.gameId);
  }
}
