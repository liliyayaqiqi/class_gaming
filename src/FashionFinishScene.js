/**
 * 时装造型师游戏 - 完成场景
 * 展示最终造型效果和奖励
 */
export default class FashionFinishScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FashionFinishScene' })
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

  /**
   * 初始化场景数据
   * @param {Object} data - 从游戏场景传递的数据
   */
  init(data) {
    this.playerChoices = data.playerChoices || {
      hair: 0,
      dress: 0,
      shoes: 0,
      bag: 0
    }
    
    // 接收装饰物位置
    this.decorationPositions = data.decorationPositions || {
      hair: { x: 0, y: -70 },
      dress: { x: 0, y: 0 },
      shoes: { x: 0, y: 95 },
      bag: { x: 65, y: -20 }
    }
    
    // 配置常量（与GameScene保持一致）
    this.CONFIG = {
      COLORS: {
        BACKGROUND: '#FFE4E1',
        TITLE: '#FF1493',
        ACHIEVEMENT: '#FF69B4',
        BUTTON: 0xFF1493,
        BUTTON_HOVER: 0xC71585,
        BACK_BUTTON: 0xff9800,
        BACK_BUTTON_HOVER: 0xf57c00,
        SKIN: 0xFFDEAD,
        HAIR: [0x8B4513, 0xFFD700, 0x000000],
        DRESS: [0xFF69B4, 0x87CEEB, 0x98FB98],
        SHOES: [0xFF1493, 0x000000, 0xFFFFFF],
        BAG: [0xFF69B4, 0x8B4513, 0xFFD700]
      },
      ASSETS: {
        HAIR: ['hair01', 'hair02', 'hair03'],
        DRESS: ['dress01', 'dress02', 'dress03'],
        SHOES: ['shoe01', 'shoe02', 'shoe03'],
        BAG: ['bag01', 'bag02', 'bag03']
      },
      SCALES: {
        MODEL: 0.9
      }
    }
  }

  create() {
    // 设置背景色
    this.cameras.main.setBackgroundColor(this.CONFIG.COLORS.BACKGROUND)
    
    const { width, height } = this.cameras.main
    const centerX = width / 2
    const centerY = height / 2
    
    // 标题
    const title = this.add.text(centerX, 60, '🎉 造型完成！', {
      fontSize: '44px',
      fontFamily: 'Arial',
      color: '#FF1493',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 8
    }).setOrigin(0.5).setDepth(1000)
    
    // 左上角返回主菜单按钮
    this.createBackButton()
    
    // 显示完整造型的模特
    this.createCompleteModel(centerX, centerY + 20)
    
    // 显示奖励勋章（右上角）
    this.showMedal(width - 80, 80)
    
    // 成就文字
    const achievement = this.add.text(centerX, height - 120, '你是优秀的时装造型师！', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#FF69B4',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(100)
    
    // 显示职业技能
    this.showSkills(centerX, height - 70)
    
    // 再玩一次按钮
    this.createReplayButton(width - 110, height - 40)
    
    // 闪亮特效
    this.createSparkleEffect(centerX, centerY)
    
    // 入场动画
    title.setAlpha(0)
    achievement.setAlpha(0)
    this.tweens.add({
      targets: [title, achievement],
      alpha: 1,
      duration: 800,
      ease: 'Sine.easeOut'
    })
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
      this.scene.start('MainMenuScene')
    })
    
    backButton.on('pointerover', () => {
      backButton.setFillStyle(0xf57c00)
    })
    
    backButton.on('pointerout', () => {
      backButton.setFillStyle(0xff9800)
    })
  }

  createCompleteModel(x, y) {
    // 创建完整造型的模特
    const container = this.add.container(x, y)
    container.setDepth(10)
    
    // 使用真实的模特基础图
    const baseModel = this.add.image(0, 0, 'base_model')
    baseModel.setScale(this.CONFIG.SCALES.MODEL)
    container.add(baseModel)
    
    // 应用玩家选择的发型
    this.applyHair(container, this.playerChoices.hair)
    
    // 应用玩家选择的连衣裙
    this.applyDress(container, this.playerChoices.dress)
    
    // 应用玩家选择的鞋子
    this.applyShoes(container, this.playerChoices.shoes)
    
    // 应用玩家选择的包包
    this.applyBag(container, this.playerChoices.bag)
    
    // 添加轻微的摇摆动画
    this.tweens.add({
      targets: container,
      angle: { from: -3, to: 3 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    return container
  }

  /**
   * 应用发型到模特容器
   * @param {Phaser.GameObjects.Container} container - 模特容器
   * @param {number} index - 发型索引
   */
  applyHair(container, index) {
    const pos = this.decorationPositions.hair
    const hair = this.add.image(0, 0, this.CONFIG.ASSETS.HAIR[index])
    hair.setScale(1.0)
    hair.setPosition(pos.x, pos.y)
    container.add(hair)
  }

  /**
   * 应用连衣裙到模特容器
   * @param {Phaser.GameObjects.Container} container - 模特容器
   * @param {number} index - 连衣裙索引
   */
  applyDress(container, index) {
    const pos = this.decorationPositions.dress
    const dress = this.add.image(0, 0, this.CONFIG.ASSETS.DRESS[index])
    dress.setScale(1.0)
    dress.setPosition(pos.x, pos.y)
    container.add(dress)
  }

  /**
   * 应用鞋子到模特容器
   * @param {Phaser.GameObjects.Container} container - 模特容器
   * @param {number} index - 鞋子索引
   */
  applyShoes(container, index) {
    const pos = this.decorationPositions.shoes
    const shoes = this.add.image(0, 0, this.CONFIG.ASSETS.SHOES[index])
    shoes.setScale(1.0)
    shoes.setPosition(pos.x, pos.y)
    container.add(shoes)
  }

  /**
   * 应用包包到模特容器
   * @param {Phaser.GameObjects.Container} container - 模特容器
   * @param {number} index - 包包索引
   */
  applyBag(container, index) {
    const pos = this.decorationPositions.bag
    const bag = this.add.image(0, 0, this.CONFIG.ASSETS.BAG[index])
    bag.setScale(1.0)
    bag.setPosition(pos.x, pos.y)
    container.add(bag)
  }

  showMedal(x, y) {
    // 创建奖励勋章
    const medal = this.add.star(x, y, 8, 20, 40, 0xFFD700, 1)
      .setDepth(100)
    
    // 勋章中心
    const center = this.add.circle(x, y, 25, 0xFF1493, 1)
      .setDepth(101)
    
    // 勋章文字
    const medalText = this.add.text(x, y, '优秀', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(102)
    
    // 勋章动画
    medal.setScale(0)
    center.setScale(0)
    medalText.setScale(0)
    
    this.tweens.add({
      targets: [medal, center, medalText],
      scale: 1,
      duration: 600,
      delay: 400,
      ease: 'Back.easeOut'
    })
    
    // 持续旋转
    this.tweens.add({
      targets: medal,
      angle: 360,
      duration: 4000,
      repeat: -1,
      ease: 'Linear'
    })
  }

  showSkills(x, y) {
    const skills = [
      '✨ 学会了色彩搭配',
      '✨ 理解了整体造型',
      '✨ 培养了审美能力'
    ]
    
    const skillText = this.add.text(x, y, skills.join('  '), {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#FF69B4',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(100)
    
    skillText.setAlpha(0)
    this.tweens.add({
      targets: skillText,
      alpha: 1,
      duration: 800,
      delay: 800
    })
  }

  createSparkleEffect(x, y) {
    // 创建闪亮特效
    const sparkleCount = 20
    
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i / sparkleCount) * Math.PI * 2
      const distance = 80 + Math.random() * 60
      const startX = x + Math.cos(angle) * distance
      const startY = y + Math.sin(angle) * distance
      
      const sparkle = this.add.star(startX, startY, 5, 4, 8, 0xFFFFFF, 1)
        .setDepth(1000)
      
      this.tweens.add({
        targets: sparkle,
        scale: { from: 0, to: 1.5 },
        alpha: { from: 1, to: 0 },
        angle: 360,
        duration: 1000 + Math.random() * 500,
        delay: i * 80,
        ease: 'Cubic.easeOut',
        onComplete: () => sparkle.destroy()
      })
    }
    
    // 彩色光晕
    const colors = [0xFFD700, 0xFF69B4, 0x87CEEB, 0x98FB98, 0xFFB6C1]
    for (let i = 0; i < 8; i++) {
      const color = colors[i % colors.length]
      const glow = this.add.circle(x, y, 15, color, 0.6)
        .setDepth(999)
      
      const angle = (i / 8) * Math.PI * 2
      const targetX = x + Math.cos(angle) * 100
      const targetY = y + Math.sin(angle) * 100
      
      this.tweens.add({
        targets: glow,
        x: targetX,
        y: targetY,
        scale: 2,
        alpha: 0,
        duration: 1500,
        delay: i * 100,
        ease: 'Quad.easeOut',
        onComplete: () => glow.destroy()
      })
    }
  }

  createReplayButton(x, y) {
    const replayButton = this.add.rectangle(x, y, 180, 55, 0x4caf50)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999)
    
    const replayText = this.add.text(x, y, '再玩一次', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(10000)
    
    replayButton.on('pointerdown', () => {
      this.scene.start('FashionGameScene')
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

