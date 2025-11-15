// 关卡配置文件 - 警察学校培训主题
export const LEVELS = {
  1: {
    name: '新手训练：基础抓捕',
    description: '欢迎来到警察学校！学习基本抓捕技巧',
    difficulty: 'easy',
    // 超简单的 2x3 地图
    graph: {
      nodes: [
        { id: 0, x: 350, y: 250, type: 'normal' },
        { id: 1, x: 550, y: 250, type: 'exit' }, // 出口在右上
        
        { id: 2, x: 350, y: 380, type: 'normal' },
        { id: 3, x: 550, y: 380, type: 'normal' },
        
        { id: 4, x: 350, y: 510, type: 'normal' },
        { id: 5, x: 550, y: 510, type: 'normal' }
      ],
      edges: [
        // 横向连接
        [0, 1],
        [2, 3],
        [4, 5],
        // 纵向连接
        [0, 2], [1, 3],
        [2, 4], [3, 5]
      ]
    },
    thiefPosition: 4, // 小偷在左下角
    policeCount: 2, // 2个警察
    policePositions: [2, 3] // 警察在中间，容易形成封锁
  },
  
  2: {
    name: '实战演练：团队配合',
    description: '学会与队友配合，封锁逃跑路线',
    difficulty: 'medium',
    // 简化的 3x4 地图，降低难度
    graph: {
      nodes: [
        { id: 0, x: 300, y: 180, type: 'normal' },
        { id: 1, x: 450, y: 180, type: 'normal' },
        { id: 2, x: 600, y: 180, type: 'exit' },
        
        { id: 3, x: 300, y: 310, type: 'normal' },
        { id: 4, x: 450, y: 310, type: 'normal' },
        { id: 5, x: 600, y: 310, type: 'normal' },
        
        { id: 6, x: 300, y: 440, type: 'normal' },
        { id: 7, x: 450, y: 440, type: 'normal' },
        { id: 8, x: 600, y: 440, type: 'normal' },
        
        { id: 9, x: 300, y: 570, type: 'normal' },
        { id: 10, x: 450, y: 570, type: 'normal' },
        { id: 11, x: 600, y: 570, type: 'normal' }
      ],
      edges: [
        // 横向
        [0, 1], [1, 2],
        [3, 4], [4, 5],
        [6, 7], [7, 8],
        [9, 10], [10, 11],
        // 纵向
        [0, 3], [1, 4], [2, 5],
        [3, 6], [4, 7], [5, 8],
        [6, 9], [7, 10], [8, 11],
        // 少量对角线
        [1, 5], [4, 8]
      ]
    },
    thiefPosition: 9, // 左下角
    policeCount: 3, // 增加到3个警察，降低难度
    policePositions: [1, 4, 5] // 警察分布在上中位置，便于封锁
  },
  
  3: {
    name: '毕业考核：抓捕高手',
    description: '展示你学到的所有技能，成为抓捕高手！',
    difficulty: 'hard',
    // 4x4 地图，降低难度但保持挑战性
    graph: {
      nodes: [
        { id: 0, x: 200, y: 150, type: 'normal' },
        { id: 1, x: 350, y: 150, type: 'normal' },
        { id: 2, x: 500, y: 150, type: 'normal' },
        { id: 3, x: 650, y: 150, type: 'exit' },
        
        { id: 4, x: 200, y: 280, type: 'normal' },
        { id: 5, x: 350, y: 280, type: 'normal' },
        { id: 6, x: 500, y: 280, type: 'normal' },
        { id: 7, x: 650, y: 280, type: 'normal' },
        
        { id: 8, x: 200, y: 410, type: 'normal' },
        { id: 9, x: 350, y: 410, type: 'normal' },
        { id: 10, x: 500, y: 410, type: 'normal' },
        { id: 11, x: 650, y: 410, type: 'normal' },
        
        { id: 12, x: 200, y: 540, type: 'normal' },
        { id: 13, x: 350, y: 540, type: 'normal' },
        { id: 14, x: 500, y: 540, type: 'normal' },
        { id: 15, x: 650, y: 540, type: 'normal' }
      ],
      edges: [
        // 横向
        [0, 1], [1, 2], [2, 3],
        [4, 5], [5, 6], [6, 7],
        [8, 9], [9, 10], [10, 11],
        [12, 13], [13, 14], [14, 15],
        // 纵向
        [0, 4], [1, 5], [2, 6], [3, 7],
        [4, 8], [5, 9], [6, 10], [7, 11],
        [8, 12], [9, 13], [10, 14], [11, 15],
        // 对角线（增加复杂度）
        [1, 6], [2, 5], [5, 10], [6, 9],
        [9, 14], [10, 13]
      ]
    },
    thiefPosition: 12,
    policeCount: 3, // 降低到3个警察
    policePositions: [2, 6, 10]
  }
}

