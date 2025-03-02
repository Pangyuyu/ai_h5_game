const GRID_SIZE = 4;
const WIN_VALUE = 2048;

class Game2048 {
  constructor() {
    this.grid = [];
    this.score = 0;
    this.gameOver = false;
    this.initGame(); // 恢复构造函数中的初始化调用
  }

  initGame() {
    this.grid = Array.from({ length: GRID_SIZE }, () => 
      Array(GRID_SIZE).fill(0)
    );
    this.score = 0;
    this.gameOver = false;
    this.addRandomTile();
    this.addRandomTile();
    this.updateView();
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    document.getElementById('restartBtn').addEventListener('click', () => this.initGame());
  }

  // 保留完整的类方法...

  addRandomTile() {
    const emptyCells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (this.grid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
    return this;
  }

  handleKeyPress(event) {
    if (this.gameOver) return;
    
    switch (event.key) {
      case 'ArrowUp': this.move('up'); break;
      case 'ArrowDown': this.move('down'); break;
      case 'ArrowLeft': this.move('left'); break;
      case 'ArrowRight': this.move('right'); break;
      default: return;
    }
    
    if (this.isGameOver()) {
      this.gameOver = true;
      alert('游戏结束！');
    }
    this.updateView();
  }

  move(direction) {
    let moved = false;
    const oldGrid = JSON.parse(JSON.stringify(this.grid));
    
    switch (direction) {
      case 'up':
      case 'down':
        for (let col = 0; col < GRID_SIZE; col++) {
          moved = this.moveColumn(col, direction) || moved;
        }
        break;
      case 'left':
      case 'right':
        for (let row = 0; row < GRID_SIZE; row++) {
          moved = this.moveRow(row, direction) || moved;
        }
        break;
    }
    
    if (moved) {
      this.addRandomTile();
      this.updateView();
    }
    return this;
  }

  moveRow(row, direction) {
    let currentRow = [...this.grid[row]];
    const newRow = this.mergeTiles(currentRow.filter(x => x !== 0), direction);
    
    // 填充空位
    while (newRow.length < GRID_SIZE) {
      direction === 'left' ? newRow.push(0) : newRow.unshift(0);
    }
    
    this.grid[row] = newRow;
    return !this.arraysEqual(currentRow, newRow);
  }

  moveColumn(col, direction) {
    let currentCol = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      currentCol.push(this.grid[row][col]);
    }
    
    const newCol = this.mergeTiles(currentCol.filter(x => x !== 0), direction);
    
    // 填充空位
    while (newCol.length < GRID_SIZE) {
      direction === 'up' ? newCol.push(0) : newCol.unshift(0);
    }
    
    for (let row = 0; row < GRID_SIZE; row++) {
      this.grid[row][col] = newCol[row];
    }
    return !this.arraysEqual(currentCol, newCol);
  }

  mergeTiles(tiles, direction) {
    const ordered = ['up', 'left'].includes(direction) ? tiles : tiles.reverse();
    
    for (let i = 0; i < ordered.length - 1; i++) {
      if (ordered[i] === ordered[i + 1]) {
        ordered[i] *= 2;
        this.score += ordered[i];
        ordered.splice(i + 1, 1);
        if (ordered[i] === WIN_VALUE) {
          this.gameOver = true;
          alert('恭喜你，赢了！');
        }
      }
    }
    return ['up', 'left'].includes(direction) ? ordered : ordered.reverse();
  }

  updateView() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    this.grid.forEach((row, i) => {
      row.forEach((value, j) => {
        const tile = document.createElement('div');
        tile.className = `tile value-${value}`;
        tile.textContent = value || '';
        tile.style.backgroundColor = this.getTileColor(value);
        gameBoard.appendChild(tile);
      });
    });
    
    document.getElementById('score').textContent = this.score;
    return this;
  }

  getTileColor(value) {
    const colors = {
      0: '#cdc1b4',
      2: '#eee4da',   4: '#ede0c8',
      8: '#f2b179',   16: '#f59563',
      32: '#f67c5f',  64: '#f65e3b',
      128: '#edcf72', 256: '#edcc61',
      512: '#edc850', 1024: '#edc53f',
      2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
  }

  isGameOver() {
    // 检查空单元格
    if (this.grid.some(row => row.some(cell => cell === 0))) return false;
    
    // 检查水平方向可合并
    if (this.grid.some(row => row.some((cell, i) => i < 3 && cell === row[i + 1]))) return false;
    
    // 检查垂直方向可合并
    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row < GRID_SIZE - 1; row++) {
        if (this.grid[row][col] === this.grid[row + 1][col]) return false;
      }
    }
    
    return true;
  }

  arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}

export default Game2048;

// 添加DOM加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
  new Game2048();
});
