const SIZE = 5;
const WIN_COUNT = 5;

let board = Array(SIZE * SIZE).fill("");
let currentPlayer = "〇";
let gameActive = true;

let timer = null;
let timeLeft = 15;

const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const timerElement = document.getElementById("timer");

function createBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.textContent = cell;
    div.addEventListener("click", () => handleClick(index));
    boardElement.appendChild(div);
  });
}

function handleClick(index) {
  if (!gameActive || board[index]) return;
  clearInterval(timer);

  board[index] = currentPlayer;
  flipCapturedPieces(index);
  createBoard();

  if (checkWinner(index)) {
    statusElement.textContent = `${currentPlayer} の勝ち！`;
    gameActive = false;
  } else if (board.every(cell => cell)) {
    statusElement.textContent = "引き分け！";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "〇" ? "×" : "〇";
    statusElement.textContent = `${currentPlayer} の番です`;
    startTimer();
  }
}

function startTimer() {
  timeLeft = 15;
  updateTimerDisplay();
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      statusElement.textContent = `${currentPlayer} の時間切れ！ ${currentPlayer === "〇" ? "×" : "〇"} の勝ち！`;
      gameActive = false;
    }
  }, 1000);
}

function updateTimerDisplay() {
  if (timerElement) {
    timerElement.textContent = `残り ${timeLeft} 秒`;
  }
}

function flipCapturedPieces(index) {
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
  ];

  const x = index % SIZE;
  const y = Math.floor(index / SIZE);

  for (const [dx, dy] of directions) {
    const toFlip = [];
    let i = 1;
    while (true) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) break;

      const ni = ny * SIZE + nx;
      const cell = board[ni];
      if (cell === "") break;
      if (cell === currentPlayer) {
        toFlip.forEach(idx => board[idx] = currentPlayer);
        break;
      } else {
        toFlip.push(ni);
      }
      i++;
    }
  }
}

function checkWinner(index) {
  const x = index % SIZE;
  const y = Math.floor(index / SIZE);

  return (
    countSame(x, y, 1, 0) + countSame(x, y, -1, 0) >= WIN_COUNT - 1 ||
    countSame(x, y, 0, 1) + countSame(x, y, 0, -1) >= WIN_COUNT - 1 ||
    countSame(x, y, 1, 1) + countSame(x, y, -1, -1) >= WIN_COUNT - 1 ||
    countSame(x, y, 1, -1) + countSame(x, y, -1, 1) >= WIN_COUNT - 1
  );
}

function countSame(x, y, dx, dy) {
  let count = 0;
  let i = 1;
  while (true) {
    const nx = x + dx * i;
    const ny = y + dy * i;
    if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) break;
    const idx = ny * SIZE + nx;
    if (board[idx] === currentPlayer) {
      count++;
      i++;
    } else {
      break;
    }
  }
  return count;
}

function resetGame() {
  board = Array(SIZE * SIZE).fill("");
  currentPlayer = "〇";
  gameActive = true;
  statusElement.textContent = `${currentPlayer} の番です`;
  createBoard();
  startTimer();
}

function startGame() {
  document.getElementById("start-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");
  resetGame();
}