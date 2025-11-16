export default class MilkTeaFinishScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MilkTeaFinishScene' })
  }

  init(data) {
    this.playerChoices = data.playerChoices
    this.customerOrder = data.customerOrder
    this.isCorrect = data.isCorrect
  }

  create() {
    // 设置背景色（小麦色，让内容更清晰）
    this.cameras.main.setBackgroundColor('#F5DEB3')
    
    // 获取实际游戏尺寸并保存为实例变量
    this.gameWidth = this.cameras.main.width
    this.gameHeight = this.cameras.main.height
    this.centerX = this.gameWidth / 2
    this.centerY = this.gameHeight / 2
    
    console.log('=== 游戏尺寸信息 ===')
    console.log('游戏宽度:', this.gameWidth, '高度:', this.gameHeight)
    console.log('中心点:', this.centerX, this.centerY)
    
    // 标题（页面顶部居中 - 使用实际中心点）
    const titleText = this.add.text(this.centerX, 50, '🎉 奶茶做好啦！', {
      fontSize: '44px',
      fontFamily: 'Arial',
      color: '#FF69B4',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5, 0.5).setDepth(300)
    
    console.log('标题位置:', titleText.x, titleText.y, '标题宽度:', titleText.width)
    
    // 左上角返回主菜单按钮
    this.createBackButton()
    
    // 右下角再玩一次按钮（立即创建）
    this.createReplayButton()
    
    // 显示完成的奶茶（左侧，向中间靠拢）
    this.createFinalMilkTea(this.gameWidth * 0.28, this.gameHeight * 0.43)
    
    // 显示订单对比（右侧，向中间靠拢）
    this.showOrderComparison()
    
    // 立即显示结果（客人表情和banner，无延迟）
    if (this.isCorrect) {
      this.showSuccessResult()
    } else {
      this.showFailResult()
    }
  }

  createBackButton() {
    // 返回主菜单按钮（左上角）
    const backButton = this.add.rectangle(100, 30, 160, 40, 0xff9800)
      .setInteractive({ useHandCursor: true })
      .setDepth(200)
    
    const backText = this.add.text(100, 30, '返回主菜单', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(201)
    
    backButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene')
    })
    
    backButton.on('pointerover', () => {
      backButton.setFillStyle(0xf57c00)
      backButton.setScale(1.05)
      backText.setScale(1.05)
    })
    
    backButton.on('pointerout', () => {
      backButton.setFillStyle(0xff9800)
      backButton.setScale(1)
      backText.setScale(1)
    })
  }

  // 辅助函数：创建梯形液体（上宽下窄，匹配杯子形状）
  createTrapezoidLiquid(yCenter, height, color, alpha) {
    const graphics = this.add.graphics()
    
    // 杯子的梯形参数
    const cupTop = -150
    const cupBottom = 150
    const cupHeight = 300
    const topWidth = 180
    const bottomWidth = 120
    
    // 计算液体在杯子中的位置
    const liquidTop = yCenter - height / 2
    const liquidBottom = yCenter + height / 2
    
    // 确保液体不超出杯子范围
    const clampedTop = Math.max(liquidTop, cupTop)
    const clampedBottom = Math.min(liquidBottom, cupBottom)
    
    // 根据Y坐标计算对应的宽度（线性插值）
    const getWidthAtY = (y) => {
      const ratio = (y - cupTop) / cupHeight
      return topWidth - ratio * (topWidth - bottomWidth)
    }
    
    const topHalfWidth = getWidthAtY(clampedTop) / 2
    const bottomHalfWidth = getWidthAtY(clampedBottom) / 2
    
    // 绘制梯形液体
    graphics.fillStyle(color, alpha)
    graphics.beginPath()
    graphics.moveTo(-topHalfWidth, clampedTop)
    graphics.lineTo(topHalfWidth, clampedTop)
    graphics.lineTo(bottomHalfWidth, clampedBottom)
    graphics.lineTo(-bottomHalfWidth, clampedBottom)
    graphics.closePath()
    graphics.fillPath()
    
    return graphics
  }

  createFinalMilkTea(x, y) {
    const container = this.add.container(x, y)
    
    // 绘制杯子（上宽下窄的梯形）
    const cupGraphics = this.add.graphics()
    cupGraphics.lineStyle(4, 0xD3D3D3, 1)
    cupGraphics.beginPath()
    cupGraphics.moveTo(-90, -150)  // 左上角
    cupGraphics.lineTo(90, -150)   // 右上角
    cupGraphics.lineTo(60, 150)    // 右下角
    cupGraphics.lineTo(-60, 150)   // 左下角
    cupGraphics.closePath()
    cupGraphics.strokePath()
    
    cupGraphics.fillStyle(0xFFFFFF, 0.3)
    cupGraphics.beginPath()
    cupGraphics.moveTo(-88, -148)
    cupGraphics.lineTo(88, -148)
    cupGraphics.lineTo(58, 148)
    cupGraphics.lineTo(-58, 148)
    cupGraphics.closePath()
    cupGraphics.fillPath()
    container.add(cupGraphics)
    
    // 添加茶底（梯形液体，留出空间给水果）
    const teaColors = {
      '红茶': 0x8B4513,
      '绿茶': 0x90EE90,
      '乌龙茶': 0xDAA520
    }
    const teaLiquid = this.createTrapezoidLiquid(30, 240, teaColors[this.playerChoices.teaBase], 0.7)
    container.add(teaLiquid)
    
    // 添加配料
    if (this.playerChoices.topping !== '不加料') {
      const color = this.playerChoices.topping === '珍珠' ? 0x000000 : 0xFFFFFF
      for (let i = 0; i < 12; i++) {
        const px = -50 + (i % 4) * 30
        const py = 80 + Math.floor(i / 4) * 15
        const pearl = this.add.circle(px, py, 6, color, 0.8)
        if (this.playerChoices.topping === '椰果') {
          pearl.setStrokeStyle(1, 0x000000, 1)
        }
        container.add(pearl)
      }
    }
    
    // 添加牛奶层（梯形液体，留出空间给水果）
    if (this.playerChoices.milk) {
      const milkColor = this.playerChoices.milk === '全脂牛奶' ? 0xFFFAF0 : 0xF0F8FF
      const milkAlpha = this.playerChoices.milk === '全脂牛奶' ? 0.6 : 0.4
      const milk = this.createTrapezoidLiquid(30, 240, milkColor, milkAlpha)
      container.add(milk)
    }
    
    // 添加水果（均匀分散在上层）
    const fruitColors = {
      '苹果': 0xFF6347,
      '草莓': 0xFF1493,
      '葡萄': 0x9370DB
    }
    
    // 为每种水果定义固定位置（上层区域）
    const fruitPositions = [
      { x: -50, y: -80 },  // 左上
      { x: 50, y: -80 },   // 右上
      { x: -30, y: -60 },  // 左中上
      { x: 30, y: -60 },   // 右中上
      { x: 0, y: -70 }     // 中央上
    ]
    
    this.playerChoices.fruits.forEach((fruit, fruitIndex) => {
      for (let i = 0; i < 5; i++) {
        const pos = fruitPositions[i]
        // 为不同水果添加偏移，避免重叠
        const offsetX = fruitIndex * 10
        const offsetY = fruitIndex * 5
        const fx = pos.x + offsetX + (Math.random() - 0.5) * 10
        const fy = pos.y + offsetY + (Math.random() - 0.5) * 8
        const fruitPiece = this.add.circle(fx, fy, 8, fruitColors[fruit], 0.9)
        container.add(fruitPiece)
      }
    })
    
    // 添加吸管（加粗，上面露出更多）
    const straw = this.add.rectangle(40, -30, 18, 220, 0xFF69B4, 1)
    container.add(straw)
    const strawTop = this.add.rectangle(40, -145, 18, 40, 0xFF1493, 1)
    container.add(strawTop)
    
    // 标签
    this.add.text(x, y + 180, '你的作品', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#8B4513',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(100)
  }

  showOrderComparison() {
    // 使用相对位置（向中间靠拢）
    const bgX = this.gameWidth * 0.68  // 右侧68%位置（从78%调整）
    const bgY = this.gameHeight * 0.40  // 垂直40%位置
    const bgWidth = this.gameWidth * 0.42  // 宽度42%
    const bgHeight = this.gameHeight * 0.46  // 高度46%
    
    const startX = this.gameWidth * 0.48  // 从58%调整到48%
    const startY = this.gameHeight * 0.20
    const lineHeight = this.gameHeight * 0.057
    
    // 背景框
    const comparisonBg = this.add.rectangle(bgX, bgY, bgWidth, bgHeight, 0xFFFFFF, 0.9)
    comparisonBg.setStrokeStyle(3, 0xFF69B4, 1)
    comparisonBg.setDepth(90)
    
    const comparisonTitle = this.add.text(bgX, startY, '订单对比', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#FF69B4',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(100)
    
    let yPos = startY + 40
    
    // 茶底对比
    const teaMatch = this.customerOrder.teaBase === this.playerChoices.teaBase
    this.createComparisonItem(
      startX, yPos,
      '🍵 茶底',
      this.customerOrder.teaBase,
      this.playerChoices.teaBase,
      teaMatch
    )
    yPos += lineHeight
    
    // 水果对比
    const fruitsMatch = this.arraysEqual(this.customerOrder.fruits, this.playerChoices.fruits)
    const orderFruits = this.customerOrder.fruits.length > 0 ? this.customerOrder.fruits.join('、') : '不加'
    const playerFruits = this.playerChoices.fruits.length > 0 ? this.playerChoices.fruits.join('、') : '不加'
    this.createComparisonItem(
      startX, yPos,
      '🍓 水果',
      orderFruits,
      playerFruits,
      fruitsMatch
    )
    yPos += lineHeight
    
    // 配料对比
    const toppingMatch = this.customerOrder.topping === this.playerChoices.topping
    this.createComparisonItem(
      startX, yPos,
      '🧊 配料',
      this.customerOrder.topping,
      this.playerChoices.topping,
      toppingMatch
    )
    yPos += lineHeight
    
    // 糖度对比
    const sugarMatch = this.customerOrder.sugar === this.playerChoices.sugar
    this.createComparisonItem(
      startX, yPos,
      '🍬 糖度',
      this.customerOrder.sugar,
      this.playerChoices.sugar,
      sugarMatch
    )
    yPos += lineHeight
    
    // 牛奶对比
    const milkMatch = this.customerOrder.milk === this.playerChoices.milk
    this.createComparisonItem(
      startX, yPos,
      '🥛 牛奶',
      this.customerOrder.milk,
      this.playerChoices.milk,
      milkMatch
    )
    yPos += lineHeight
    
    // 如果失败，显示提示文字
    if (!this.isCorrect) {
      this.add.text(bgX, yPos + 20, '再仔细看看订单需求吧...', {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#FF6B6B',
        fontStyle: 'bold',
        stroke: '#ffffff',
        strokeThickness: 3
      }).setOrigin(0.5, 0).setDepth(100)
    }
  }

  createComparisonItem(x, y, label, orderValue, playerValue, isMatch) {
    // 标签
    this.add.text(x, y, label, {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#8B4513',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5).setDepth(100)
    
    // 订单要求
    this.add.text(x + 90, y, orderValue, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#666666'
    }).setOrigin(0, 0.5).setDepth(100)
    
    // 对比符号和玩家选择
    if (isMatch) {
      // 打勾 ✓
      this.add.text(x + 220, y, '✓', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#4CAF50',
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(100)
    } else {
      // 打叉 ✗
      this.add.text(x + 220, y, '✗', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#F44336',
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(100)
      
      // 显示玩家的错误选择
      this.add.text(x + 250, y, playerValue, {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#F44336',
        fontStyle: 'bold'
      }).setOrigin(0, 0.5).setDepth(100)
    }
  }

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false
    const sorted1 = [...arr1].sort()
    const sorted2 = [...arr2].sort()
    return sorted1.every((val, index) => val === sorted2[index])
  }

  showSuccessResult() {
    // 客人满意的笑脸动画（左下角）
    const faceX = this.gameWidth * 0.28
    const faceY = this.gameHeight * 0.77
    const happyFace = this.add.circle(faceX, faceY, 40, 0xFFD700, 1)
    happyFace.setStrokeStyle(3, 0xFF8C00, 1)
    happyFace.setScale(0).setDepth(200)
    
    // 眼睛
    const leftEye = this.add.circle(faceX - 15, faceY - 10, 5, 0x000000, 1).setScale(0).setDepth(201)
    const rightEye = this.add.circle(faceX + 15, faceY - 10, 5, 0x000000, 1).setScale(0).setDepth(201)
    
    // 笑脸嘴巴
    const smileGraphics = this.add.graphics().setDepth(201).setAlpha(0)
    smileGraphics.lineStyle(3, 0x000000, 1)
    smileGraphics.arc(faceX, faceY, 20, 0.3, Math.PI - 0.3, false)
    smileGraphics.strokePath()
    
    // 笑脸动画
    this.tweens.add({
      targets: happyFace,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut'
    })
    
    this.tweens.add({
      targets: [leftEye, rightEye],
      scale: 1,
      duration: 500,
      delay: 200,
      ease: 'Back.easeOut'
    })
    
    this.tweens.add({
      targets: smileGraphics,
      alpha: 1,
      duration: 300,
      delay: 400
    })
    
    // 客人满意文字
    this.add.text(faceX, faceY + 60, '客人很满意！', {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#4CAF50',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(200).setAlpha(0)
    
    this.tweens.add({
      targets: this.children.list[this.children.list.length - 1],
      alpha: 1,
      duration: 500,
      delay: 800
    })
    
    // 同时显示教育意义（不延迟）
    this.showSkills()
  }

  showFailResult() {
    // 客人不满意的表情动画（左下角）
    const faceX = this.gameWidth * 0.28
    const faceY = this.gameHeight * 0.77
    const sadFace = this.add.circle(faceX, faceY, 40, 0xFFA500, 1)
    sadFace.setStrokeStyle(3, 0xFF8C00, 1)
    sadFace.setScale(0).setDepth(200)
    
    // 眼睛
    const leftEye = this.add.circle(faceX - 15, faceY - 10, 5, 0x000000, 1).setScale(0).setDepth(201)
    const rightEye = this.add.circle(faceX + 15, faceY - 10, 5, 0x000000, 1).setScale(0).setDepth(201)
    
    // 不开心的嘴巴
    const sadGraphics = this.add.graphics().setDepth(201).setAlpha(0)
    sadGraphics.lineStyle(3, 0x000000, 1)
    sadGraphics.arc(faceX, faceY + 25, 20, 1.3 * Math.PI, 1.7 * Math.PI, false)
    sadGraphics.strokePath()
    
    // 表情动画
    this.tweens.add({
      targets: sadFace,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut'
    })
    
    this.tweens.add({
      targets: [leftEye, rightEye],
      scale: 1,
      duration: 500,
      delay: 200,
      ease: 'Back.easeOut'
    })
    
    this.tweens.add({
      targets: sadGraphics,
      alpha: 1,
      duration: 300,
      delay: 400
    })
    
    // 客人不满意文字（同时出现，不延迟）
    this.add.text(faceX, faceY + 60, '客人不太满意...', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FF9800',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(200).setAlpha(0)
    
    this.tweens.add({
      targets: this.children.list[this.children.list.length - 1],
      alpha: 1,
      duration: 500,
      delay: 800
    })
  }

  showSkills() {
    // 只有全对时才显示教育意义
    if (!this.isCorrect) return
    
    // Banner背景（向上向左移动，避免被按钮遮挡）
    const bannerX = this.gameWidth * 0.68  // 从78%向左到68%
    const bannerY = this.gameHeight * 0.75  // 从83%向上到75%
    const bannerWidth = this.gameWidth * 0.42
    const bannerHeight = this.gameHeight * 0.23
    
    const bannerBg = this.add.rectangle(bannerX, bannerY, bannerWidth, bannerHeight, 0x000000, 0.8)
    bannerBg.setDepth(150)
    
    const bannerBorder = this.add.rectangle(bannerX, bannerY, bannerWidth, bannerHeight)
    bannerBorder.setStrokeStyle(4, 0xFFD700, 1)
    bannerBorder.setDepth(151)
    
    const skillTitle = this.add.text(bannerX, bannerY - bannerHeight * 0.35, '🎓 作为奶茶大师，你学会了：', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(160)
    
    const skills = [
      '✨ 按步骤操作完成任务',
      '✨ 理解配方的重要性',
      '✨ 培养专注和细心'
    ]
    
    skills.forEach((skill, index) => {
      const skillText = this.add.text(bannerX, bannerY - bannerHeight * 0.15 + index * 32, skill, {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5).setAlpha(0).setDepth(160)
      
      this.tweens.add({
        targets: skillText,
        alpha: 1,
        duration: 400,
        delay: 200 + index * 200
      })
    })
  }

  createReplayButton() {
    // 按钮尺寸
    const buttonWidth = 180
    const buttonHeight = 55
    
    // 计算右下角位置（留出边距）
    const buttonX = this.gameWidth - buttonWidth / 2 - 20  // 右边距20px
    const buttonY = this.gameHeight - buttonHeight / 2 - 20  // 下边距20px
    
    // 根据是否成功显示不同文字
    const buttonText = this.isCorrect ? '再玩一次' : '重新制作'
    
    const replayButton = this.add.rectangle(buttonX, buttonY, buttonWidth, buttonHeight, 0x4caf50)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999)
      .setVisible(true)
      .setAlpha(1)
    
    const replayText = this.add.text(buttonX, buttonY, buttonText, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(10000).setVisible(true).setAlpha(1)
    
    replayButton.on('pointerdown', () => {
      if (this.isCorrect) {
        // 成功：重新生成订单，显示订单页面
        console.log('成功后再玩一次：传入 keepOrder=false，将生成新订单')
        this.scene.start('MilkTeaGameScene', { 
          keepOrder: false  // 明确标记不保留订单
        })
      } else {
        // 失败：保留当前订单，跳过订单页面直接制作
        console.log('失败后重新制作：传入 keepOrder=true 和原订单')
        this.scene.start('MilkTeaGameScene', { 
          keepOrder: true, 
          customerOrder: this.customerOrder 
        })
      }
    })
    
    replayButton.on('pointerover', () => {
      replayButton.setFillStyle(0x45a049)
      replayButton.setScale(1.05)
      replayText.setScale(1.05)
    })
    
    replayButton.on('pointerout', () => {
      replayButton.setFillStyle(0x4caf50)
      replayButton.setScale(1)
      replayText.setScale(1)
    })
  }
}

