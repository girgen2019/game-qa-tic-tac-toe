const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];
const SCORE_KEY = 'ttt-score';

const cells = [...document.querySelectorAll('.cell')];
const statusEl = document.querySelector('[data-testid="status"]');
const scoreEls = {
  X: document.querySelector('[data-testid="score-x"]'),
  O: document.querySelector('[data-testid="score-o"]'),
  draw: document.querySelector('[data-testid="score-draw"]'),
};

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let score = loadScore();

function loadScore() {
  try {
    const saved = JSON.parse(localStorage.getItem(SCORE_KEY));
    if (saved && ['X', 'O', 'draw'].every((k) => Number.isInteger(saved[k]))) return saved;
  } catch (_) { /* corrupted or unavailable storage -> start from zero */ }
  return { X: 0, O: 0, draw: 0 };
}

function saveScore() {
  try { localStorage.setItem(SCORE_KEY, JSON.stringify(score)); } catch (_) { /* ignore */ }
}

function renderScore() {
  scoreEls.X.textContent = score.X;
  scoreEls.O.textContent = score.O;
  scoreEls.draw.textContent = score.draw;
}

function findWinLine() {
  return WIN_LINES.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function finish(result, line) {
  gameOver = true;
  score[result] += 1;
  saveScore();
  renderScore();
  cells.forEach((cell) => { cell.disabled = true; });
  if (line) line.forEach((i) => cells[i].classList.add('win'));
  statusEl.textContent = result === 'draw' ? "It's a draw!" : `Player ${result} wins!`;
}

function makeMove(index) {
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  const cell = cells[index];
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.disabled = true;

  const winLine = findWinLine();
  if (winLine) return finish(currentPlayer, winLine);
  if (board.every(Boolean)) return finish('draw');

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusEl.textContent = `Player ${currentPlayer}'s turn`;
}

function restart() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.disabled = false;
  });
  statusEl.textContent = "Player X's turn";
}

function resetScore() {
  score = { X: 0, O: 0, draw: 0 };
  saveScore();
  renderScore();
}

cells.forEach((cell) => cell.addEventListener('click', () => makeMove(Number(cell.dataset.index))));
document.querySelector('[data-testid="restart"]').addEventListener('click', restart);
document.querySelector('[data-testid="reset-score"]').addEventListener('click', resetScore);

renderScore();
