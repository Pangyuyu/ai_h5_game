const Game2048 = require('../src/games/2048/2048.js');

describe('2048 Game', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="gameBoard"></div>
      <div id="score"></div>
      <button id="restartBtn"></button>
    `;
  });

  test('should initialize game board', () => {
    const game = new Game2048();
    // 验证网格基本结构
    expect(game.grid).toHaveLength(4);
    game.grid.forEach(row => expect(row).toHaveLength(4));
    
    // 检查整个网格中至少有两个初始方块
    const totalCells = game.grid.flat().filter(cell => cell > 0).length;
    expect(totalCells).toBeGreaterThanOrEqual(2);
  });
}); 