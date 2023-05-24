<template>
  <div id="game"></div>
</template>
<script lang="ts" setup>
import { onMounted, ref, render } from 'vue';

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d')!;
const width = 500;
const height = 700;

//paddle
const paddleWidth = 50;
const paddleHeight = 20;
let paddleComputerX = 225;
let paddlePlayerX = 225;
let paddleDiff = 25;
let paddleContact = false;

//bal
let ballX = width / 2;
let ballY = height / 2;
let ballRadius = 5;

// score
let playerScore = 0;
let computerScore = 0;

// Speed
let speedY = 2;
let speedX = 2;
let computerSpeed = 5;

let trajectoryX;

let playerMoved = false;

onMounted(() => {
  startGame();
});

const createCanvas = () => {
  // Crea el canvas
  canvas.height = height;
  canvas.width = width;
  document.querySelector('#game')!.appendChild(canvas);
  renderCanvas();
};

/**
 * Crea el fondo del canvas dandole color, posicion y size
 */
const renderCanvas = () => {
  // Color del canvas
  context.fillStyle = 'white';
  //Creamos la pista
  context.fillRect(0, 0, width, height);

  // Rival
  context.fillStyle = 'black';
  context.fillRect(paddleComputerX, 10, paddleWidth, paddleHeight);
  // Jugador
  context.fillStyle = 'black';
  context.fillRect(
    paddlePlayerX,
    height - 10 - paddleHeight,
    paddleWidth,
    paddleHeight,
  );

  // Linea discontinua del centroDashed center
  context.beginPath();
  // Cantidad de espacios en la linea
  context.setLineDash([4]);
  context.moveTo(0, height / 2);
  context.lineTo(width, height / 2);
  // Color de la linea
  context.strokeStyle = 'grey';
  context.stroke();

  // Ball
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 2 * Math.PI, 0);
  context.fillStyle = 'black';
  // Pinta en pantalla
  context.fill();

  //SCORE
  context.font = '32px Courier New';
  context.fillText(playerScore.toString(), 20, canvas.height / 2 + 50);
  context.fillText(computerScore.toString(), 20, canvas.height / 2 - 30);
};

const ballMove = () => {
  ballY += speedY;
  if (playerMoved && paddleContact) {
    ballX += speedX;
  }
};

// Limites
const ballBoundaries = () => {
  // Limites del campo
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }
  if (ballX > width && speedX > 0) {
    speedX = -speedX;
  }

  // Choca con el jugador
  if (ballY > height - paddleDiff) {
    if (ballX > paddlePlayerX && ballX < paddlePlayerX + paddleWidth) {
      paddleContact = true;
      // if (playerMoved) {
      // 	speedY -= 1;
      // }
      speedY = -speedY;
      trajectoryX = ballX - (paddlePlayerX + paddleDiff);
      speedX = trajectoryX * 0.3;
    } else if (ballY > height) {
      ballReset();
      computerScore++;
    }
  }

  // Choca con el rival
  if (ballY < paddleDiff) {
    if (ballX > paddleComputerX && ballX < paddleComputerX + paddleWidth) {
      // if (playerMoved) {
      // 	speedY += 1;
      // }
      speedY = -speedY;
    } else if (ballY < 0) {
      ballReset();
      playerScore++;
    }
  }
};

const computerPaddle = () => {
  // if (playerMoved) {
  // TODO optimizar para que se mueva solo cuando la pelota no este dentro del rango de golpeo
  if (
    paddleComputerX + paddleDiff > Math.floor(ballX) + 5 ||
    paddleComputerX + paddleDiff < Math.floor(ballX) - 5
  ) {
    if (paddleComputerX + paddleDiff < ballX) {
      paddleComputerX += computerSpeed;
    } else {
      paddleComputerX -= computerSpeed;
    }
  }
};

const animate = () => {
  ballBoundaries();
  renderCanvas();
  ballMove();
  computerPaddle();
  // Llama a la funcion animate en cada frame
  window.requestAnimationFrame(animate);
};

const ballReset = () => {
  ballX = width / 2;
  ballY = height / 2;
  // speedY = -3
};

const startGame = () => {
  createCanvas();
  animate();

  playerScore = 0;
  computerScore = 0;

  // Mueve al jugador
  canvas.addEventListener('mousemove', (e) => {
    playerMoved = true;
    paddlePlayerX = e.clientX - paddleDiff;
    if (paddlePlayerX < paddleDiff) {
      paddlePlayerX = 0;
    }
    if (paddlePlayerX > width - paddleWidth) {
      paddlePlayerX = width - paddleWidth;
    }
  });
};
</script>
<style lang="scss" scoped></style>
