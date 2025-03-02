class SnakeGame {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = canvas.width / this.gridSize;
        
        this.difficultySettings = {
            easy: 150,
            normal: 100,
            hard: 70,
            extreme: 50
        };

        this.snake = [{ x: 15, y: 15 }];
        this.food = { x: 25, y: 25 };
        this.currentDifficulty = 'normal';
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameSpeed = 100;
        this.gameLoop = null;
        this.isPaused = false;
        this.nextDirection = { dx: 0, dy: 0 };
        this.isGameOver = false;
    }

    init() {
        this.generateFood();
        this.gameSpeed = this.difficultySettings[this.currentDifficulty];
        this.startGameLoop();
        return this;
    }

    startGameLoop() {
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
    }

    update() {
        if (this.isPaused || this.isGameOver) return;
        
        const head = { 
            x: this.snake[0].x + this.nextDirection.dx, 
            y: this.snake[0].y + this.nextDirection.dy 
        };
        
        // 穿墙效果
        if (head.x >= this.tileCount) head.x = 0;
        if (head.x < 0) head.x = this.tileCount - 1;
        if (head.y >= this.tileCount) head.y = 0;
        if (head.y < 0) head.y = this.tileCount - 1;

        // 碰撞检测
        if (this.isCollision(head)) {
            this.isGameOver = true;
            return;
        }

        this.snake.unshift(head);
        
        // 吃食物检测
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.generateFood();
            this.gameSpeed = Math.max(50, this.gameSpeed - 2);
            this.startGameLoop();
        } else {
            this.snake.pop();
        }

        this.dx = this.nextDirection.dx;
        this.dy = this.nextDirection.dy;
        
        this.draw();
    }

    draw() {
        // 清空画布
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制蛇
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#e74c3c' : '#2ecc71';
            this.ctx.fillRect(
                segment.x * this.gridSize, 
                segment.y * this.gridSize, 
                this.gridSize - 2, 
                this.gridSize - 2
            );
        });

        // 绘制食物
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize/2,
            this.food.y * this.gridSize + this.gridSize/2,
            this.gridSize/2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    changeDirection(key) {
        if (key === ' ') {
            this.isPaused = !this.isPaused;
            return;
        }

        const newDirection = { dx: 0, dy: 0 };
        
        if (key === 'ArrowUp' && this.dy !== 1) newDirection.dy = -1;
        if (key === 'ArrowDown' && this.dy !== -1) newDirection.dy = 1;
        if (key === 'ArrowLeft' && this.dx !== 1) newDirection.dx = -1;
        if (key === 'ArrowRight' && this.dx !== -1) newDirection.dx = 1;

        if (Math.abs(newDirection.dx) !== Math.abs(this.dx) || 
            Math.abs(newDirection.dy) !== Math.abs(this.dy)) {
            this.nextDirection = newDirection;
        }
    }

    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
        
        // 确保食物不在蛇身上
        while (this.snake.some(segment => 
            segment.x === this.food.x && segment.y === this.food.y)) {
            this.food.x = Math.floor(Math.random() * this.tileCount);
            this.food.y = Math.floor(Math.random() * this.tileCount);
        }
    }

    isCollision(position) {
        return this.snake.some((segment, index) => 
            index !== 0 && segment.x === position.x && segment.y === position.y
        );
    }

    setDifficulty(difficulty) {
        if (this.difficultySettings[difficulty]) {
            this.currentDifficulty = difficulty;
            this.gameSpeed = this.difficultySettings[difficulty];
            this.startGameLoop();
        }
    }

    getScore() {
        return this.score;
    }

    reset() {
        this.snake = [{ x: 15, y: 15 }];
        this.food = { x: 25, y: 25 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.nextDirection = { dx: 0, dy: 0 };
        this.isPaused = false;
        this.isGameOver = false;
        this.generateFood();
        this.startGameLoop();
    }

    stop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
}

// 如果在浏览器环境中，将 SnakeGame 添加到全局对象
if (typeof window !== 'undefined') {
    window.SnakeGame = SnakeGame;
}

// 如果在 Node.js 环境中，导出 SnakeGame
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnakeGame;
} 