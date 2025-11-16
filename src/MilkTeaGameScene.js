export default class MilkTeaGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MilkTeaGameScene' })
  }

  init(data) {
    // 游戏状态
    this.currentStep = 0 // 0=显示订单, 1=小料, 2=糖度, 3=茶底, 4=牛奶, 5=水果, 6=完成
    
    // 玩家选择
    this.playerChoices = {
      teaBase: null,      // 茶底
      fruits: [],         // 水果（可多选）
      topping: null,      // 配料
      sugar: null,        // 糖度
      milk: null          // 牛奶类型
    }
    
    // 客人订单（如果传入了保留订单标志，则使用传入的订单，否则随机生成）
    // 严格检查：只有 keepOrder 明确为 true 且有 customerOrder 时才保留订单
    if (data && data.keepOrder === true && data.customerOrder) {
      // 失败后重新制作：保留订单，跳过订单显示
      this.customerOrder = data.customerOrder
      this.skipOrderDisplay = true
      console.log('保留订单，跳过订单页面', this.customerOrder)
    } else {
      // 成功后再玩一次 或 首次进入：生成新订单，显示订单页面
      this.customerOrder = this.generateOrder()
      this.skipOrderDisplay = false
      console.log('生成新订单，显示订单页面', this.customerOrder)
    }
  }

  preload() {
    // 暂时不需要加载图片
  }

  create() {
    // 设置背景色（调深一些，让牛奶液体更明显）
    this.cameras.main.setBackgroundColor('#F5DEB3') // 从米黄色(#FFF8DC)改为小麦色(#F5DEB3)
    
    // 左上角返回按钮
    this.createMenuButton()
    
    // 右上角查看订单按钮
    this.createViewOrderButton()
    
    // 顶部标题
    this.stageTitle = this.add.text(450, 40, '', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#8B4513',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(1000)
    
    // 创建杯子（不再使用容器，直接设置深度）
    this.createCup()
    
    // 如果是失败后重新制作，直接跳到第一步
    if (this.skipOrderDisplay) {
      // 显示查看订单按钮
      this.viewOrderButton.setVisible(true)
      this.viewOrderText.setVisible(true)
      // 直接开始第一步：选择小料
      this.startStep1_Topping()
    } else {
      // 正常流程：显示客人订单
      this.showCustomerOrder()
    }
  }

  createMenuButton() {
    const menuButton = this.add.rectangle(80, 30, 140, 40, 0xff9800)
      .setInteractive({ useHandCursor: true })
      .setDepth(2000)
    
    const menuText = this.add.text(80, 30, '返回主菜单', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2001)
    
    menuButton.on('pointerdown', () => {
      this.scene.start('MilkTeaMenuScene')
    })
    
    menuButton.on('pointerover', () => {
      menuButton.setFillStyle(0xf57c00)
    })
    
    menuButton.on('pointerout', () => {
      menuButton.setFillStyle(0xff9800)
    })
  }

  createViewOrderButton() {
    this.viewOrderButton = this.add.rectangle(820, 30, 140, 40, 0x4CAF50)
      .setInteractive({ useHandCursor: true })
      .setDepth(2000)
      .setVisible(false) // 初始隐藏
    
    this.viewOrderText = this.add.text(820, 30, '📋 查看订单', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2001)
      .setVisible(false) // 初始隐藏
    
    this.viewOrderButton.on('pointerdown', () => {
      this.showOrderPopup()
    })
    
    this.viewOrderButton.on('pointerover', () => {
      this.viewOrderButton.setFillStyle(0x45A049)
      this.viewOrderButton.setScale(1.05)
      this.viewOrderText.setScale(1.05)
    })
    
    this.viewOrderButton.on('pointerout', () => {
      this.viewOrderButton.setFillStyle(0x4CAF50)
      this.viewOrderButton.setScale(1)
      this.viewOrderText.setScale(1)
    })
  }

  showOrderPopup() {
    // 如果已经有订单弹窗，不重复显示
    if (this.orderPopup) return
    
    // 创建半透明背景遮罩
    const overlay = this.add.rectangle(450, 350, 900, 700, 0x000000, 0.5)
      .setDepth(3000)
    
    // 创建订单卡片背景
    const orderBg = this.add.rectangle(450, 350, 350, 400, 0xFFFFFF, 0.98)
      .setDepth(3001)
    orderBg.setStrokeStyle(4, 0xFFB6C1, 1)
    
    // 订单标题
    const orderTitle = this.add.text(450, 200, '🎯 客人的订单', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#FF69B4',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(3002)
    
    // 订单内容
    let yPos = 250
    const items = [
      `🧊 配料：${this.customerOrder.topping}`,
      `🍬 糖度：${this.customerOrder.sugar}`,
      `🍵 茶底：${this.customerOrder.teaBase}`,
      `🥛 牛奶：${this.customerOrder.milk}`,
      `🍓 水果：${this.customerOrder.fruits.length > 0 ? this.customerOrder.fruits.join('、') : '不加'}`
    ]
    
    const orderTexts = []
    items.forEach(item => {
      const text = this.add.text(450, yPos, item, {
        fontSize: '22px',
        fontFamily: 'Arial',
        color: '#8B4513',
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(3002)
      orderTexts.push(text)
      yPos += 40
    })
    
    // 提示文字
    const hintText = this.add.text(450, 480, '2秒后自动关闭...', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#999999',
      fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(3002)
    
    // 保存所有弹窗元素
    this.orderPopup = {
      overlay,
      orderBg,
      orderTitle,
      orderTexts,
      hintText
    }
    
    // 入场动画
    orderBg.setScale(0)
    this.tweens.add({
      targets: orderBg,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut'
    })
    
    orderTitle.setAlpha(0)
    orderTexts.forEach(text => text.setAlpha(0))
    hintText.setAlpha(0)
    
    this.tweens.add({
      targets: [orderTitle, ...orderTexts, hintText],
      alpha: 1,
      duration: 300,
      delay: 150
    })
    
    // 2秒后自动关闭
    this.time.delayedCall(2000, () => {
      this.hideOrderPopup()
    })
  }

  hideOrderPopup() {
    if (!this.orderPopup) return
    
    // 出场动画
    this.tweens.add({
      targets: [
        this.orderPopup.overlay,
        this.orderPopup.orderBg,
        this.orderPopup.orderTitle,
        ...this.orderPopup.orderTexts,
        this.orderPopup.hintText
      ],
      alpha: 0,
      duration: 300,
      ease: 'Sine.easeIn',
      onComplete: () => {
        // 销毁所有元素
        this.orderPopup.overlay.destroy()
        this.orderPopup.orderBg.destroy()
        this.orderPopup.orderTitle.destroy()
        this.orderPopup.orderTexts.forEach(text => text.destroy())
        this.orderPopup.hintText.destroy()
        this.orderPopup = null
      }
    })
  }

  generateOrder() {
    const teaBases = ['红茶', '绿茶', '乌龙茶']
    const fruits = ['苹果', '草莓', '葡萄']
    const toppings = ['珍珠', '椰果', '不加料']
    const sugars = ['全糖', '半糖', '无糖']
    const milks = ['全脂牛奶', '脱脂牛奶']
    
    // 随机选择水果（0-2种）
    const fruitCount = Phaser.Math.Between(0, 2)
    const selectedFruits = []
    const shuffledFruits = Phaser.Utils.Array.Shuffle([...fruits])
    for (let i = 0; i < fruitCount; i++) {
      selectedFruits.push(shuffledFruits[i])
    }
    
    return {
      teaBase: Phaser.Utils.Array.GetRandom(teaBases),
      fruits: selectedFruits,
      topping: Phaser.Utils.Array.GetRandom(toppings),
      sugar: Phaser.Utils.Array.GetRandom(sugars),
      milk: Phaser.Utils.Array.GetRandom(milks)
    }
  }

  showCustomerOrder() {
    this.currentStep = 0
    this.stageTitle.setText('📋 客人的订单')
    
    // 显示订单卡片
    const orderBg = this.add.rectangle(600, 350, 350, 400, 0xFFFFFF, 0.95)
    orderBg.setStrokeStyle(4, 0xFFB6C1, 1)
    orderBg.setDepth(100)
    
    const orderTitle = this.add.text(600, 200, '🎯 客人想要：', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#FF69B4',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(101)
    
    let yPos = 250
    // 按照实际制作顺序：小料 → 糖 → 茶底 → 牛奶 → 水果
    const items = [
      `🧊 配料：${this.customerOrder.topping}`,
      `🍬 糖度：${this.customerOrder.sugar}`,
      `🍵 茶底：${this.customerOrder.teaBase}`,
      `🥛 牛奶：${this.customerOrder.milk}`,
      `🍓 水果：${this.customerOrder.fruits.length > 0 ? this.customerOrder.fruits.join('、') : '不加'}`
    ]
    
    items.forEach(item => {
      this.add.text(600, yPos, item, {
        fontSize: '22px',
        fontFamily: 'Arial',
        color: '#8B4513',
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(101)
      yPos += 40
    })
    
    // 开始制作按钮
    const startBtn = this.add.rectangle(600, 500, 180, 60, 0x4CAF50)
      .setInteractive({ useHandCursor: true })
      .setDepth(101)
    
    const startText = this.add.text(600, 500, '开始制作', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(102)
    
    startBtn.on('pointerdown', () => {
      // 先收集需要删除的订单文字
      const orderTexts = []
      this.children.list.forEach(child => {
        if (child.depth === 101 && child.type === 'Text') {
          orderTexts.push(child)
        }
      })
      
      // 删除所有订单元素
      orderBg.destroy()
      orderTitle.destroy()
      startBtn.destroy()
      startText.destroy()
      orderTexts.forEach(text => {
        if (text && text.active) {
          text.destroy()
        }
      })
      
      // 显示"查看订单"按钮
      if (this.viewOrderButton && this.viewOrderText) {
        this.viewOrderButton.setVisible(true)
        this.viewOrderText.setVisible(true)
      }
      
      this.startStep1_Topping() // 新顺序：先选小料
    })
    
    startBtn.on('pointerover', () => {
      startBtn.setFillStyle(0x45A049)
      startBtn.setScale(1.05)
      startText.setScale(1.05)
    })
    
    startBtn.on('pointerout', () => {
      startBtn.setFillStyle(0x4CAF50)
      startBtn.setScale(1)
      startText.setScale(1)
    })
  }

  createCup() {
    // 绘制透明塑料杯（上宽下窄的梯形）
    // 分两层：背景填充（深度3）和轮廓线（深度8）
    
    // 第一层：杯子背景（半透明白色，在液体后面）
    this.cupBg = this.add.graphics()
    this.cupBg.fillStyle(0xFFFFFF, 0.3)
    this.cupBg.beginPath()
    this.cupBg.moveTo(-88, -148)
    this.cupBg.lineTo(88, -148)
    this.cupBg.lineTo(58, 148)
    this.cupBg.lineTo(-58, 148)
    this.cupBg.closePath()
    this.cupBg.fillPath()
    this.cupBg.setDepth(3) // 在液体后面
    this.cupBg.setPosition(300, 400)
    
    // 第二层：杯子轮廓（在液体前面）
    this.cupOutline = this.add.graphics()
    this.cupOutline.lineStyle(4, 0xD3D3D3, 1)
    this.cupOutline.beginPath()
    this.cupOutline.moveTo(-90, -150)  // 左上角（更宽）
    this.cupOutline.lineTo(90, -150)   // 右上角
    this.cupOutline.lineTo(60, 150)    // 右下角（更窄）
    this.cupOutline.lineTo(-60, 150)   // 左下角
    this.cupOutline.closePath()
    this.cupOutline.strokePath()
    this.cupOutline.setDepth(8) // 在液体和水果前面
    this.cupOutline.setPosition(300, 400)
    
    // 创建液体容器（用于后续填充）
    this.liquidContainer = this.add.container(300, 400)
    this.liquidContainer.setDepth(5)
    
    // 创建配料容器
    this.toppingContainer = this.add.container(300, 400)
    this.toppingContainer.setDepth(6)
    
    // 创建水果容器
    this.fruitContainer = this.add.container(300, 400)
    this.fruitContainer.setDepth(7)
  }

  // 辅助函数：创建梯形液体（上宽下窄，匹配杯子形状）
  createTrapezoidLiquid(yCenter, height, color, alpha) {
    console.log('创建梯形液体 - yCenter:', yCenter, 'height:', height, 'color:', color.toString(16), 'alpha:', alpha)
    
    const graphics = this.add.graphics()
    
    // 杯子的梯形参数：顶部宽度180px（-90到90），底部宽度120px（-60到60）
    // 杯子高度300px（-150到150）
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
    
    console.log('液体范围 - top:', clampedTop, 'bottom:', clampedBottom)
    
    // 根据Y坐标计算对应的宽度（线性插值）
    const getWidthAtY = (y) => {
      const ratio = (y - cupTop) / cupHeight
      return topWidth - ratio * (topWidth - bottomWidth)
    }
    
    const topHalfWidth = getWidthAtY(clampedTop) / 2
    const bottomHalfWidth = getWidthAtY(clampedBottom) / 2
    
    console.log('液体宽度 - top:', topHalfWidth * 2, 'bottom:', bottomHalfWidth * 2)
    
    // 绘制梯形液体
    graphics.fillStyle(color, alpha)
    graphics.beginPath()
    graphics.moveTo(-topHalfWidth, clampedTop)
    graphics.lineTo(topHalfWidth, clampedTop)
    graphics.lineTo(bottomHalfWidth, clampedBottom)
    graphics.lineTo(-bottomHalfWidth, clampedBottom)
    graphics.closePath()
    graphics.fillPath()
    
    console.log('液体graphics创建完成，alpha:', graphics.alpha)
    
    return graphics
  }

  // Step 3: 茶底
  startStep3_TeaBase() {
    this.currentStep = 3
    this.stageTitle.setText('🍵 第3步: 选择茶底')
    
    this.createChoiceButtons(
      ['红茶', '绿茶', '乌龙茶'],
      ['#CD5C5C', '#32CD32', '#FFA500'], // 印度红、酸橙绿、橙色
      (choice) => {
        this.playerChoices.teaBase = choice
        this.addTeaBase(choice)
        this.startStep4_Milk()
      }
    )
  }

  // Step 5: 水果（最后加）
  startStep5_Fruits() {
    this.currentStep = 5
    this.stageTitle.setText('🍓 第5步: 选择水果（可选0-2种）')
    
    this.playerChoices.fruits = []
    
    const fruitOptions = ['苹果', '草莓', '葡萄']
    const fruitColors = ['#FF6347', '#FF1493', '#9370DB']
    const fruitIcons = ['🍎', '🍓', '🍇'] // 水果图标
    
    // 创建水果选择按钮
    fruitOptions.forEach((fruit, index) => {
      const yPos = 250 + index * 100
      const color = Phaser.Display.Color.HexStringToColor(fruitColors[index]).color
      
      // 创建按钮背景（更大更醒目）
      const btn = this.add.rectangle(600, yPos, 280, 75, color)
        .setInteractive({ useHandCursor: true })
        .setDepth(100)
      
      // 添加白色边框
      const border = this.add.rectangle(600, yPos, 280, 75)
        .setStrokeStyle(4, 0xFFFFFF, 1)
        .setDepth(100)
      
      // 添加水果图标
      const icon = this.add.text(520, yPos, fruitIcons[index], {
        fontSize: '36px',
        fontFamily: 'Arial'
      }).setOrigin(0.5).setDepth(101)
      
      // 添加水果文字
      const text = this.add.text(620, yPos, fruit, {
        fontSize: '28px',
        fontFamily: 'Arial',
        color: '#FFFFFF',
        fontStyle: 'normal', // 不使用粗体
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5).setDepth(101)
      
      btn.setData('selected', false)
      btn.setData('text', text)
      btn.setData('icon', icon)
      btn.setData('border', border)
      btn.setData('fruit', fruit)
      btn.setData('fruitPieces', []) // 存储该水果的所有切片
      btn.setData('originalColor', color)
      
      btn.on('pointerdown', () => {
        const isSelected = btn.getData('selected')
        
        if (isSelected) {
          // 取消选择 - 移除水果
          btn.setData('selected', false)
          btn.setFillStyle(color)
          btn.setAlpha(1)
          text.setAlpha(1)
          icon.setAlpha(1)
          border.setAlpha(1)
          this.playerChoices.fruits = this.playerChoices.fruits.filter(f => f !== fruit)
          
          // 移除该水果的所有切片
          const fruitPieces = btn.getData('fruitPieces')
          fruitPieces.forEach(piece => {
            if (piece && piece.active) {
              piece.destroy()
            }
          })
          btn.setData('fruitPieces', [])
        } else {
          // 选择（最多2个）- 添加水果
          if (this.playerChoices.fruits.length < 2) {
            btn.setData('selected', true)
            btn.setFillStyle(0x00FF00) // 选中后变绿色
            btn.setAlpha(0.8)
            text.setAlpha(1)
            // text.setColor('#000000') // 移除：不改变文字颜色，保持白色
            icon.setAlpha(1)
            border.setAlpha(0.8)
            this.playerChoices.fruits.push(fruit)
            
            // 立即添加水果到杯子
            const pieces = this.addSingleFruit(fruit)
            btn.setData('fruitPieces', pieces)
          }
        }
      })
      
      btn.on('pointerover', () => {
        if (!btn.getData('selected')) {
          btn.setScale(1.15)
          border.setScale(1.15)
          text.setScale(1.15)
          icon.setScale(1.15)
          // 添加发光效果
          btn.setFillStyle(Phaser.Display.Color.GetColor(
            Math.min(255, Phaser.Display.Color.GetColor32(color).red + 30),
            Math.min(255, Phaser.Display.Color.GetColor32(color).green + 30),
            Math.min(255, Phaser.Display.Color.GetColor32(color).blue + 30)
          ))
        }
      })
      
      btn.on('pointerout', () => {
        if (!btn.getData('selected')) {
          btn.setScale(1)
          border.setScale(1)
          text.setScale(1)
          icon.setScale(1)
          btn.setFillStyle(color)
        }
      })
    })
    
    // 下一步按钮（向下移动，避免遮挡水果按钮）
    const nextBtn = this.add.rectangle(600, 580, 180, 60, 0x4CAF50)
      .setInteractive({ useHandCursor: true })
      .setDepth(100)
    
    const nextText = this.add.text(600, 580, '下一步', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(101)
    
    nextBtn.on('pointerdown', () => {
      // 清除所有选择界面（水果已经在杯子里了，不需要再添加）
      this.clearChoiceUI()
      
      this.completeGame() // 水果是最后一步，完成游戏
    })
    
    nextBtn.on('pointerover', () => {
      nextBtn.setFillStyle(0x45A049)
      nextBtn.setScale(1.05)
      nextText.setScale(1.05)
    })
    
    nextBtn.on('pointerout', () => {
      nextBtn.setFillStyle(0x4CAF50)
      nextBtn.setScale(1)
      nextText.setScale(1)
    })
  }

  // Step 1: 小料
  startStep1_Topping() {
    this.currentStep = 1
    this.stageTitle.setText('🧊 第1步: 选择配料')
    
    this.createChoiceButtons(
      ['珍珠', '椰果', '不加料'],
      ['#8B4513', '#F5DEB3', '#FFB6C1'], // 棕色、小麦色、粉色
      (choice) => {
        this.playerChoices.topping = choice
        this.addTopping(choice)
        this.startStep2_Sugar()
      }
    )
  }

  // Step 2: 糖度
  startStep2_Sugar() {
    this.currentStep = 2
    this.stageTitle.setText('🍬 第2步: 选择糖度')
    
    this.createChoiceButtons(
      ['全糖', '半糖', '无糖'],
      ['#FF69B4', '#FFD700', '#87CEEB'], // 亮粉色、金色、天蓝色
      (choice) => {
        this.playerChoices.sugar = choice
        this.startStep3_TeaBase()
      }
    )
  }

  // Step 4: 牛奶
  startStep4_Milk() {
    this.currentStep = 4
    this.stageTitle.setText('🥛 第4步: 选择牛奶')
    
    this.createChoiceButtons(
      ['全脂牛奶', '脱脂牛奶'],
      ['#FFF8DC', '#E0FFFF'], // 玉米丝色、淡青色
      (choice) => {
        this.playerChoices.milk = choice
        this.addMilkWithMixing(choice)
      }
    )
  }

  createChoiceButtons(choices, colors, callback) {
    // 为不同选项定义图标
    const iconMap = {
      // 配料图标
      '珍珠': '⚫',
      '椰果': '⚪',
      '不加料': '🚫',
      // 糖度图标
      '全糖': '🍬',
      '半糖': '🍭',
      '无糖': '❌',
      // 茶底图标
      '红茶': '🍵',
      '绿茶': '🍃',
      '乌龙茶': '☕',
      // 牛奶图标
      '全脂牛奶': '🥛',
      '脱脂牛奶': '🧴'
    }
    
    choices.forEach((choice, index) => {
      const color = Phaser.Display.Color.HexStringToColor(colors[index]).color
      const yPos = 250 + index * 100
      
      // 创建按钮背景（圆角矩形效果）
      const btn = this.add.rectangle(600, yPos, 280, 75, color)
        .setInteractive({ useHandCursor: true })
        .setDepth(100)
      
      // 添加白色边框
      const border = this.add.rectangle(600, yPos, 280, 75)
        .setStrokeStyle(4, 0xFFFFFF, 1)
        .setDepth(100)
      
      // 添加图标
      const icon = iconMap[choice] || '✨'
      const iconText = this.add.text(520, yPos, icon, {
        fontSize: '36px',
        fontFamily: 'Arial'
      }).setOrigin(0.5).setDepth(101)
      
      // 添加选项文字
      const text = this.add.text(620, yPos, choice, {
        fontSize: '28px',
        fontFamily: 'Arial',
        color: '#FFFFFF',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5).setDepth(101)
      
      // 点击事件
      btn.on('pointerdown', () => {
        this.clearChoiceUI()
        callback(choice)
      })
      
      // 悬停效果 - 更明显的缩放和发光
      btn.on('pointerover', () => {
        btn.setScale(1.15)
        border.setScale(1.15)
        text.setScale(1.15)
        iconText.setScale(1.15)
        // 添加发光效果
        btn.setFillStyle(Phaser.Display.Color.GetColor(
          Math.min(255, Phaser.Display.Color.GetColor32(color).red + 30),
          Math.min(255, Phaser.Display.Color.GetColor32(color).green + 30),
          Math.min(255, Phaser.Display.Color.GetColor32(color).blue + 30)
        ))
      })
      
      btn.on('pointerout', () => {
        btn.setScale(1)
        border.setScale(1)
        text.setScale(1)
        iconText.setScale(1)
        btn.setFillStyle(color)
      })
    })
  }

  clearChoiceUI() {
    // 清除所有深度100-102的UI元素
    // 先收集需要删除的元素，再统一删除
    const toDestroy = []
    this.children.list.forEach(child => {
      if (child.depth >= 100 && child.depth <= 102) {
        toDestroy.push(child)
      }
    })
    toDestroy.forEach(child => {
      if (child && child.active) {
        child.destroy()
      }
    })
  }

  addTeaBase(teaBase) {
    const colors = {
      '红茶': 0x8B4513,
      '绿茶': 0x90EE90,
      '乌龙茶': 0xDAA520
    }
    
    // 保存茶底颜色，用于后续混合
    this.teaBaseColor = colors[teaBase]
    console.log('添加茶底:', teaBase, '颜色:', this.teaBaseColor.toString(16))
    
    // 使用梯形液体，直接使用最终alpha值（Graphics不支持alpha tween）
    // 茶底高度120px，中心在y=90（接近杯底）
    const liquid = this.createTrapezoidLiquid(90, 120, colors[teaBase], 0.7)
    this.liquidContainer.add(liquid)
    console.log('茶底液体已添加，容器中液体数量:', this.liquidContainer.list.length)
  }

  addSingleFruit(fruit) {
    // 添加单个水果，返回所有切片供后续删除
    const fruitColors = {
      '苹果': 0xFF6347,
      '草莓': 0xFF1493,
      '葡萄': 0x9370DB
    }
    
    const pieces = []
    
    // 创建更多水果切片，浮在液体表面
    const positions = [
      { x: -55, y: -80 },  // 左上
      { x: 55, y: -80 },   // 右上
      { x: -35, y: -70 },  // 左中
      { x: 35, y: -70 },   // 右中
      { x: 0, y: -75 },    // 中央
      { x: -20, y: -85 },  // 额外位置
      { x: 20, y: -85 }    // 额外位置
    ]
    
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i]
      // 添加一些随机偏移，让位置更自然
      const x = pos.x + (Math.random() - 0.5) * 10
      const y = pos.y + (Math.random() - 0.5) * 8
      
      const fruitPiece = this.add.circle(x, y, 10, fruitColors[fruit], 0.95) // 更大更明显
      this.fruitContainer.add(fruitPiece)
      pieces.push(fruitPiece)
      
      // 水果落入动画（从上方落下）
      fruitPiece.setAlpha(0)
      fruitPiece.y = -150
      this.tweens.add({
        targets: fruitPiece,
        y: y,
        alpha: 0.95,
        duration: 800,
        delay: i * 120,
        ease: 'Bounce.easeOut',
        onComplete: () => {
          // 添加持续的浮动效果
          this.tweens.add({
            targets: fruitPiece,
            y: y + 3,
            duration: 1000 + Math.random() * 500,
            yoyo: true,
            repeat: -1, // 无限循环
            ease: 'Sine.easeInOut'
          })
        }
      })
    }
    
    return pieces
  }

  addFruits(fruits) {
    if (fruits.length === 0) return
    
    const fruitColors = {
      '苹果': 0xFF6347,
      '草莓': 0xFF1493,
      '葡萄': 0x9370DB
    }
    
    fruits.forEach((fruit, index) => {
      // 创建3-4个水果切片
      for (let i = 0; i < 4; i++) {
        const x = -40 + Math.random() * 80
        const y = 20 + Math.random() * 60
        const fruitPiece = this.add.circle(x, y, 8, fruitColors[fruit], 0.9)
        this.fruitContainer.add(fruitPiece)
        
        // 水果落入动画
        fruitPiece.setAlpha(0)
        fruitPiece.y = -100
        this.tweens.add({
          targets: fruitPiece,
          y: y,
          alpha: 0.9,
          duration: 600,
          delay: i * 100 + index * 200,
          ease: 'Bounce.easeOut'
        })
      }
    })
  }

  addTopping(topping) {
    if (topping === '不加料') return
    
    const color = topping === '珍珠' ? 0x000000 : 0xFFFFFF
    
    // 创建配料颗粒
    for (let i = 0; i < 12; i++) {
      const x = -50 + (i % 4) * 30
      const y = 80 + Math.floor(i / 4) * 15
      const pearl = this.add.circle(x, y, 6, color, 0.8)
      
      if (topping === '椰果') {
        pearl.setStrokeStyle(1, 0x000000, 1)
      }
      
      this.toppingContainer.add(pearl)
      
      // 配料落入动画
      pearl.setAlpha(0)
      pearl.y = -100
      this.tweens.add({
        targets: pearl,
        y: y,
        alpha: 0.8,
        duration: 500,
        delay: i * 50,
        ease: 'Bounce.easeOut'
      })
    }
  }

  addMilkWithMixing(milkType) {
    // 清除选择UI
    this.clearChoiceUI()
    
    // 显示加奶提示（使用更深的颜色）
    const milkText = this.add.text(450, 200, `正在加入${milkType}...`, {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold',
      stroke: '#8B4513',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(100).setAlpha(0)
    
    this.tweens.add({
      targets: milkText,
      alpha: 1,
      duration: 400
    })
    
    // 创建牛奶层（根据类型决定颜色和透明度）
    const milkColor = milkType === '全脂牛奶' ? 0xFFFAF0 : 0xF0F8FF
    const milkAlpha = milkType === '全脂牛奶' ? 0.6 : 0.4
    
    // 保存牛奶颜色和透明度，用于后续混合
    this.milkColor = milkColor
    this.milkAlpha = milkAlpha
    
    // 使用梯形液体，直接使用最终alpha值（Graphics不支持alpha tween）
    // 牛奶在茶底上方，中心在y=10，高度120px
    const milk = this.createTrapezoidLiquid(10, 120, milkColor, milkAlpha)
    this.liquidContainer.add(milk)
    console.log('牛奶层已添加，容器中液体数量:', this.liquidContainer.list.length)
    
    // 第一阶段：显示分层效果（停留2秒让用户看到分层）
    this.time.delayedCall(2000, () => {
      console.log('牛奶倒入完成，开始混合动画')
      // 第二阶段：混合效果
      this.createMixingEffect()
      
      // 提示文字变化
      milkText.setText('摇啊摇...')
      
      // 第三阶段：液面上升到满杯
      this.time.delayedCall(800, () => {
        this.fillCupToFull(milkColor, milkAlpha)
      })
      
      // 延迟后进入水果步骤
      this.time.delayedCall(2500, () => {
        milkText.destroy()
        this.startStep5_Fruits() // 最后一步：加水果
      })
    })
  }
  
  fillCupToFull(milkColor, milkAlpha) {
    console.log('开始填满杯子，当前液体数量:', this.liquidContainer.list.length)
    console.log('茶底颜色:', this.teaBaseColor.toString(16), '牛奶颜色:', milkColor.toString(16))
    
    // 混合茶底和牛奶的颜色（茶底占比更高，颜色更深，ratio=0.4）
    const mixedColor = this.mixColors(this.teaBaseColor, milkColor, 0.4)
    console.log('混合后颜色:', mixedColor.toString(16))
    
    // 先让旧液体淡出
    this.liquidContainer.list.forEach((item, index) => {
      if (item && item.active) {
        this.tweens.add({
          targets: item,
          alpha: 0,
          duration: 800,
          ease: 'Sine.easeOut',
          onComplete: () => {
            if (item && item.active) {
              item.destroy()
            }
          }
        })
      }
    })
    
    // 延迟后创建新的满杯液体（直接使用最终alpha值，Graphics不支持alpha tween）
    this.time.delayedCall(800, () => {
      // 创建混合后的液体（高度240px，留出空间给水果）
      // 中心在y=30，这样液体从-90到150，顶部留出空间
      const fullLiquid = this.createTrapezoidLiquid(30, 240, mixedColor, 0.8)
      this.liquidContainer.add(fullLiquid)
      console.log('混合液体已创建，alpha:', fullLiquid.alpha, '容器中液体数量:', this.liquidContainer.list.length)
    })
  }
  
  // 辅助函数：混合两种颜色
  mixColors(color1, color2, ratio) {
    // 将十六进制颜色转换为RGB
    const r1 = (color1 >> 16) & 0xFF
    const g1 = (color1 >> 8) & 0xFF
    const b1 = color1 & 0xFF
    
    const r2 = (color2 >> 16) & 0xFF
    const g2 = (color2 >> 8) & 0xFF
    const b2 = color2 & 0xFF
    
    // 混合RGB值
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio)
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio)
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio)
    
    // 转换回十六进制
    return (r << 16) | (g << 8) | b
  }
  
  createMixingEffect() {
    // 创建更多、更明显的混合动画效果
    const mixingParticles = []
    
    // 增加粒子数量，让效果更明显
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        0, 
        0, 
        5, // 粒子更大
        0xFFFFFF, 
        0.9
      )
      this.liquidContainer.add(particle)
      mixingParticles.push(particle)
      
      // 多层螺旋混合动画
      const angle = (i / 20) * Math.PI * 2
      const radius = 40 + (i % 3) * 15 // 多层半径
      
      this.tweens.add({
        targets: particle,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        alpha: 0,
        duration: 1800,
        delay: i * 50,
        ease: 'Quad.easeOut',
        onComplete: () => {
          particle.destroy()
        }
      })
    }
    
    // 添加 bling bling 闪亮特效 ✨
    this.createSparkleEffect()
    
    // 增强杯子晃动效果 - 更大幅度、更可爱、更明显
    this.tweens.add({
      targets: [this.cupBg, this.cupOutline],
      x: 320, // 增大晃动幅度（从310到320）
      duration: 100, // 加快速度（从120到100）
      yoyo: true,
      repeat: 15, // 增加次数（从10到15）
      ease: 'Sine.easeInOut'
    })
    
    // 同时加入旋转效果，更可爱
    this.tweens.add({
      targets: [this.cupBg, this.cupOutline],
      angle: 5, // 增大旋转角度（从3到5）
      duration: 100,
      yoyo: true,
      repeat: 15,
      ease: 'Sine.easeInOut'
    })
    
    // 液体容器也跟着晃动
    this.tweens.add({
      targets: [this.liquidContainer, this.toppingContainer, this.fruitContainer],
      x: 320, // 增大晃动幅度
      duration: 100,
      yoyo: true,
      repeat: 15,
      ease: 'Sine.easeInOut'
    })
    
    // 液体内容也轻微旋转
    this.tweens.add({
      targets: [this.liquidContainer, this.toppingContainer],
      angle: 5, // 增大旋转角度
      duration: 100,
      yoyo: true,
      repeat: 15,
      ease: 'Sine.easeInOut'
    })
    
    // 添加上下轻微跳动效果
    this.tweens.add({
      targets: [this.cupBg, this.cupOutline, this.liquidContainer, this.toppingContainer, this.fruitContainer],
      y: '+=5', // 上下跳动5px
      duration: 150,
      yoyo: true,
      repeat: 10,
      ease: 'Sine.easeInOut'
    })
  }
  
  createSparkleEffect() {
    // 创建 bling bling 闪亮特效 ✨
    const sparkleCount = 15
    
    for (let i = 0; i < sparkleCount; i++) {
      // 随机位置在杯子周围
      const angle = (i / sparkleCount) * Math.PI * 2
      const distance = 100 + Math.random() * 50
      const startX = 300 + Math.cos(angle) * distance
      const startY = 400 + Math.sin(angle) * distance
      
      // 创建星星形状的闪光
      const sparkle = this.add.star(startX, startY, 5, 4, 8, 0xFFFFFF, 1)
      sparkle.setDepth(1000)
      
      // 闪烁动画
      this.tweens.add({
        targets: sparkle,
        scale: { from: 0, to: 1.5 },
        alpha: { from: 1, to: 0 },
        angle: 360,
        duration: 800 + Math.random() * 400,
        delay: i * 80,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          sparkle.destroy()
        }
      })
    }
    
    // 添加彩色光晕效果
    for (let i = 0; i < 8; i++) {
      const colors = [0xFFD700, 0xFF69B4, 0x87CEEB, 0x98FB98, 0xFFB6C1]
      const color = colors[i % colors.length]
      
      const glow = this.add.circle(300, 400, 15, color, 0.6)
      glow.setDepth(999)
      
      const angle = (i / 8) * Math.PI * 2
      const targetX = 300 + Math.cos(angle) * 80
      const targetY = 400 + Math.sin(angle) * 80
      
      this.tweens.add({
        targets: glow,
        x: targetX,
        y: targetY,
        scale: 2,
        alpha: 0,
        duration: 1200,
        delay: i * 100,
        ease: 'Quad.easeOut',
        onComplete: () => {
          glow.destroy()
        }
      })
    }
  }

  addMilk() {
    // 创建牛奶层（白色半透明覆盖层）
    const milk = this.add.rectangle(0, 60, 150, 90, 0xFFFFFF, 0.5)
    this.liquidContainer.add(milk)
    
    // 牛奶倒入动画
    milk.setAlpha(0)
    this.tweens.add({
      targets: milk,
      alpha: 0.5,
      duration: 1000,
      ease: 'Sine.easeInOut'
    })
  }

  completeGame() {
    // 检查是否符合订单
    const isCorrect = this.checkOrder()
    
    this.scene.start('MilkTeaFinishScene', {
      playerChoices: this.playerChoices,
      customerOrder: this.customerOrder,
      isCorrect: isCorrect
    })
  }

  checkOrder() {
    const order = this.customerOrder
    const player = this.playerChoices
    
    // 检查每一项是否匹配
    const teaMatch = order.teaBase === player.teaBase
    const toppingMatch = order.topping === player.topping
    const sugarMatch = order.sugar === player.sugar
    const milkMatch = order.milk === player.milk
    
    // 检查水果（顺序无关）
    const fruitsMatch = order.fruits.length === player.fruits.length &&
      order.fruits.every(f => player.fruits.includes(f))
    
    return teaMatch && fruitsMatch && toppingMatch && sugarMatch && milkMatch
  }
}

