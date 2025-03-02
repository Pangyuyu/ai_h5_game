// 游戏配置
const ROWS = 8;
const COLS = 8;
const MINES = 10;

// 游戏状态
let board = [];
let revealedCount = 0;
let gameOver = false;

// 初始化游戏
function initGame() {
    // 创建游戏板
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    gameBoard.style.setProperty('--rows', ROWS);
    gameBoard.style.setProperty('--cols', COLS);

    // 初始化游戏数据
    board = createBoard();
    placeMines(board);
    calculateNumbers(board);
    revealedCount = 0;
    gameOver = false;

    // 渲染游戏板
    renderBoard(board, gameBoard);
    updateMineCount();

    // 添加事件监听
    gameBoard.addEventListener('click', handleCellClick);
    document.getElementById('restartBtn').addEventListener('click', initGame);
}

// 创建游戏板
function createBoard() {
    return Array.from({ length: ROWS }, () => 
        Array.from({ length: COLS }, () => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0
        }))
    );
}

// 放置地雷
function placeMines(board) {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
        const row = Math.floor(Math.random() * ROWS);
        const col = Math.floor(Math.random() * COLS);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
}

// 计算周围地雷数
function calculateNumbers(board) {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (!board[row][col].isMine) {
                board[row][col].neighborMines = countNeighborMines(row, col);
            }
        }
    }
}

// 计算相邻地雷数
function countNeighborMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < ROWS && 
                newCol >= 0 && newCol < COLS && 
                board[newRow][newCol].isMine) {
                count++;
            }
        }
    }
    return count;
}

// 渲染游戏板
function renderBoard(board, gameBoard) {
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.row = rowIndex;
            cellElement.dataset.col = colIndex;
            gameBoard.appendChild(cellElement);
        });
    });
}

// 处理单元格点击
function handleCellClick(event) {
    if (gameOver) return;
    
    const cell = event.target;
    if (!cell.classList.contains('cell')) return;
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    revealCell(row, col);
}

// 揭示单元格
function revealCell(row, col) {
    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged) return;
    
    cell.isRevealed = true;
    revealedCount++;
    
    const cellElement = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    if (cell.isMine) {
        cellElement.classList.add('mine');
        gameOver = true;
        alert('游戏结束！');
        return;
    }
    
    cellElement.classList.add('revealed');
    cellElement.textContent = cell.neighborMines || '';
    
    if (cell.neighborMines === 0) {
        revealNeighbors(row, col);
    }
    
    checkWin();
}

// 揭示相邻单元格
function revealNeighbors(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < ROWS && 
                newCol >= 0 && newCol < COLS) {
                revealCell(newRow, newCol);
            }
        }
    }
}

// 检查是否胜利
function checkWin() {
    if (revealedCount === ROWS * COLS - MINES) {
        gameOver = true;
        alert('恭喜你，赢了！');
    }
}

// 更新剩余地雷数
function updateMineCount() {
    const mineCountElement = document.getElementById('mineCount');
    mineCountElement.textContent = MINES;
}

// 初始化游戏
initGame();
