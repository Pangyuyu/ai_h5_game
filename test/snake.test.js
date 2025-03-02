const SnakeGame = require('../src/games/snake/snake.js');

// 模拟 canvas 和 context
class MockCanvas {
    getContext() {
        return {
            fillStyle: '',
            fillRect: jest.fn(),
            beginPath: jest.fn(),
            arc: jest.fn(),
            fill: jest.fn()
        };
    }
}

describe('贪吃蛇游戏测试', () => {
    let game;
    let canvas;

    beforeEach(() => {
        canvas = new MockCanvas();
        canvas.width = 600;
        canvas.height = 600;
        game = new SnakeGame(canvas);
        game.init();
    });

    afterEach(() => {
        game.stop();
    });

    test('游戏初始化状态正确', () => {
        expect(game.snake).toHaveLength(1);
        expect(game.snake[0]).toEqual({ x: 15, y: 15 });
        expect(game.score).toBe(0);
        expect(game.isPaused).toBe(false);
        expect(game.isGameOver).toBe(false);
    });

    test('蛇的移动测试', () => {
        // 向右移动
        game.changeDirection('ArrowRight');
        game.update();
        expect(game.snake[0].x).toBe(16);
        expect(game.snake[0].y).toBe(15);

        // 向下移动
        game.changeDirection('ArrowDown');
        game.update();
        expect(game.snake[0].x).toBe(16);
        expect(game.snake[0].y).toBe(16);
    });

    test('穿墙效果测试', () => {
        // 设置蛇头位置在右边界
        game.snake[0].x = game.tileCount - 1;
        game.changeDirection('ArrowRight');
        game.update();
        expect(game.snake[0].x).toBe(0);

        // 设置蛇头位置在左边界
        game.snake[0].x = 0;
        game.changeDirection('ArrowLeft');
        game.update();
        expect(game.snake[0].x).toBe(game.tileCount - 1);
    });

    test('暂停功能测试', () => {
        const initialPosition = { ...game.snake[0] };
        game.changeDirection('ArrowRight');
        game.changeDirection(' '); // 暂停
        game.update();
        expect(game.snake[0]).toEqual(initialPosition);
        expect(game.isPaused).toBe(true);
    });

    test('吃到食物时增加分数', () => {
        // 将食物放在蛇头右侧一格
        game.food.x = game.snake[0].x + 1;
        game.food.y = game.snake[0].y;
        game.changeDirection('ArrowRight');
        game.update();
        expect(game.score).toBe(10);
        expect(game.snake).toHaveLength(2);
    });

    test('碰撞检测测试', () => {
        // 创建一个长度为3的蛇
        game.snake = [
            { x: 5, y: 5 },
            { x: 5, y: 6 },
            { x: 5, y: 7 }
        ];
        
        // 让蛇头撞向自己的身体
        game.changeDirection('ArrowDown');
        game.update();
        expect(game.isGameOver).toBe(true);
    });

    test('难度设置测试', () => {
        const initialSpeed = game.gameSpeed;
        game.setDifficulty('hard');
        expect(game.gameSpeed).toBe(game.difficultySettings.hard);
        expect(game.gameSpeed).not.toBe(initialSpeed);
    });

    test('重置游戏测试', () => {
        // 先进行一些游戏操作
        game.score = 50;
        game.snake.push({ x: 16, y: 15 });
        game.isPaused = true;
        game.isGameOver = true;

        // 重置游戏
        game.reset();

        expect(game.score).toBe(0);
        expect(game.snake).toHaveLength(1);
        expect(game.snake[0]).toEqual({ x: 15, y: 15 });
        expect(game.isPaused).toBe(false);
        expect(game.isGameOver).toBe(false);
    });

    test('非法移动方向测试', () => {
        // 向右移动时不能直接向左
        game.changeDirection('ArrowRight');
        game.update();
        game.changeDirection('ArrowLeft');
        game.update();
        expect(game.snake[0].x).toBeGreaterThan(15); // 仍然向右移动

        // 向上移动时不能直接向下
        game.reset();
        game.changeDirection('ArrowUp');
        game.update();
        game.changeDirection('ArrowDown');
        game.update();
        expect(game.snake[0].y).toBeLessThan(15); // 仍然向上移动
    });
}); 