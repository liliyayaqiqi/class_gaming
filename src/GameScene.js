export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
    
    // 游戏状态
    this.gameState = 'playing' // 'playing', 'won', 'lost'
    this.currentTurn = 'police' // 'police' or 'thief'
    
    // 图结构定义 - 简单的连通图，适合一年级学生
    this.graph = {
      nodes: [
        { id: 0, x: 150, y: 100, type: 'normal' },
        { id: 1, x: 300, y: 100, type: 'normal' },
        { id: 2, x: 450, y: 100, type: 'normal' },
        { id: 3, x: 600, y: 100, type: 'normal' },
        { id: 4, x: 750, y: 100, type: 'exit' }, // 出口
        
        { id: 5, x: 150, y: 250, type: 'normal' },
        { id: 6, x: 300, y: 250, type: 'normal' },
        { id: 7, x: 450, y: 250, type: 'normal' },
        { id: 8, x: 600, y: 250, type: 'normal' },
        { id: 9, x: 750, y: 250, type: 'normal' },
        
        { id: 10, x: 150, y: 400, type: 'normal' },
        { id: 11, x: 300, y: 400, type: 'normal' },
        { id: 12, x: 450, y: 400, type: 'normal' },
        { id: 13, x: 600, y: 400, type: 'normal' },
        { id: 14, x: 750, y: 400, type: 'normal' },
        
        { id: 15, x: 150, y: 550, type: 'normal' },
        { id: 16, x: 300, y: 550, type: 'normal' },
        { id: 17, x: 450, y: 550, type: 'normal' },
        { id: 18, x: 600, y: 550, type: 'normal' },
        { id: 19, x: 750, y: 550, type: 'normal' }
      ],
      edges: [
        // 第一行
        [0, 1], [1, 2], [2, 3], [3, 4],
        // 第二行
        [5, 6], [6, 7], [7, 8], [8, 9],
        // 第三行
        [10, 11], [11, 12], [12, 13], [13, 14],
        // 第四行
        [15, 16], [16, 17], [17, 18], [18, 19],
        // 垂直连接
        [0, 5], [1, 6], [2, 7], [3, 8], [4, 9],
        [5, 10], [6, 11], [7, 12], [8, 13], [9, 14],
        [10, 15], [11, 16], [12, 17], [13, 18], [14, 19],
        // 对角线连接（增加复杂度但不太多）
        [1, 7], [2, 6], [3, 7], [7, 13], [8, 12],
        [11, 17], [12, 16], [13, 17]
      ]
    }
    
    // 角色位置
    this.thiefPosition = 10 // 小偷起始位置（左下区域）
    
    // 动态计算需要的警察数量和位置
    this.calculateRequiredPolice()
    
    // 选中的警察
    this.selectedPolice = null
    
    // 高亮的节点列表
    this.highlightedNodes = []
  }
  
  preload() {
    // 预加载图片资源
    this.load.image('police', '/police.png')
    this.load.image('thief', '/thief.png')
  }
  
  // 动态计算图片缩放比例
  calculateSpriteScale(textureKey, targetSize = 45) {
    // targetSize: 目标显示大小（像素），默认45px，略小于节点50px
    const texture = this.textures.get(textureKey)
    if (!texture || !texture.source || !texture.source[0]) {
      console.warn(`无法获取纹理 ${textureKey}，使用默认缩放`)
      return 0.35
    }
    
    const width = texture.source[0].width
    const height = texture.source[0].height
    const maxDimension = Math.max(width, height)
    
    // 计算缩放比例，使图片最大边等于目标大小
    const scale = targetSize / maxDimension
    
    console.log(`图片 ${textureKey}: ${width}x${height}, 缩放比例: ${scale.toFixed(3)}, 显示大小: ${(maxDimension * scale).toFixed(1)}px`)
    
    return scale
  }
  
  create() {
    // 重置游戏状态（重新开始时需要）
    this.gameState = 'playing'
    this.currentTurn = 'police'
    this.selectedPolice = null
    this.highlightedNodes = []
    
    // 重置角色位置
    this.thiefPosition = 10 // 小偷起始位置（左下区域）
    this.calculateRequiredPolice() // 重新计算警察位置
    
    // 绘制标题
    this.add.text(450, 30, '警察抓小偷', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // 绘制说明
    this.instructionText = this.add.text(450, 650, '警察回合：点击任意警察，再点击相邻节点移动', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffeb3b'
    }).setOrigin(0.5)
    
    // 绘制边
    this.drawEdges()
    
    // 绘制节点
    this.nodeGraphics = []
    this.graph.nodes.forEach(node => {
      this.drawNode(node)
    })
    
    // 创建角色
    this.createCharacters()
    
    // 添加重新开始按钮
    this.createRestartButton()
  }
  
  drawEdges() {
    const graphics = this.add.graphics()
    graphics.lineStyle(3, 0x4a5568, 1)
    
    this.graph.edges.forEach(([from, to]) => {
      const fromNode = this.graph.nodes[from]
      const toNode = this.graph.nodes[to]
      graphics.lineBetween(fromNode.x, fromNode.y, toNode.x, toNode.y)
    })
  }
  
  drawNode(node) {
    const graphics = this.add.graphics()
    
    // 根据节点类型选择颜色
    if (node.type === 'exit') {
      graphics.fillStyle(0x4caf50, 1) // 绿色表示出口
      graphics.lineStyle(4, 0x2e7d32, 1)
    } else {
      graphics.fillStyle(0x64b5f6, 1) // 蓝色表示普通节点
      graphics.lineStyle(3, 0x1976d2, 1)
    }
    
    graphics.fillCircle(node.x, node.y, 25)
    graphics.strokeCircle(node.x, node.y, 25)
    
    // 如果是出口，添加标签
    if (node.type === 'exit') {
      this.add.text(node.x, node.y, '出口', {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5)
    }
    
    // 添加交互 - 使用更大的点击区域
    const hitZone = this.add.circle(node.x, node.y, 30, 0xffffff, 0)
    hitZone.setInteractive({ useHandCursor: true })
    hitZone.setDepth(100) // 设置在最高层，确保可以点击
    
    hitZone.on('pointerdown', () => this.onNodeClick(node))
    
    // 添加悬停效果 - 在高亮节点上悬停时增强效果
    hitZone.on('pointerover', () => {
      if (this.gameState === 'playing' && this.currentTurn === 'police' && this.selectedPolice !== null) {
        const isHighlighted = this.highlightedNodes && this.highlightedNodes.includes(node.id)
        if (isHighlighted) {
          // 如果是高亮节点，增强悬停效果
          graphics.clear()
          if (node.type === 'exit') {
            graphics.fillStyle(0x81c784, 1) // 更亮的绿色
            graphics.lineStyle(6, 0xffd54f, 1) // 更粗的黄色边框
          } else {
            graphics.fillStyle(0xbbdefb, 1) // 更亮的蓝色
            graphics.lineStyle(6, 0xffd54f, 1) // 更粗的黄色边框
          }
          graphics.fillCircle(node.x, node.y, 25)
          graphics.strokeCircle(node.x, node.y, 25)
        }
      }
    })
    
    hitZone.on('pointerout', () => {
      const isHighlighted = this.highlightedNodes && this.highlightedNodes.includes(node.id)
      graphics.clear()
      
      if (isHighlighted) {
        // 恢复为高亮状态
        if (node.type === 'exit') {
          graphics.fillStyle(0x66bb6a, 1)
          graphics.lineStyle(5, 0xffeb3b, 1)
        } else {
          graphics.fillStyle(0x90caf9, 1)
          graphics.lineStyle(5, 0xffeb3b, 1)
        }
      } else {
        // 恢复为普通状态
        if (node.type === 'exit') {
          graphics.fillStyle(0x4caf50, 1)
          graphics.lineStyle(4, 0x2e7d32, 1)
        } else {
          graphics.fillStyle(0x64b5f6, 1)
          graphics.lineStyle(3, 0x1976d2, 1)
        }
      }
      graphics.fillCircle(node.x, node.y, 25)
      graphics.strokeCircle(node.x, node.y, 25)
    })
    
    this.nodeGraphics.push({ node, graphics, hitZone })
  }
  
  createCharacters() {
    // 动态计算缩放比例
    const thiefScale = this.calculateSpriteScale('thief', 45)
    const policeScale = this.calculateSpriteScale('police', 45)
    
    // 保存原始缩放值，用于恢复
    this.policeOriginalScale = policeScale
    
    // 创建小偷（使用图片精灵）
    const thiefNode = this.graph.nodes[this.thiefPosition]
    this.thief = this.add.sprite(thiefNode.x, thiefNode.y, 'thief')
    this.thief.setScale(thiefScale)
    this.thief.setDepth(10)
    // 不设置 interactive，让点击事件穿透到下层节点
    
    // 动态创建警察（使用图片精灵）
    this.policeObjects = [] // 存储所有警察对象
    
    for (let i = 0; i < this.policeCount; i++) {
      const policeNode = this.graph.nodes[this.policePositions[i]]
      const policeSprite = this.add.sprite(policeNode.x, policeNode.y, 'police')
      policeSprite.setScale(policeScale)
      policeSprite.setDepth(10)
      // 不设置 interactive，避免拦截节点点击
      // 通过点击节点来选择和移动警察
      
      this.policeObjects.push(policeSprite)
    }
  }
  
  createRestartButton() {
    const button = this.add.rectangle(800, 650, 120, 40, 0x4caf50)
      .setInteractive({ useHandCursor: true })
    
    const buttonText = this.add.text(800, 650, '重新开始', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    button.on('pointerdown', () => {
      this.scene.restart()
    })
    
    button.on('pointerover', () => {
      button.setFillStyle(0x45a049)
    })
    
    button.on('pointerout', () => {
      button.setFillStyle(0x4caf50)
    })
  }
  
  onPoliceClick(policeIndex) {
    if (this.gameState !== 'playing') return
    
    // 检查是否是警察回合
    if (this.currentTurn !== 'police') {
      return
    }
    
    // 选中警察
    this.selectedPolice = policeIndex
    
    // 清除所有警察的高亮效果
    this.policeObjects.forEach(police => {
      police.clearTint()
      police.setScale(this.policeOriginalScale) // 恢复原始大小
    })
    
    // 高亮显示选中的警察（使用色调和缩放）
    this.policeObjects[policeIndex].setTint(0xffff00) // 黄色高亮
    this.policeObjects[policeIndex].setScale(this.policeOriginalScale * 1.2) // 放大20%
    
    // 高亮显示可移动的节点
    this.highlightValidMoves(policeIndex)
    
    this.instructionText.setText('点击相邻的空节点移动警察')
  }
  
  onNodeClick(node) {
    if (this.gameState !== 'playing') return
    
    if (this.currentTurn === 'police') {
      // 检查点击的节点是否有警察
      const policeIndex = this.policePositions.findIndex(pos => pos === node.id)
      
      if (policeIndex !== -1) {
        // 点击了警察所在的节点，选中该警察
        this.onPoliceClick(policeIndex)
      } else if (this.selectedPolice !== null) {
        // 已经选中了警察，尝试移动
        this.movePolice(node)
      }
    }
  }
  
  movePolice(targetNode) {
    const policePosition = this.policePositions[this.selectedPolice]
    
    // 检查是否是相邻节点
    if (!this.isAdjacent(policePosition, targetNode.id)) {
      this.showMessage('只能移动到相邻节点！', 0xff5252)
      return
    }
    
    // 检查目标节点是否被占用
    if (this.isNodeOccupied(targetNode.id)) {
      this.showMessage('该节点已被占用！', 0xff5252)
      return
    }
    
    // 移动警察
    this.policePositions[this.selectedPolice] = targetNode.id
    this.tweens.add({
      targets: this.policeObjects[this.selectedPolice],
      x: targetNode.x,
      y: targetNode.y,
      duration: 300,
      ease: 'Power2'
    })
    
    // 取消选中和高亮
    this.policeObjects.forEach(police => {
      police.clearTint()
      police.setScale(this.policeOriginalScale)
    })
    this.selectedPolice = null
    this.clearHighlightedNodes()
    
    // 警察移动后，切换到小偷回合
    this.time.delayedCall(400, () => {
      this.switchToThiefTurn()
    })
  }
  
  switchToThiefTurn() {
    this.currentTurn = 'thief'
    this.instructionText.setText('小偷思考中...')
    
    // 小偷AI自动移动
    this.time.delayedCall(800, () => {
      this.moveThief()
    })
  }
  
  moveThief() {
    // 获取小偷可以移动的节点
    const possibleMoves = this.getAdjacentNodes(this.thiefPosition)
      .filter(nodeId => !this.isNodeOccupied(nodeId))
    
    if (possibleMoves.length === 0) {
      // 小偷无法移动，游戏结束
      this.endGame('lost')
      return
    }
    
    // 小偷AI：选择最佳移动
    const bestMove = this.chooseBestMoveForThief(possibleMoves)
    const targetNode = this.graph.nodes[bestMove]
    
    // 移动小偷
    this.thiefPosition = bestMove
    this.tweens.add({
      targets: this.thief,
      x: targetNode.x,
      y: targetNode.y,
      duration: 400,
      ease: 'Power2',
      onComplete: () => {
        // 检查小偷是否到达出口
        if (targetNode.type === 'exit') {
          this.endGame('won')
          return
        }
        
        // 切换回警察回合
        this.switchToPoliceTurn()
      }
    })
  }
  
  switchToPoliceTurn() {
    this.currentTurn = 'police'
    this.instructionText.setText('警察回合：点击任意警察，再点击相邻节点移动')
  }
  
  chooseBestMoveForThief(possibleMoves) {
    // 找到出口节点
    const exitNode = this.graph.nodes.find(n => n.type === 'exit')
    
    // 为每个可能的移动计算评分
    let bestMove = possibleMoves[0]
    let bestScore = -Infinity
    
    for (const move of possibleMoves) {
      // 计算到出口的距离
      const distanceToExit = this.calculateDistance(move, exitNode.id)
      
      // 计算到最近警察的距离（遍历所有警察）
      const minPoliceDistance = Math.min(
        ...this.policePositions.map(policePos => 
          this.calculateDistance(move, policePos)
        )
      )
      
      // 综合评分系统：
      // 1. 基础分：优先靠近出口（距离越小越好）
      // 2. 安全分：根据警察距离动态调整权重
      //    - 距离1：非常危险，极高惩罚
      //    - 距离2：危险，高惩罚
      //    - 距离3+：安全，小奖励
      
      let score = -distanceToExit * 10  // 基础分：靠近出口
      
      // 根据警察距离动态调整分数
      if (minPoliceDistance === 1) {
        // 距离1：非常危险，几乎不可选（除非没有其他选择）
        score -= 100
      } else if (minPoliceDistance === 2) {
        // 距离2：危险，大幅降低优先级
        score -= 30
      } else if (minPoliceDistance === 3) {
        // 距离3：稍微谨慎
        score -= 5
      } else {
        // 距离4+：安全，小幅加分
        score += minPoliceDistance * 2
      }
      
      // 如果这个移动的评分更高，选择它
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }
    
    return bestMove
  }
  
  calculateDistance(nodeId1, nodeId2) {
    // 使用BFS计算图中两点的最短路径距离
    const queue = [[nodeId1, 0]]
    const visited = new Set([nodeId1])
    
    while (queue.length > 0) {
      const [currentNode, distance] = queue.shift()
      
      if (currentNode === nodeId2) {
        return distance
      }
      
      const neighbors = this.getAdjacentNodes(currentNode)
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push([neighbor, distance + 1])
        }
      }
    }
    
    return Infinity
  }
  
  isAdjacent(nodeId1, nodeId2) {
    return this.graph.edges.some(([from, to]) => 
      (from === nodeId1 && to === nodeId2) || (from === nodeId2 && to === nodeId1)
    )
  }
  
  getAdjacentNodes(nodeId) {
    const adjacent = []
    this.graph.edges.forEach(([from, to]) => {
      if (from === nodeId) adjacent.push(to)
      if (to === nodeId) adjacent.push(from)
    })
    return adjacent
  }
  
  isNodeOccupied(nodeId) {
    if (nodeId === this.thiefPosition) return true
    return this.policePositions.includes(nodeId)
  }
  
  isThiefTrapped() {
    const possibleMoves = this.getAdjacentNodes(this.thiefPosition)
      .filter(nodeId => !this.isNodeOccupied(nodeId))
    return possibleMoves.length === 0
  }
  
  endGame(result) {
    this.gameState = result
    
    if (result === 'won') {
      // 小偷逃脱 - 警察失败
      this.showMessage('😔 行动失败！小偷逃走了...', 0xff9800, true)
    } else {
      // 警察抓住小偷 - 播放爆炸效果
      this.createExplosionEffect()
      this.time.delayedCall(500, () => {
        this.showMessage('🎉 成功抓捕！小偷已落网！', 0x4caf50, true)
      })
    }
  }
  
  createExplosionEffect() {
    // 隐藏小偷
    this.thief.setVisible(false)
    
    const thiefNode = this.graph.nodes[this.thiefPosition]
    const x = thiefNode.x
    const y = thiefNode.y
    
    // 创建爆炸粒子效果
    const colors = [0xff5252, 0xff9800, 0xffeb3b, 0xffffff]
    const particles = []
    
    // 创建多个爆炸粒子
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20
      const speed = 100 + Math.random() * 100
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      const particle = this.add.circle(x, y, 4 + Math.random() * 4, color)
      particle.setDepth(20)
      particles.push(particle)
      
      // 粒子向外飞散
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0,
        duration: 500 + Math.random() * 300,
        ease: 'Power2',
        onComplete: () => {
          particle.destroy()
        }
      })
    }
    
    // 创建冲击波效果
    for (let i = 0; i < 3; i++) {
      const wave = this.add.circle(x, y, 10, 0xff5252, 0.6)
      wave.setDepth(15)
      wave.setStrokeStyle(3, 0xff9800)
      
      this.tweens.add({
        targets: wave,
        scale: 4 + i * 2,
        alpha: 0,
        duration: 400 + i * 100,
        ease: 'Power2',
        delay: i * 100,
        onComplete: () => {
          wave.destroy()
        }
      })
    }
    
    // 创建闪光效果
    const flash = this.add.circle(x, y, 30, 0xffffff, 0.8)
    flash.setDepth(25)
    this.tweens.add({
      targets: flash,
      scale: 3,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        flash.destroy()
      }
    })
    
    // 添加文字效果
    const boomText = this.add.text(x, y, '💥', {
      fontSize: '48px'
    }).setOrigin(0.5).setDepth(30)
    
    this.tweens.add({
      targets: boomText,
      scale: 2,
      alpha: 0,
      y: y - 50,
      duration: 600,
      ease: 'Back.easeOut',
      onComplete: () => {
        boomText.destroy()
      }
    })
  }
  
  showMessage(text, color, isGameOver = false) {
    if (this.messageText) {
      this.messageText.destroy()
    }
    
    this.messageText = this.add.text(450, isGameOver ? 350 : 620, text, {
      fontSize: isGameOver ? '36px' : '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: Phaser.Display.Color.IntegerToColor(color).rgba,
      padding: { x: 20, y: 10 },
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    if (!isGameOver) {
      this.time.delayedCall(2000, () => {
        if (this.messageText) {
          this.messageText.destroy()
        }
      })
    }
  }
  
  highlightValidMoves(policeIndex) {
    // 清除之前的高亮
    this.clearHighlightedNodes()
    
    // 获取警察位置
    const policePosition = this.policePositions[policeIndex]
    
    // 获取相邻的空节点
    const validMoves = this.getAdjacentNodes(policePosition)
      .filter(nodeId => !this.isNodeOccupied(nodeId))
    
    // 高亮这些节点
    validMoves.forEach(nodeId => {
      const nodeGraphic = this.nodeGraphics.find(ng => ng.node.id === nodeId)
      if (nodeGraphic) {
        const { node, graphics } = nodeGraphic
        
        // 重绘节点为高亮颜色
        graphics.clear()
        if (node.type === 'exit') {
          graphics.fillStyle(0x66bb6a, 1) // 浅绿色
          graphics.lineStyle(5, 0xffeb3b, 1) // 黄色边框
        } else {
          graphics.fillStyle(0x90caf9, 1) // 浅蓝色
          graphics.lineStyle(5, 0xffeb3b, 1) // 黄色边框
        }
        graphics.fillCircle(node.x, node.y, 25)
        graphics.strokeCircle(node.x, node.y, 25)
        
        // 添加到高亮列表
        if (!this.highlightedNodes) {
          this.highlightedNodes = []
        }
        this.highlightedNodes.push(nodeId)
      }
    })
  }
  
  clearHighlightedNodes() {
    if (!this.highlightedNodes) return
    
    // 恢复所有高亮节点的原始样式
    this.highlightedNodes.forEach(nodeId => {
      const nodeGraphic = this.nodeGraphics.find(ng => ng.node.id === nodeId)
      if (nodeGraphic) {
        const { node, graphics } = nodeGraphic
        
        // 重绘为原始颜色
        graphics.clear()
        if (node.type === 'exit') {
          graphics.fillStyle(0x4caf50, 1)
          graphics.lineStyle(4, 0x2e7d32, 1)
        } else {
          graphics.fillStyle(0x64b5f6, 1)
          graphics.lineStyle(3, 0x1976d2, 1)
        }
        graphics.fillCircle(node.x, node.y, 25)
        graphics.strokeCircle(node.x, node.y, 25)
      }
    })
    
    this.highlightedNodes = []
  }
  
  calculateRequiredPolice() {
    // 找到出口节点
    const exitNode = this.graph.nodes.find(n => n.type === 'exit')
    
    // 计算从小偷位置到出口的所有最短路径数量
    const pathsToExit = this.countPathsToExit(this.thiefPosition, exitNode.id)
    
    // 计算图的平均度数（连接数）
    const avgDegree = this.calculateAverageDegree()
    
    // 计算地图的"开放度"（节点数与边数的比例）
    const openness = this.graph.edges.length / this.graph.nodes.length
    
    // 基于多个因素计算所需警察数
    // 1. 路径数量越多，需要更多警察
    // 2. 平均度数越高，需要更多警察
    // 3. 地图越开放，需要更多警察
    let requiredPolice = Math.max(
      2, // 最少2个警察
      Math.ceil(pathsToExit / 3), // 基于路径数
      Math.ceil(avgDegree / 2.5), // 基于平均度数
      Math.ceil(openness / 1.5) // 基于开放度
    )
    
    // 限制最大警察数量（避免太多）
    requiredPolice = Math.min(requiredPolice, 6)
    
    this.policeCount = requiredPolice
    
    // 生成警察的初始位置（战略性分布）
    this.policePositions = this.generatePolicePositions(requiredPolice, exitNode.id)
    
    console.log(`地图分析: 路径数=${pathsToExit}, 平均度=${avgDegree.toFixed(2)}, 开放度=${openness.toFixed(2)}`)
    console.log(`需要 ${requiredPolice} 个警察`)
  }
  
  countPathsToExit(startNode, exitNode) {
    // 使用BFS计算到出口的最短路径长度
    const shortestDist = this.calculateDistance(startNode, exitNode)
    
    // 计算有多少条最短路径
    let pathCount = 0
    const queue = [[startNode, 0, new Set([startNode])]]
    
    while (queue.length > 0) {
      const [currentNode, distance, visited] = queue.shift()
      
      if (currentNode === exitNode && distance === shortestDist) {
        pathCount++
        continue
      }
      
      if (distance >= shortestDist) continue
      
      const neighbors = this.getAdjacentNodes(currentNode)
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          const newVisited = new Set(visited)
          newVisited.add(neighbor)
          queue.push([neighbor, distance + 1, newVisited])
        }
      }
    }
    
    return Math.max(pathCount, 1)
  }
  
  calculateAverageDegree() {
    const degrees = new Array(this.graph.nodes.length).fill(0)
    
    this.graph.edges.forEach(([from, to]) => {
      degrees[from]++
      degrees[to]++
    })
    
    const sum = degrees.reduce((a, b) => a + b, 0)
    return sum / this.graph.nodes.length
  }
  
  generatePolicePositions(count, exitNodeId) {
    const positions = []
    const exitNode = this.graph.nodes[exitNodeId]
    
    // 策略：将警察分布在小偷和出口之间，以及出口附近
    const candidates = []
    
    // 1. 找到靠近出口的节点
    this.graph.nodes.forEach(node => {
      if (node.id === this.thiefPosition || node.id === exitNodeId) return
      
      const distToExit = this.calculateDistance(node.id, exitNodeId)
      const distToThief = this.calculateDistance(node.id, this.thiefPosition)
      
      // 优先选择在小偷和出口之间的节点
      const score = distToExit * 2 + distToThief
      candidates.push({ nodeId: node.id, score, distToExit })
    })
    
    // 按分数排序（分数越小越好）
    candidates.sort((a, b) => a.score - b.score)
    
    // 选择前N个位置，确保它们不会太靠近
    for (const candidate of candidates) {
      if (positions.length >= count) break
      
      // 确保新位置与已有位置保持一定距离
      const tooClose = positions.some(pos => 
        this.calculateDistance(pos, candidate.nodeId) < 2
      )
      
      if (!tooClose) {
        positions.push(candidate.nodeId)
      }
    }
    
    // 如果还不够，随机选择剩余位置
    while (positions.length < count) {
      const randomNode = Math.floor(Math.random() * this.graph.nodes.length)
      if (randomNode !== this.thiefPosition && 
          randomNode !== exitNodeId && 
          !positions.includes(randomNode)) {
        positions.push(randomNode)
      }
    }
    
    return positions
  }
}

