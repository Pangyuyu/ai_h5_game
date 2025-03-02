// 游戏配置
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const BALL_SIZE = 15;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_WIDTH = GAME_WIDTH / BRICK_COLS;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 2;

// 游戏状态
let paddleX = (GAME_WIDTH - PADDLE_WIDTH) / 2;
let ballX = GAME_WIDTH / 2;
let ballY = GAME_HEIGHT - 100;
let dx = 4;
let dy = -4;
let score = 0;
let bricks = [];
let gameOver = false;

// 初始化游戏
function initGame() {
    // 获取元素
    const paddle = document.getElementById('paddle');
    const ball = document.getElementById('ball');
    const bricksContainer = document.getElementById('bricks');
    const scoreElement = document.getElementById('score');

    // 初始化砖块
    bricksContainer.innerHTML = '';
    bricks = createBricks();
    renderBricks(bricks, bricksContainer);

    // 初始化游戏状态
    paddleX = (GAME_WIDTH - PADDLE_WIDTH) / 2;
    ballX = GAME_WIDTH / 2;
    ballY = GAME_HEIGHT - 100;
    dx = 4;
    dy = -4;
    score = 0;
    gameOver = false;

    // 更新显示
    updatePaddle(paddle);
    updateBall(ball);
    scoreElement.textContent = score;

    // 添加事件监听
    document.addEventListener('mousemove', movePaddle);
    document.getElementById('restartBtn').addEventListener('click', initGame);

    // 开始游戏循环
    gameLoop();
}

// 创建砖块
function createBricks() {
    const bricks = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
        for (let col = 0; col < BRICK_COLS; col++) {
            bricks.push({
                x: col * (BRICK_WIDTH + BRICK_GAP),
                y: row * (BRICK_HEIGHT + BRICK_GAP) + 50,
                visible: true
            });
        }
    }
    return bricks;
}

// 渲染砖块
function renderBricks(bricks, container) {
    bricks.forEach(brick => {
        const brickElement = document.createElement('div');
        brickElement.classList.add('brick');
        brickElement.style.left = `${brick.x}px`;
        brickElement.style.top = `${brick.y}px`;
        brickElement.style.width = `${BRICK_WIDTH}px`;
        brickElement.style.height = `${BRICK_HEIGHT}px`;
        brickElement.style.display = brick.visible ? 'block' : 'none';
        container.appendChild(brickElement);
    });
}

// 移动挡板
function movePaddle(event) {
    const rect = document.querySelector('.game-area').getBoundingClientRect();
    paddleX = event.clientX - rect.left - PADDLE_WIDTH / 2;
    paddleX = Math.max(0, Math.min(paddleX, GAME_WIDTH - PADDLE_WIDTH));
    updatePaddle(document.getElementById('paddle'));
}

// 更新挡板位置
function updatePaddle(paddle) {
    paddle.style.left = `${paddleX}px`;
}

// 更新球位置
function updateBall(ball) {
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

// 游戏主循环
function gameLoop() {
    if (gameOver) return;

    // 更新球位置
    ballX += dx;
    ballY += dy;

    // 碰撞检测
    checkCollisions();

    // 更新显示
    updateBall(document.getElementById('ball'));

    // 继续循环
    requestAnimationFrame(gameLoop);
}

// 碰撞检测
function checkCollisions() {
    // 左右墙碰撞
    if (ballX + BALL_SIZE > GAME_WIDTH || ballX < 0) {
        dx = -dx;
    }

    // 上墙碰撞
    if (ballY < 0) {
        dy = -dy;
    }

    // 挡板碰撞
    if (ballY + BALL_SIZE > GAME_HEIGHT - PADDLE_HEIGHT &&
        ballX + BALL_SIZE > paddleX && ballX < paddleX + PADDLE_WIDTH) {
        // 计算球与挡板中心的偏移量
        const ballCenter = ballX + BALL_SIZE / 2;
        const paddleCenter = paddleX + PADDLE_WIDTH / 2;
        const offset = (ballCenter - paddleCenter) / (PADDLE_WIDTH / 2);
        
        // 根据偏移量调整水平速度
        dx = offset * 5;
        dy = -Math.abs(dy);
        
        // 防止球卡在挡板内
        ballY = GAME_HEIGHT - PADDLE_HEIGHT - BALL_SIZE;
    }

    // 底部碰撞（游戏结束）
    if (ballY + BALL_SIZE > GAME_HEIGHT) {
        gameOver = true;
        alert('游戏结束！');
        return;
    }

    // 砖块碰撞
    bricks.forEach(brick => {
        if (brick.visible &&
            ballX > brick.x && ballX < brick.x + BRICK_WIDTH &&
            ballY > brick.y && ballY < brick.y + BRICK_HEIGHT) {
            brick.visible = false;
            dy = -dy;
            score += 10;
            document.getElementById('score').textContent = score;

            // 检查是否胜利
            if (bricks.every(b => !b.visible)) {
                gameOver = true;
                alert('恭喜你，赢了！');
            }
        }
    });
}

// 初始化游戏
initGame();
