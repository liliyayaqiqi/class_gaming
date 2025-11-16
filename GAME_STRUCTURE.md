# 我是职业体验官 - 游戏结构说明

## 游戏概述

"我是职业体验官"是一个职业体验类教育游戏，让玩家通过互动游戏体验不同职业的工作内容和技能要求。

## 游戏架构

### 主菜单（MainMenuScene）
- 游戏的入口场景
- 展示四个职业选项：
  1. 🚔 警察学校（已实现）
  2. 🚗 汽车美容师（占位）
  3. 👗 时装造型师（占位）
  4. 🧋 奶茶大师（占位）

### 职业模块

#### 1. 警察学校（已完成）
**场景流程：**
- `PoliceMenuScene` - 警察学校关卡选择菜单
- `GameScene` - 游戏主场景（抓捕小偷）
- `VictoryScene` - 关卡胜利页面
- `FinalVictoryScene` - 最终胜利页面

**游戏内容：**
- 三个训练关卡：
  - 第1关：新手训练 - 基础抓捕
  - 第2关：实战演练 - 团队配合
  - 第3关：毕业考核 - 抓捕高手
- 学习目标：观察力、推理能力、团队协作、决策能力、执行力

**文件列表：**
- `src/PoliceMenuScene.js` - 关卡选择菜单
- `src/GameScene.js` - 游戏核心逻辑
- `src/VictoryScene.js` - 关卡胜利场景
- `src/FinalVictoryScene.js` - 最终胜利场景
- `src/LevelConfig.js` - 关卡配置数据

#### 2. 汽车美容师（待开发）
**场景：** `CarBeautyScene`
**计划内容：**
- 汽车清洗技巧
- 打蜡抛光技术
- 内饰清洁保养
- 专业美容流程

#### 3. 时装造型师（待开发）
**场景：** `FashionScene`
**计划内容：**
- 色彩搭配技巧
- 服装款式设计
- 造型风格打造
- 时尚潮流把握

#### 4. 奶茶大师（待开发）
**场景：** `BubbleTeaScene`
**计划内容：**
- 奶茶配方调制
- 珍珠煮制技巧
- 饮品创意搭配
- 店铺经营管理

## 技术栈

- **游戏引擎：** Phaser 3.90.0
- **构建工具：** Vite 7.2.2
- **语言：** JavaScript (ES6+)

## 文件结构

```
class_gaming/
├── src/
│   ├── main.js                 # 游戏入口和配置
│   ├── MainMenuScene.js        # 主菜单场景
│   ├── PoliceMenuScene.js      # 警察学校菜单
│   ├── GameScene.js            # 警察学校游戏场景
│   ├── VictoryScene.js         # 关卡胜利场景
│   ├── FinalVictoryScene.js    # 最终胜利场景
│   ├── LevelConfig.js          # 关卡配置
│   ├── CarBeautyScene.js       # 汽车美容师场景（占位）
│   ├── FashionScene.js         # 时装造型师场景（占位）
│   ├── BubbleTeaScene.js       # 奶茶大师场景（占位）
│   └── style.css               # 样式文件
├── public/
│   ├── police.png              # 警察角色图片
│   └── thief.png               # 小偷角色图片
├── index.html                  # HTML 入口
├── package.json                # 项目依赖
└── GAME_STRUCTURE.md           # 本文档

```

## 场景导航关系

```
MainMenuScene (主菜单)
├── PoliceMenuScene (警察学校菜单)
│   └── GameScene (游戏场景)
│       ├── VictoryScene (关卡胜利)
│       │   ├── 下一关 → GameScene
│       │   ├── 返回菜单 → PoliceMenuScene
│       │   └── 重玩本关 → GameScene
│       └── FinalVictoryScene (最终胜利)
│           ├── 返回菜单 → PoliceMenuScene
│           └── 再玩一次 → GameScene (Level 1)
├── CarBeautyScene (汽车美容师 - 占位)
│   └── 返回 → MainMenuScene
├── FashionScene (时装造型师 - 占位)
│   └── 返回 → MainMenuScene
└── BubbleTeaScene (奶茶大师 - 占位)
    └── 返回 → MainMenuScene
```

## 开发指南

### 添加新职业模块

1. 创建新的场景文件（如 `src/NewCareerScene.js`）
2. 在 `src/main.js` 中导入并注册场景
3. 在 `MainMenuScene.js` 中更新对应按钮的 `targetScene` 参数
4. 实现职业特定的游戏逻辑

### 运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 设计理念

1. **模块化设计：** 每个职业独立成模块，便于开发和维护
2. **渐进式开发：** 先实现一个完整的职业模块，其他模块占位，逐步完善
3. **教育性：** 通过游戏让儿童了解不同职业的工作内容和所需技能
4. **趣味性：** 采用互动游戏的形式，提高学习兴趣和参与度

## 后续开发计划

1. 完善汽车美容师模块
2. 完善时装造型师模块
3. 完善奶茶大师模块
4. 添加成就系统
5. 添加音效和背景音乐
6. 优化移动端适配


