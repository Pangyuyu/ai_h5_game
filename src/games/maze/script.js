const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

let maze, player, goal, difficulty = 5, startTime, interval;
const cellSize = 20;

document.getElementById('difficulty').addEventListener('input', function() {
    difficulty = this.value;
});

document.getElementById('startButton').addEventListener('click', startGame);

document.getElementById('autoSolveButton').addEventListener('click', autoSolve);

function startGame() {
    clearInterval(interval);
    const size = difficulty * 5 + 5;
    maze = generateMaze(size, size);
    player = { x: 1, y: 1 };
    goal = { x: size - 2, y: size - 2 };
    startTime = Date.now();
    interval = setInterval(updateTimer, 1000);
    drawMaze();
}

function autoSolve() {
    const path = solveMaze(maze, player, goal);
    if (path.length > 0) {
        drawMaze();
        drawPath(path);
        alert('Auto-solve complete!');
    } else {
        alert('No solution found!');
    }
}

function updateTimer() {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
}

function generateMaze(width, height) {
    const maze = Array.from({ length: height }, () => Array(width).fill(1));
    function carve(x, y) {
        maze[y][x] = 0;
        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]].sort(() => Math.random() - 0.5);
        for (const [dx, dy] of directions) {
            const nx = x + dx * 2, ny = y + dy * 2;
            if (nx > 0 && ny > 0 && nx < width - 1 && ny < height - 1 && maze[ny][nx]) {
                maze[y + dy][x + dx] = 0;
                carve(nx, ny);
            }
        }
    }
    carve(1, 1);
    return maze;
}

function drawMaze() {
    canvas.width = maze[0].length * cellSize;
    canvas.height = maze.length * cellSize;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x]) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
    ctx.fillStyle = 'green';
    ctx.fillRect(goal.x * cellSize, goal.y * cellSize, cellSize, cellSize);
}

function solveMaze(maze, start, end) {
    const queue = [{ x: start.x, y: start.y, path: [] }];
    const visited = Array.from({ length: maze.length }, () => Array(maze[0].length).fill(false));
    visited[start.y][start.x] = true;
    const directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
    ];
    while (queue.length) {
        const currentNode = queue.shift();
        if (!currentNode) break; // Ensure queue is not empty
        const { x, y, path } = currentNode;
        if (x === end.x && y === end.y) return path.concat([{ x, y }]);
        for (const { dx, dy } of directions) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < maze[0].length && ny < maze.length && !maze[ny][nx] && !visited[ny][nx]) {
                visited[ny][nx] = true;
                queue.push({ x: nx, y: ny, path: path.concat([{ x, y }]) });
            }
        }
    }
    return [];
}

function drawPath(path) {
    ctx.beginPath();
    ctx.moveTo(path[0].x * cellSize + cellSize / 2, path[0].y * cellSize + cellSize / 2);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x * cellSize + cellSize / 2, path[i].y * cellSize + cellSize / 2);
    }
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
}

document.addEventListener('keydown', event => {
    const moves = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
    };
    const move = moves[event.key];
    if (move && !maze[player.y + move.y][player.x + move.x]) {
        player.x += move.x;
        player.y += move.y;
        drawMaze();
        if (player.x === goal.x && player.y === goal.y) {
            clearInterval(interval);
            alert('Congratulations! You solved the maze!');
        }
    }
});
