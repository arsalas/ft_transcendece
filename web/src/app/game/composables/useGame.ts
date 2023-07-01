import { ref } from 'vue';
import { PongGame } from '../classes';
import { GameFinish } from '../../../interfaces';

export const useGame = () => {
  const canvas = document.createElement('canvas');
  const isLoading = ref<boolean>(true);
  const isMuted = ref<boolean>(false);
  const isStart = ref<boolean>(false);
  const isFinish = ref<boolean>(false);
  const app = ref<HTMLDivElement>();
  const game = ref<PongGame>();
  const result = ref<GameFinish>();

  const mutedGame = () => {
    isMuted.value = true;
    game.value?.muted();
  };

  const unmutedGame = () => {
    isMuted.value = false;
    game.value?.unMuted();
  };

  const startGame = () => {
    isStart.value = true;
    game.value?.startGame();
  };

  const createCanvasDiv = () => {
    canvas.height = app.value!.clientHeight - 1;
    canvas.width = app.value!.clientWidth - 1;
    document.querySelector('#game')!.appendChild(canvas);
    // Activar listeners
    window.addEventListener('resize', handleResize);
  };

  // Evento de redimension de pantalla
  const handleResize = () => {
    game.value?.resizeWindows(app.value!.clientWidth, app.value!.clientHeight);
  };

  const destroyGame = () => {
    // Llamar a la funcion de destructor de clase para quitar los listeners
    game.value!.destructor();

    // Dejar de escuchar los eventos
    window.removeEventListener('resize', handleResize);
  };

  return {
    canvas,
    isLoading,
    isMuted,
    isStart,
    isFinish,
	result,
    app,
    game,
    mutedGame,
    unmutedGame,
    startGame,
    createCanvasDiv,
    handleResize,
    destroyGame,
  };
};
