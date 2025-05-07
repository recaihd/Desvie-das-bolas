const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const bgMusic = document.getElementById('bgMusic');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const controls = document.getElementById('controls');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

let playerX = window.innerWidth / 2;
let score = 0;
let gameOver = false;
let isPaused = false;
let gameStarted = false;
let enemySpawnInterval;

// Movimento com teclado
document.addEventListener('keydown', (e) => {
  if (!gameStarted || gameOver || isPaused) return;

  if (e.key === 'ArrowLeft') {
    movePlayer(-30);
  } else if (e.key === 'ArrowRight') {
    movePlayer(30);
  }
});

// Movimento com botões
leftButton.addEventListener('click', () => {
  if (!gameStarted || gameOver || isPaused) return;
  movePlayer(-30);
});

rightButton.addEventListener('click', () => {
  if (!gameStarted || gameOver || isPaused) return;
  movePlayer(30);
});

function movePlayer(delta) {
  playerX += delta;
  if (playerX < 0) playerX = 0;
  if (playerX > window.innerWidth - 80) playerX = window.innerWidth - 80; // 80 = nova largura
  player.style.left = `${playerX}px`;
}

function createEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
  enemy.style.top = '0px';
  game.appendChild(enemy);

  let enemyY = 0;
  const fallSpeed = 9 + Math.random() * 4;

  const interval = setInterval(() => {
    if (gameOver || isPaused) return;

    enemyY += fallSpeed;
    enemy.style.top = `${enemyY}px`;

    const enemyRect = enemy.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      enemyRect.top < playerRect.bottom &&
      enemyRect.bottom > playerRect.top &&
      enemyRect.left < playerRect.right &&
      enemyRect.right > playerRect.left
    ) {
      clearInterval(interval);
      endGame();
    }

    if (enemyY > window.innerHeight) {
      clearInterval(interval);
      enemy.remove();
      score++;
      scoreDisplay.textContent = `Pontuação: ${score}`;
    }
  }, 16);
}

startButton.addEventListener('click', () => {
  gameStarted = true;
  isPaused = false;
  gameOver = false;
  score = 0;
  playerX = window.innerWidth / 2;
  player.style.left = `${playerX}px`;

  startScreen.style.display = 'none';
  pauseButton.style.display = 'block';
  scoreDisplay.textContent = 'Pontuação: 0';

  bgMusic.volume = 0.5;
  bgMusic.play();

  enemySpawnInterval = setInterval(() => {
    if (!gameOver && !isPaused) createEnemy();
  }, 300);
});

pauseButton.addEventListener('click', () => {
  if (!gameStarted) return;

  isPaused = !isPaused;
  if (isPaused) {
    bgMusic.pause();
    pauseButton.textContent = 'Continuar';
  } else {
    bgMusic.play();
    pauseButton.textContent = 'Pausar';
  }
});

function endGame() {
  gameOver = true;
  bgMusic.pause();
  clearInterval(enemySpawnInterval);
  gameOverScreen.style.display = 'flex';
  pauseButton.style.display = 'none';
  finalScore.textContent = `Sua pontuação foi: ${score}`;
}

document.getElementById('retryButton').addEventListener('click', () => {
  score = 0;
  gameOver = false;
  isPaused = false;
  gameStarted = true;

  document.querySelectorAll('.enemy').forEach(e => e.remove());

  playerX = window.innerWidth / 2;
  player.style.left = `${playerX}px`;

  scoreDisplay.textContent = 'Pontuação: 0';
  gameOverScreen.style.display = 'none';
  pauseButton.style.display = 'block';
  pauseButton.textContent = 'Pausar';

  bgMusic.currentTime = 0;
  bgMusic.play();

  enemySpawnInterval = setInterval(() => {
    if (!gameOver && !isPaused) createEnemy();
  }, 300);
});

document.getElementById('menuButton').addEventListener('click', () => {
  gameOverScreen.style.display = 'none';
  startScreen.style.display = 'flex';
  playerX = window.innerWidth / 2;
  score = 0;
  gameOver = false;
  isPaused = false;
  gameStarted = false;
  scoreDisplay.textContent = 'Pontuação: 0';
  pauseButton.style.display = 'none';
  player.style.left = `${playerX}px`;
  document.querySelectorAll('.enemy').forEach(e => e.remove());
});

document.getElementById('devButton').addEventListener('click', () => {
  window.location.href = 'desenvolvedor.html';
});
