// 游戏配置
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const GAME_SPEED = 1000;  // 降低下落速度以便观察
const COLORS = ['#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'];

// 方块形状
const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
];

// 游戏状态
let grid = [];
let currentPiece;
let nextPiece;
let score = 0;
let gameOver = false;
let lastTime = 0;

// 初始化游戏
function initGame() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0;
    gameOver = false;
    currentPiece = createRandomPiece();
    nextPiece = createRandomPiece();
    updateView();
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('restartBtn').addEventListener('click', initGame);
    startGameLoop();
}

// 创建随机方块
function createRandomPiece() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
        shape,
        x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
        y: 0
    };
}

// 处理键盘输入
function handleKeyPress(event) {
    if (gameOver) return;
    
    switch (event.key) {
        case 'ArrowLeft': movePiece(-1); break;
        case 'ArrowRight': movePiece(1); break;
        case 'ArrowDown': dropPiece(); break;
        case 'ArrowUp': rotatePiece(); break;
    }
}

// 移动方块
function movePiece(dx) {
    if (!collision(currentPiece.shape, currentPiece.x + dx, currentPiece.y)) {
        currentPiece.x += dx;
        updateView();
    }
}

// 旋转方块
function rotatePiece() {
    const rotated = rotateShape(currentPiece.shape);
    if (!collision(rotated, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = rotated;
        updateView();
    }
}

// 旋转形状
function rotateShape(shape) {
    const N = shape.length;
    const rotated = Array.from({ length: shape[0].length }, () => Array(N).fill(0));
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            rotated[j][N - 1 - i] = shape[i][j];
        }
    }
    return rotated;
}

// 快速下落
function dropPiece() {
    while (!collision(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y++;
    }
    placePiece();
}

// 放置方块
async function placePiece() {
    for (let i = 0; i < currentPiece.shape.length; i++) {
        for (let j = 0; j < currentPiece.shape[i].length; j++) {
            if (currentPiece.shape[i][j]) {
                grid[currentPiece.y + i][currentPiece.x + j] = 1;
            }
        }
    }
    clearLines();
    spawnNewPiece();
}

// 清除完整行
function clearLines() {
    let linesCleared = 0;
    for (let i = grid.length - 1; i >= 0; i--) {
        if (grid[i].every(cell => cell === 1)) {
            grid.splice(i, 1);
            grid.unshift(Array(COLS).fill(0));
            linesCleared++;
            i++;
        }
    }
    if (linesCleared > 0) {
        score += linesCleared * 100;
        updateView();
    }
}

// 生成新方块
function spawnNewPiece() {
    currentPiece = nextPiece;
    nextPiece = createRandomPiece();
    updateView();
    if (collision(currentPiece.shape, currentPiece.x, currentPiece.y)) {
        gameOver = true;
        alert('游戏结束！');
    }
}

// 碰撞检测
function collision(shape, x, y) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) {
                const newX = x + j;
                const newY = y + i;
                if (newX < 0 || newX >= COLS || newY >= ROWS || 
                    (newY >= 0 && grid[newY][newX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

// 初始化Canvas
const mainCanvas = document.createElement('canvas');
mainCanvas.width = COLS * BLOCK_SIZE;
mainCanvas.height = ROWS * BLOCK_SIZE;
document.getElementById('gameGrid').appendChild(mainCanvas);
const ctx = mainCanvas.getContext('2d');

// 初始化预览Canvas
const previewCanvas = document.createElement('canvas');
previewCanvas.width = 4 * BLOCK_SIZE;
previewCanvas.height = 4 * BLOCK_SIZE;
document.getElementById('nextPiece').appendChild(previewCanvas);
const previewCtx = previewCanvas.getContext('2d');

// 更新视图
function updateView() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    
    // 绘制网格背景
    ctx.fillStyle = '#2d3436';
    ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    
    // 绘制已固定的方块
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (grid[y][x]) {
                ctx.fillStyle = COLORS[grid[y][x] - 1];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        }
    }
    
    // 绘制当前下落中的方块
    ctx.fillStyle = COLORS[SHAPES.indexOf(currentPiece.shape)];
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                ctx.fillRect(
                    (currentPiece.x + x) * BLOCK_SIZE,
                    (currentPiece.y + y) * BLOCK_SIZE,
                    BLOCK_SIZE - 1,
                    BLOCK_SIZE - 1
                );
            }
        });
    });
    
    // 更新分数
    document.getElementById('score').textContent = score;

    // 绘制下一个方块预览
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.fillStyle = COLORS[SHAPES.indexOf(nextPiece.shape)];
    nextPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                // 居中显示预览方块
                const offsetX = (previewCanvas.width/2 - (nextPiece.shape[0].length * BLOCK_SIZE/2));
                const offsetY = (previewCanvas.height/2 - (nextPiece.shape.length * BLOCK_SIZE/2));
                previewCtx.fillRect(
                    offsetX + x * BLOCK_SIZE,
                    offsetY + y * BLOCK_SIZE,
                    BLOCK_SIZE - 2,
                    BLOCK_SIZE - 2
                );
            }
        });
    });
}

// 开始游戏循环
function startGameLoop() {
    let lastUpdate = performance.now();
    
    async function gameLoop() {
        if (gameOver) return;
        
        const now = performance.now();
        const delta = now - lastUpdate;
        
        if (delta > GAME_SPEED) {
            if (!collision(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
                currentPiece.y++;
                await updateView();
            } else {
                await placePiece();
            }
            lastUpdate = now;
        }
        
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
}

// 初始化游戏
initGame();
