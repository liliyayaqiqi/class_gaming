export default class FashionGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FashionGameScene' })
    
    // 游戏配置
    this.CONFIG = {
      STEPS: ['发型', '连衣裙', '高跟鞋', '包包'],
      COLORS: {
        BACKGROUND: '#FFE4E1',
        SKIN: 0xFFDEAD,
        // 发型颜色
        HAIR: [0x8B4513, 0xFFD700, 0x000000],
        // 连衣裙颜色
        DRESS: [0xFF69B4, 0x87CEEB, 0x98FB98],
        // 鞋子颜色
        SHOES: [0xFF1493, 0x000000, 0xFFFFFF],
        // 包包颜色
        BAG: [0xFF69B4, 0x8B4513, 0xFFD700]
      }
    }
  }

  init() {
    // 玩家选择
    this.playerChoices = {
      hair: null,
      dress: null,
      shoes: null,
      bag: null
    }
    
    // 保存装饰物的位置（相对于模特容器的本地坐标）
    this.decorationPositions = {
      hair: { x: 0, y: -70 },    // 默认位置
      dress: { x: 0, y: 0 },
      shoes: { x: 0, y: 95 },
      bag: { x: 65, y: -20 }
    }
    
    // 当前步骤（0=发型, 1=连衣裙, 2=高跟鞋, 3=包包）
    this.currentStep = 0
    
    // 模特图层引用
    this.modelLayers = {
      base: null,
      hair: null,
      dress: null,
      shoes: null,
      bag: null
    }
  }

  preload() {
    // 加载模特基础图
    this.load.image('base_model', 'fashion/base_model.png')
    // 加载发型资源
    this.load.image('hair01', 'fashion/hair01.png')
    this.load.image('hair02', 'fashion/hair02.png')
    this.load.image('hair03', 'fashion/hair03.png')
    // 加载连衣裙资源
    this.load.image('dress01', 'fashion/dress01.png')
    this.load.image('dress02', 'fashion/dress02.png')
    this.load.image('dress03', 'fashion/dress03.png')
    // 加载鞋子资源
    this.load.image('shoe01', 'fashion/shoe01.png')
    this.load.image('shoe02', 'fashion/shoe02.png')
    this.load.image('shoe03', 'fashion/shoe03.png')
    // 加载包包资源
    this.load.image('bag01', 'fashion/bag01.png')
    this.load.image('bag02', 'fashion/bag02.png')
    this.load.image('bag03', 'fashion/bag03.png')
  }

  create() {
    // 设置背景色
    this.cameras.main.setBackgroundColor(this.CONFIG.COLORS.BACKGROUND)
    
    const { width, height } = this.cameras.main
    this.centerX = width / 2
    this.centerY = height / 2
    
    // 左上角返回按钮
    this.createBackButton()
    
    // 顶部标题
    this.stageTitle = this.add.text(this.centerX, 40, '', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#FF1493',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(1000)
    
    // 创建模特基础图（中央）
    this.createModel(this.centerX, this.centerY)
    
    // 开始第一步：选择发型
    this.startStep(0)
  }

  createBackButton() {
    const backButton = this.add.rectangle(80, 30, 140, 40, 0xff9800)
      .setInteractive({ useHandCursor: true })
      .setDepth(2000)
    
    const backText = this.add.text(80, 30, '返回主菜单', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2001)
    
    backButton.on('pointerdown', () => {
      this.scene.start('FashionMenuScene')
    })
    
    backButton.on('pointerover', () => {
      backButton.setFillStyle(0xf57c00)
    })
    
    backButton.on('pointerout', () => {
      backButton.setFillStyle(0xff9800)
    })
  }

  createModel(x, y) {
    // 创建模特容器
    this.modelContainer = this.add.container(x, y)
    this.modelContainer.setDepth(10)
    
    // 使用真实的模特基础图，放大到0.8倍
    const baseModel = this.add.image(0, 0, 'base_model')
    baseModel.setScale(0.9) // 放大模特，占满画幅中间
    this.modelLayers.base = baseModel
    this.modelContainer.add(baseModel)
  }

  startStep(stepIndex) {
    this.currentStep = stepIndex
    
    // 清除之前的选择UI
    this.clearChoiceUI()
    
    const stepName = this.CONFIG.STEPS[stepIndex]
    
    switch(stepIndex) {
      case 0:
        this.stageTitle.setText('💇 第1步: 选择发型')
        this.showHairChoices()
        break
      case 1:
        this.stageTitle.setText('👗 第2步: 选择连衣裙')
        this.showDressChoices()
        break
      case 2:
        this.stageTitle.setText('👠 第3步: 选择高跟鞋')
        this.showShoesChoices()
        break
      case 3:
        this.stageTitle.setText('👜 第4步: 选择包包')
        this.showBagChoices()
        break
    }
  }

  showHairChoices() {
    const hint = this.add.text(this.centerX, this.centerY + 300, '拖动发型到合适的位置，然后点击确定', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FF69B4',
      fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(100)
    
    const hairStyles = ['双马尾', '精灵短发', '长卷发']
    const colors = this.CONFIG.COLORS.HAIR
    
    this.createDraggableChoices(150, 200, hairStyles, colors, (choice, index) => {
      this.playerChoices.hair = index
      this.createDraggableHair(index)
    })
  }

  showDressChoices() {
    const hint = this.add.text(this.centerX, this.centerY + 300, '拖动连衣裙到合适的位置，然后点击确定', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FF69B4',
      fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(100)
    
    const dressStyles = ['蛋糕裙', '碎花裙', '孔雀裙']
    const colors = this.CONFIG.COLORS.DRESS
    
    this.createDraggableChoices(150, 200, dressStyles, colors, (choice, index) => {
      this.playerChoices.dress = index
      this.createDraggableDress(index)
    })
  }

  showShoesChoices() {
    const hint = this.add.text(this.centerX, this.centerY + 300, '拖动鞋子到合适的位置，然后点击确定', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FF69B4',
      fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(100)
    
    const shoesStyles = ['蝴蝶结', '简约款', '系带款']
    const colors = this.CONFIG.COLORS.SHOES
    
    this.createDraggableChoices(150, 200, shoesStyles, colors, (choice, index) => {
      this.playerChoices.shoes = index
      this.createDraggableShoes(index)
    })
  }

  showBagChoices() {
    const hint = this.add.text(this.centerX, this.centerY + 300, '拖动包包到合适的位置，然后点击确定', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FF69B4',
      fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(100)
    
    const bagStyles = ['简约款', '爱心款', '星星款']
    const colors = this.CONFIG.COLORS.BAG
    
    this.createDraggableChoices(150, 200, bagStyles, colors, (choice, index) => {
      this.playerChoices.bag = index
      this.createDraggableBag(index)
    })
  }

  createDraggableChoices(x, startY, labels, colors, callback) {
    // 创建可点击的选项按钮（点击后创建可拖拽的装饰物）
    labels.forEach((label, index) => {
      const yPos = startY + index * 100
      const color = colors[index]
      
      // 创建选项容器
      const container = this.add.container(x, yPos)
      container.setDepth(100)
      
      // 预览图
      const preview = this.createPreviewIcon(this.currentStep, index, color)
      container.add(preview)
      
      // 标签文字
      const text = this.add.text(80, 0, label, {
        fontSize: '22px',
        fontFamily: 'Arial',
        color: '#333333',
        fontStyle: 'bold'
      }).setOrigin(0, 0.5)
      container.add(text)
      
      // 点击区域
      const hitArea = this.add.rectangle(0, 0, 200, 80, 0xFFFFFF, 0.01)
        .setInteractive({ useHandCursor: true })
      container.add(hitArea)
      
      // 边框（所有按钮都不显示边框）
      let border = null
      // 不再显示边框
      
      // 交互效果
      hitArea.on('pointerdown', () => {
        // 清除之前的可拖拽物品
        if (this.currentDraggableItem) {
          this.currentDraggableItem.destroy()
        }
        callback(label, index)
      })
      
      hitArea.on('pointerover', () => {
        container.setScale(1.1)
        if (border) {
          border.setStrokeStyle(4, 0xFF1493, 1)
        }
      })
      
      hitArea.on('pointerout', () => {
        container.setScale(1)
        if (border) {
          border.setStrokeStyle(3, 0xFFB6C1, 1)
        }
      })
      
      // 入场动画
      container.setAlpha(0)
      this.tweens.add({
        targets: container,
        alpha: 1,
        duration: 400,
        delay: index * 100,
        ease: 'Back.easeOut'
      })
    })
  }

  createChoiceButtons(x, startY, labels, colors, callback) {
    labels.forEach((label, index) => {
      const yPos = startY + index * 120
      const color = colors[index]
      
      // 创建选项容器
      const container = this.add.container(x, yPos)
      container.setDepth(100)
      
      // 预览图（程序生成的图标）
      const preview = this.createPreviewIcon(this.currentStep, index, color)
      container.add(preview)
      
      // 标签文字
      const text = this.add.text(80, 0, label, {
        fontSize: '22px',
        fontFamily: 'Arial',
        color: '#333333',
        fontStyle: 'bold'
      }).setOrigin(0, 0.5)
      container.add(text)
      
      // 点击区域
      const hitArea = this.add.rectangle(0, 0, 200, 80, 0xFFFFFF, 0.01)
        .setInteractive({ useHandCursor: true })
      container.add(hitArea)
      
      // 边框
      const border = this.add.rectangle(0, 0, 200, 80)
        .setStrokeStyle(3, 0xFFB6C1, 1)
      container.add(border)
      
      // 交互效果
      hitArea.on('pointerdown', () => {
        callback(label, index)
      })
      
      hitArea.on('pointerover', () => {
        container.setScale(1.1)
        border.setStrokeStyle(4, 0xFF1493, 1)
      })
      
      hitArea.on('pointerout', () => {
        container.setScale(1)
        border.setStrokeStyle(3, 0xFFB6C1, 1)
      })
      
      // 入场动画
      container.setAlpha(0)
      this.tweens.add({
        targets: container,
        alpha: 1,
        duration: 400,
        delay: index * 100,
        ease: 'Back.easeOut'
      })
    })
  }

  createPreviewIcon(step, index, color) {
    switch(step) {
      case 0: // 发型 - 全部使用图片
        const hairImages = ['hair01', 'hair02', 'hair03']
        const hairImage = this.add.image(0, 0, hairImages[index])
        hairImage.setScale(0.5) // 缩略图尺寸
        return hairImage
      case 1: // 连衣裙 - 全部使用图片
        const dressImages = ['dress01', 'dress02', 'dress03']
        const dressImage = this.add.image(0, 0, dressImages[index])
        dressImage.setScale(0.25) // 缩略图尺寸
        return dressImage
      case 2: // 鞋子 - 全部使用图片
        const shoeImages = ['shoe01', 'shoe02', 'shoe03']
        const shoeImage = this.add.image(0, 0, shoeImages[index])
        shoeImage.setScale(0.5) // 缩略图尺寸
        return shoeImage
      case 3: // 包包 - 全部使用图片
        const bagImages = ['bag01', 'bag02', 'bag03']
        const bagImage = this.add.image(0, 0, bagImages[index])
        bagImage.setScale(0.5) // 缩略图尺寸
        return bagImage
    }
  }

  createDraggableHair(index) {
    const color = this.CONFIG.COLORS.HAIR[index]
    
    // 创建一个容器来包装发型元素
    const container = this.add.container(this.centerX, this.centerY - 70)
    
    let hairElement
    
    // 根据索引创建不同发型 - 全部使用图片
    let containerWidth, containerHeight
    
    const hairImages = ['hair01', 'hair02', 'hair03']
    hairElement = this.add.image(0, 0, hairImages[index])
    hairElement.setScale(1.0) // 拖拽时的尺寸
    
    // 根据图片的实际显示尺寸设置容器大小
    containerWidth = hairElement.displayWidth
    containerHeight = hairElement.displayHeight
    
    container.add(hairElement)
    container.setSize(containerWidth, containerHeight)
    container.setDepth(50)
    
    // 设置容器为可拖拽
    container.setInteractive({ draggable: true, useHandCursor: true })
    this.input.setDraggable(container)
    
    // 拖拽事件
    container.on('drag', (pointer, dragX, dragY) => {
      container.setPosition(dragX, dragY)
    })
    
    // 保存当前可拖拽物品和相关数据
    this.currentDraggableItem = container
    this.currentDraggableData = { type: 'hair', index, color }
    
    // 显示确定按钮
    this.showConfirmButton(() => {
      // 确定后，将装饰物添加到模特容器并锁定
      const localPos = this.modelContainer.getLocalPoint(container.x, container.y)
      
      // 保存位置到 decorationPositions
      this.decorationPositions.hair = { x: localPos.x, y: localPos.y }
      
      container.destroy()
      
      // 在模特容器中重新创建（锁定位置）- 全部使用图片
      const hairImages = ['hair01', 'hair02', 'hair03']
      const lockedHair = this.add.image(0, 0, hairImages[index])
      lockedHair.setScale(1.0) // 锁定时的尺寸
      
      lockedHair.setPosition(localPos.x, localPos.y)
      
      // 移除旧的发型
      if (this.modelLayers.hair) {
        this.modelLayers.hair.destroy()
      }
      this.modelLayers.hair = lockedHair
      this.modelContainer.add(lockedHair)
      
      this.currentDraggableItem = null
      this.currentDraggableData = null
      
      // 在锁定位置播放闪亮特效（将本地坐标转换为世界坐标）
      const worldPos = this.modelContainer.getWorldTransformMatrix().transformPoint(localPos.x, localPos.y)
      this.addSparkle(worldPos.x, worldPos.y)
    })
  }

  applyHair(index) {
    // 移除旧发型
    if (this.modelLayers.hair) {
      this.modelLayers.hair.destroy()
    }
    
    const color = this.CONFIG.COLORS.HAIR[index]
    const hair = this.add.graphics()
    hair.fillStyle(color, 1)
    
    // 根据索引创建不同发型
    switch(index) {
      case 0: // 短发
        hair.fillCircle(0, -70, 25)
        break
      case 1: // 长发
        hair.fillCircle(0, -70, 25)
        hair.fillRect(-30, -70, 60, 40)
        break
      case 2: // 卷发
        hair.fillCircle(0, -70, 28)
        hair.fillCircle(-20, -65, 15)
        hair.fillCircle(20, -65, 15)
        break
    }
    
    this.modelLayers.hair = hair
    this.modelContainer.add(hair)
    
    // 添加闪光效果
    this.addSparkle(this.centerX, this.centerY - 50)
  }

  createDraggableDress(index) {
    const container = this.add.container(this.centerX, this.centerY)
    
    // 全部使用图片
    const dressImages = ['dress01', 'dress02', 'dress03']
    const dressElement = this.add.image(0, 0, dressImages[index])
    dressElement.setScale(1.0) // 拖拽时的尺寸
    
    const containerWidth = dressElement.displayWidth
    const containerHeight = dressElement.displayHeight
    
    container.add(dressElement)
    container.setSize(containerWidth, containerHeight)
    container.setDepth(50)
    container.setInteractive({ draggable: true, useHandCursor: true })
    this.input.setDraggable(container)
    
    container.on('drag', (pointer, dragX, dragY) => {
      container.setPosition(dragX, dragY)
    })
    
    this.currentDraggableItem = container
    this.currentDraggableData = { type: 'dress', index }
    
    this.showConfirmButton(() => {
      const localPos = this.modelContainer.getLocalPoint(container.x, container.y)
      
      // 保存位置
      this.decorationPositions.dress = { x: localPos.x, y: localPos.y }
      
      container.destroy()
      
      // 全部使用图片
      const dressImages = ['dress01', 'dress02', 'dress03']
      const lockedDress = this.add.image(0, 0, dressImages[index])
      lockedDress.setScale(1.0) // 锁定时的尺寸
      lockedDress.setPosition(localPos.x, localPos.y)
      
      if (this.modelLayers.dress) {
        this.modelLayers.dress.destroy()
      }
      this.modelLayers.dress = lockedDress
      this.modelContainer.add(lockedDress)
      
      this.currentDraggableItem = null
      this.currentDraggableData = null
      
      // 在锁定位置播放闪亮特效
      const worldPos = this.modelContainer.getWorldTransformMatrix().transformPoint(localPos.x, localPos.y)
      this.addSparkle(worldPos.x, worldPos.y)
    })
  }

  applyDress(index) {
    // 移除旧连衣裙
    if (this.modelLayers.dress) {
      this.modelLayers.dress.destroy()
    }
    
    const color = this.CONFIG.COLORS.DRESS[index]
    const dress = this.add.graphics()
    dress.fillStyle(color, 1)
    
    // 连衣裙形状
    dress.fillRect(-35, -40, 70, 85)
    // 裙摆
    dress.beginPath()
    dress.moveTo(-35, 45)
    dress.lineTo(-50, 80)
    dress.lineTo(50, 80)
    dress.lineTo(35, 45)
    dress.closePath()
    dress.fillPath()
    
    this.modelLayers.dress = dress
    this.modelContainer.add(dress)
    
    // 添加闪光效果
    this.addSparkle(this.centerX, this.centerY)
  }

  createDraggableShoes(index) {
    const container = this.add.container(this.centerX, this.centerY + 95)
    
    // 全部使用图片
    const shoeImages = ['shoe01', 'shoe02', 'shoe03']
    const shoesElement = this.add.image(0, 0, shoeImages[index])
    shoesElement.setScale(1.0) // 拖拽时的尺寸
    
    const containerWidth = shoesElement.displayWidth
    const containerHeight = shoesElement.displayHeight
    
    container.add(shoesElement)
    container.setSize(containerWidth, containerHeight)
    container.setDepth(50)
    container.setInteractive({ draggable: true, useHandCursor: true })
    this.input.setDraggable(container)
    
    container.on('drag', (pointer, dragX, dragY) => {
      container.setPosition(dragX, dragY)
    })
    
    this.currentDraggableItem = container
    this.currentDraggableData = { type: 'shoes', index }
    
    this.showConfirmButton(() => {
      const localPos = this.modelContainer.getLocalPoint(container.x, container.y)
      
      // 保存位置
      this.decorationPositions.shoes = { x: localPos.x, y: localPos.y }
      
      container.destroy()
      
      // 全部使用图片
      const shoeImages = ['shoe01', 'shoe02', 'shoe03']
      const lockedShoes = this.add.image(0, 0, shoeImages[index])
      lockedShoes.setScale(1.0) // 锁定时的尺寸
      lockedShoes.setPosition(localPos.x, localPos.y)
      
      if (this.modelLayers.shoes) {
        this.modelLayers.shoes.destroy()
      }
      this.modelLayers.shoes = lockedShoes
      this.modelContainer.add(lockedShoes)
      
      this.currentDraggableItem = null
      this.currentDraggableData = null
      
      // 在锁定位置播放闪亮特效
      const worldPos = this.modelContainer.getWorldTransformMatrix().transformPoint(localPos.x, localPos.y)
      this.addSparkle(worldPos.x, worldPos.y)
    })
  }

  createDraggableBag(index) {
    const container = this.add.container(this.centerX + 65, this.centerY - 20)
    
    // 全部使用图片
    const bagImages = ['bag01', 'bag02', 'bag03']
    const bagElement = this.add.image(0, 0, bagImages[index])
    bagElement.setScale(1.0) // 拖拽时的尺寸
    
    const containerWidth = bagElement.displayWidth
    const containerHeight = bagElement.displayHeight
    
    container.add(bagElement)
    container.setSize(containerWidth, containerHeight)
    container.setDepth(50)
    container.setInteractive({ draggable: true, useHandCursor: true })
    this.input.setDraggable(container)
    
    container.on('drag', (pointer, dragX, dragY) => {
      container.setPosition(dragX, dragY)
    })
    
    this.currentDraggableItem = container
    this.currentDraggableData = { type: 'bag', index }
    
    this.showConfirmButton(() => {
      const localPos = this.modelContainer.getLocalPoint(container.x, container.y)
      
      // 保存位置
      this.decorationPositions.bag = { x: localPos.x, y: localPos.y }
      
      container.destroy()
      
      // 全部使用图片
      const bagImages = ['bag01', 'bag02', 'bag03']
      const lockedBag = this.add.image(0, 0, bagImages[index])
      lockedBag.setScale(1.0) // 锁定时的尺寸
      lockedBag.setPosition(localPos.x, localPos.y)
      
      if (this.modelLayers.bag) {
        this.modelLayers.bag.destroy()
      }
      this.modelLayers.bag = lockedBag
      this.modelContainer.add(lockedBag)
      
      this.currentDraggableItem = null
      this.currentDraggableData = null
      
      // 在锁定位置播放闪亮特效
      const worldPos = this.modelContainer.getWorldTransformMatrix().transformPoint(localPos.x, localPos.y)
      this.addSparkle(worldPos.x, worldPos.y)
    })
  }

  applyShoes(index) {
    // 移除旧鞋子
    if (this.modelLayers.shoes) {
      this.modelLayers.shoes.destroy()
    }
    
    const color = this.CONFIG.COLORS.SHOES[index]
    const shoes = this.add.graphics()
    shoes.fillStyle(color, 1)
    
    // 左鞋
    shoes.fillEllipse(-15, 95, 25, 18)
    // 右鞋
    shoes.fillEllipse(15, 95, 25, 18)
    
    // 鞋跟（高跟鞋）
    shoes.fillRect(-20, 90, 5, 15)
    shoes.fillRect(10, 90, 5, 15)
    
    this.modelLayers.shoes = shoes
    this.modelContainer.add(shoes)
    
    // 添加闪光效果
    this.addSparkle(this.centerX, this.centerY + 70)
  }

  applyBag(index) {
    // 移除旧包包
    if (this.modelLayers.bag) {
      this.modelLayers.bag.destroy()
    }
    
    const color = this.CONFIG.COLORS.BAG[index]
    const bag = this.add.graphics()
    bag.fillStyle(color, 1)
    
    // 包包主体
    bag.fillRoundedRect(40, -20, 50, 40, 8)
    // 包包手柄
    bag.lineStyle(4, color, 1)
    bag.beginPath()
    bag.arc(65, -20, 15, Math.PI, 0, false)
    bag.strokePath()
    
    this.modelLayers.bag = bag
    this.modelContainer.add(bag)
    
    // 添加闪光效果
    this.addSparkle(this.centerX + 65, this.centerY - 20)
  }

  addSparkle(x, y) {
    // 创建中心爆发的闪光效果
    const colors = [0xFFD700, 0xFFFFFF, 0xFFA500, 0xFFFF00] // 金色、白色、橙色、黄色
    
    // 第一层：大星星（8个，向外扩散）
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const distance = 80 // 增大扩散距离
      const color = colors[i % colors.length]
      
      const sparkle = this.add.star(
        x,
        y,
        5, 8, 16, color, 1 // 更大的星星
      ).setDepth(1000)
      
      this.tweens.add({
        targets: sparkle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        scale: { from: 0.5, to: 2.5 }, // 更大的缩放范围
        alpha: { from: 1, to: 0 },
        angle: 720, // 旋转两圈
        duration: 800,
        ease: 'Cubic.easeOut',
        onComplete: () => sparkle.destroy()
      })
    }
    
    // 第二层：小星星（12个，快速旋转）
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const distance = 50
      const color = colors[i % colors.length]
      
      const sparkle = this.add.star(
        x,
        y,
        4, 4, 8, color, 1
      ).setDepth(1001)
      
      this.tweens.add({
        targets: sparkle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        scale: { from: 0.3, to: 1.8 },
        alpha: { from: 1, to: 0 },
        angle: -360,
        duration: 600,
        ease: 'Back.easeOut',
        onComplete: () => sparkle.destroy()
      })
    }
    
    // 第三层：中心闪光（脉冲效果）
    const centerGlow = this.add.circle(x, y, 20, 0xFFFFFF, 0.8)
      .setDepth(999)
    
    this.tweens.add({
      targets: centerGlow,
      scale: { from: 0.5, to: 3 },
      alpha: { from: 0.8, to: 0 },
      duration: 500,
      ease: 'Sine.easeOut',
      onComplete: () => centerGlow.destroy()
    })
  }

  showConfirmButton(onConfirm) {
    // 移除旧的确定按钮
    if (this.confirmButton) {
      this.confirmButton.destroy()
      this.confirmText.destroy()
    }
    
    this.confirmButton = this.add.rectangle(750, 600, 140, 55, 0xFF1493)
      .setInteractive({ useHandCursor: true })
      .setDepth(200)
    
    this.confirmText = this.add.text(750, 600, '✓ 确定', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(201)
    
    this.confirmButton.on('pointerdown', () => {
      onConfirm()
      
      // 移除确定按钮
      this.confirmButton.destroy()
      this.confirmText.destroy()
      this.confirmButton = null
      this.confirmText = null
      
      // 进入下一步或完成
      if (this.currentStep < 3) {
        this.startStep(this.currentStep + 1)
      } else {
        this.completeGame()
      }
    })
    
    this.confirmButton.on('pointerover', () => {
      this.confirmButton.setFillStyle(0xC71585)
      this.confirmButton.setScale(1.05)
      this.confirmText.setScale(1.05)
    })
    
    this.confirmButton.on('pointerout', () => {
      this.confirmButton.setFillStyle(0xFF1493)
      this.confirmButton.setScale(1)
      this.confirmText.setScale(1)
    })
    
    // 入场动画
    this.confirmButton.setAlpha(0)
    this.confirmText.setAlpha(0)
    this.tweens.add({
      targets: [this.confirmButton, this.confirmText],
      alpha: 1,
      duration: 400,
      ease: 'Back.easeOut'
    })
  }

  showNextButton() {
    const nextButton = this.add.rectangle(750, 600, 120, 50, 0x4CAF50)
      .setInteractive({ useHandCursor: true })
      .setDepth(100)
    
    const nextText = this.add.text(750, 600, '下一步', {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(101)
    
    nextButton.on('pointerdown', () => {
      if (this.currentStep < 3) {
        this.startStep(this.currentStep + 1)
      }
    })
    
    nextButton.on('pointerover', () => {
      nextButton.setFillStyle(0x45A049)
      nextButton.setScale(1.05)
      nextText.setScale(1.05)
    })
    
    nextButton.on('pointerout', () => {
      nextButton.setFillStyle(0x4CAF50)
      nextButton.setScale(1)
      nextText.setScale(1)
    })
  }

  showCompleteButton() {
    const completeButton = this.add.rectangle(750, 600, 120, 50, 0xFF1493)
      .setInteractive({ useHandCursor: true })
      .setDepth(100)
    
    const completeText = this.add.text(750, 600, '完成', {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(101)
    
    completeButton.on('pointerdown', () => {
      this.completeGame()
    })
    
    completeButton.on('pointerover', () => {
      completeButton.setFillStyle(0xC71585)
      completeButton.setScale(1.05)
      completeText.setScale(1.05)
    })
    
    completeButton.on('pointerout', () => {
      completeButton.setFillStyle(0xFF1493)
      completeButton.setScale(1)
      completeText.setScale(1)
    })
  }

  clearChoiceUI() {
    // 清除所有深度100-102的UI元素
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

  completeGame() {
    this.scene.start('FashionFinishScene', {
      playerChoices: this.playerChoices,
      decorationPositions: this.decorationPositions
    })
  }
}

