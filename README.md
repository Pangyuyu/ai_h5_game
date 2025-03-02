# Classic Web Games Collection

![Game Showcase](https://img.shields.io/badge/games-5-brightgreen) 
![Test Status](https://img.shields.io/badge/tests-passing-brightgreen)

经典网页游戏合集，包含以下游戏：

- 🎮 2048
- 🧩 俄罗斯方块
- 🕹️ 打砖块
- 🚩 扫雷
- 🐍 贪吃蛇

## 功能特性

- 纯原生JavaScript实现
- 响应式布局设计
- 模块化代码结构
- 完整的单元测试
- 本地开发服务器支持

## 快速开始

### 安装依赖
```bash
git clone git@github.com:Pangyuyu/ai_h5_game.git
cd ai_h5_game
npm install
```

### 启动开发服务器
```bash
npm run start
```
访问 http://localhost:8080 查看游戏大厅

### 运行测试
```bash
npm test
```

## 游戏列表
| 游戏名称 | 访问地址 | 操作方式 |
|----------|----------|----------|
| 2048 | http://localhost:8080/2048.html | 方向键控制 |
| 俄罗斯方块 | http://localhost:8080/tetris.html | 方向键 + 空格旋转 |
| 打砖块 | http://localhost:8080/breakout.html | 鼠标控制 |
| 扫雷 | http://localhost:8080/minesweeper.html | 鼠标点击 |
| 贪吃蛇 | http://localhost:8080/snake.html | 方向键控制 |

## 项目结构
```
.
├── src/
│   ├── games/          # 游戏核心逻辑
│   ├── utils/          # 通用工具函数
│   └── styles/         # 全局样式
├── test/               # 测试用例
├── package.json
├── babel.config.js
└── README.md
```

## 开发指南

### 添加新游戏
1. 创建新的HTML文件（如`newgame.html`）
2. 添加对应的CSS/JS文件
3. 更新导航菜单：
```javascript
// 在index.html中添加
<a href="newgame.html" class="game-card">
  <h3>新游戏</h3>
</a>
```

### 测试规范
- 每个游戏对应一个测试文件（如`2048.test.js`）
- 使用Jest + jsdom进行DOM测试
- 覆盖率要求：≥80%

## 贡献方式
1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/新功能`)
3. 提交修改 (`git commit -am '添加新功能'`)
4. 推送分支 (`git push origin feature/新功能`)
5. 创建Pull Request

## 许可证
[MIT License](LICENSE)
