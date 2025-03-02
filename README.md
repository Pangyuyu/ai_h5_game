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

- 绝大部分代码都是由AI生成的
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

## AI编程补充说明
**非常非常耗费Tokens，尝试之前，要谨慎**
- AI服务商
  - [火山引擎](https://www.volcengine.com/experience/ark?utm_term=202502dsinvite&ac=DSASUQY5&rc=DEYXL6M9)
  - [派欧算力群](https://ppinfra.com/user/register?invited_by=720CRX)
  - [硅基流动](https://cloud.siliconflow.cn/i/cJFFbYk0)
  之所以选择这三家，是因为它们有赠送的tokens。记住，这个非常重要
- 模型
  - deepseek-v1
  - deepseek-r3
  v1比r3好。
  比如俄罗斯方块，r3经过多次提醒，都没成功；v1成功了。
- 测试项目类型：纯前端
- 编程工具：vs code
- 编程插件
  - Cline
  - AI CODE
  原先使用的Cline，后来转向了AI CODE,因为这个是汉化版的，比较友好
- 体验感受-优点
  - AI确实可以编程；
  - 可以协助创建单元测试；
  - 回复详细
  - 任务完成后会有总结
  - 支持自定义Open AI 兼容的模型
  - 可以设置价格，实时看到耗费的Money
- 体验感受-缺点
  - 非常非常耗费tokens,简单的demo,都需要百万tokens;
  - 完全让AI代理处理事务不可行，有些事务会陷入死循环；
  - 对某些任务（如解决node.js版本冲突、修改复杂代码）处理不好；
  - 在纯净操作系统中，配置node.js环境，安装各种包，还是一如既往的不顺畅；需要人工介入
- 建议
  - 完全零基础的很难操作AI，有些Bug还是需要自己调试；
  - 明确的问题，明确的需求；
  - 对学习编程有价值，但是线上项目持保守态度；

**最后再次强调：非常非常非常耗费tokens,天量的tokens**
  