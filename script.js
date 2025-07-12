const board = document.getElementById('board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');

let cells = Array.from(document.getElementsByClassName('cell'));
let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill('');
let difficulty = 'hard';

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

difficultySelect.addEventListener('change', () => {
    difficulty = difficultySelect.value;
});

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (!gameActive || gameState[index] !== '') return;

    makeMove(index, 'X');

    if (!gameActive) return;

    setTimeout(() => {
        let aiIndex;
        if (difficulty === 'easy') {
            aiIndex = getRandomMove();
        } else if (difficulty === 'medium') {
            aiIndex = getMediumMove();
        } else {
            aiIndex = getBestMove();
        }
        makeMove(aiIndex, 'O');
    }, 300);
}

function makeMove(index, player) {
    if (gameState[index] !== '' || !gameActive) return;

    gameState[index] = player;
    cells[index].textContent = player;

    if (checkWinner(player)) {
        message.textContent = `プレイヤー ${player} の勝ち！`;
        gameActive = false;
        return;
    }

    if (gameState.every((cell) => cell !== '')) {
        message.textContent = '引き分けです！';
        gameActive = false;
        return;
    }

    currentPlayer = player === 'X' ? 'O' : 'X';
    message.textContent = `プレイヤー ${currentPlayer} の番です`;
}

function checkWinner(player) {
    return winPatterns.some((pattern) => {
        const [a, b, c] = pattern;
        return (
            gameState[a] === player &&
            gameState[b] === player &&
            gameState[c] === player
        );
    });
}

function getRandomMove() {
    const emptyIndices = gameState
        .map((val, idx) => (val === '' ? idx : null))
        .filter((val) => val !== null);
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

// Medium難易度：勝てる手 or 負けを防ぐ手 → なければランダム
function getMediumMove() {
    // 勝てる手
    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            if (checkWinner('O')) {
                gameState[i] = '';
                return i;
            }
            gameState[i] = '';
        }
    }

    // 負けを防ぐ手
    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'X';
            if (checkWinner('X')) {
                gameState[i] = '';
                return i;
            }
            gameState[i] = '';
        }
    }

    // ランダム手
    return getRandomMove();
}

// Hard難易度（Minimax）
function getBestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(state, depth, isMaximizing) {
    if (checkWinner('O')) return 10 - depth;
    if (checkWinner('X')) return depth - 10;
    if (state.every((cell) => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (state[i] === '') {
                state[i] = 'O';
                let score = minimax(state, depth + 1, false);
                state[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (state[i] === '') {
                state[i] = 'X';
                let score = minimax(state, depth + 1, true);
                state[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function restartGame() {
    gameState.fill('');
    gameActive = true;
    currentPlayer = 'X';
    message.textContent = `プレイヤー ${currentPlayer} の番です`;
    cells.forEach((cell) => (cell.textContent = ''));
}

cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
