/**
 * 时装造型师游戏 - 菜单场景
 * 展示游戏介绍和开始按钮
 */
export default class FashionMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FashionMenuScene' })
    
    // 配置常量
    this.CONFIG = {
      BACKGROUND_COLOR: '#FFE4E1',
      TITLE_COLOR: '#FF1493',
      SUBTITLE_COLOR: '#FF69B4',
      BUTTON_COLOR: 0xFF1493,
      BUTTON_HOVER_COLOR: 0xC71585,
      BACK_BUTTON_COLOR: 0xff9800,
      BACK_BUTTON_HOVER_COLOR: 0xf57c00
    }
  }

  preload() {
    // 加载模特基础图
    this.load.image('barbie', 'fashion/barbie.png')
  }

  create() {
    // 设置背景色
    this.cameras.main.setBackgroundColor(this.CONFIG.BACKGROUND_COLOR)
    
    // 获取游戏尺寸
    const { width, height } = this.cameras.main
    const centerX = width / 2
    const centerY = height / 2
    
    // 左上角返回主菜单按钮
    this.createBackButton()
    
    // 游戏标题
    const title = this.add.text(centerX, 120, '👗 我是时装造型师', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: this.CONFIG.TITLE_COLOR,
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 6
    }).setOrigin(0.5)
    
    // 副标题（游戏步骤）
    const subtitle = this.add.text(centerX, 190, '💇 发型 → 👗 连衣裙 → 👠 高跟鞋 → 👜 包包', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: this.CONFIG.SUBTITLE_COLOR,
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // 创建模特预览图（程序生成）
    this.createModelPreview(centerX, centerY + 50)
    
    // 开始游戏按钮
    const startButton = this.add.rectangle(centerX, height - 80, 200, 60, this.CONFIG.BUTTON_COLOR)
      .setInteractive({ useHandCursor: true })
    
    const startText = this.add.text(centerX, height - 80, '开始游戏', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // 按钮交互
    startButton.on('pointerdown', () => {
      this.scene.start('FashionGameScene')
    })
    
    startButton.on('pointerover', () => {
      startButton.setFillStyle(this.CONFIG.BUTTON_HOVER_COLOR)
      startButton.setScale(1.05)
      startText.setScale(1.05)
    })
    
    startButton.on('pointerout', () => {
      startButton.setFillStyle(this.CONFIG.BUTTON_COLOR)
      startButton.setScale(1)
      startText.setScale(1)
    })
    
    // 入场动画
    title.setAlpha(0)
    subtitle.setAlpha(0)
    this.tweens.add({
      targets: [title, subtitle],
      alpha: 1,
      duration: 800,
      ease: 'Sine.easeOut'
    })
  }

  /**
   * 创建返回主菜单按钮
   */
  createBackButton() {
    const backButton = this.add.rectangle(80, 30, 140, 40, this.CONFIG.BACK_BUTTON_COLOR)
      .setInteractive({ useHandCursor: true })
    
    const backText = this.add.text(80, 30, '返回主菜单', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    backButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene')
    })
    
    backButton.on('pointerover', () => {
      backButton.setFillStyle(this.CONFIG.BACK_BUTTON_HOVER_COLOR)
    })
    
    backButton.on('pointerout', () => {
      backButton.setFillStyle(this.CONFIG.BACK_BUTTON_COLOR)
    })
  }

  /**
   * 创建模特预览图
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @returns {Phaser.GameObjects.Image} 模特图像对象
   */
  createModelPreview(x, y) {
    // 使用真实的模特图片
    const model = this.add.image(x, y, 'barbie')
    
    // 根据图片实际尺寸调整缩放（假设原图较大，缩放到合适大小）
    model.setScale(0.6)
    
    // 添加轻微的浮动动画
    this.tweens.add({
      targets: model,
      y: y + 5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    return model
  }
}

