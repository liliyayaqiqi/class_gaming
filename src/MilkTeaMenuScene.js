export default class MilkTeaMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MilkTeaMenuScene' })
  }

  preload() {
    // 加载奶茶图片
    this.load.image('bubbleTea', 'tea/bubbleTea.png')
  }

  create() {
    // 设置背景色（小麦色，让内容更清晰）
    this.cameras.main.setBackgroundColor('#F5DEB3')
    
    // 左上角返回主菜单按钮
    const menuButton = this.add.rectangle(80, 30, 140, 40, 0xff9800)
      .setInteractive({ useHandCursor: true })
    
    const menuText = this.add.text(80, 30, '返回主菜单', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    menuButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene')
    })
    
    menuButton.on('pointerover', () => {
      menuButton.setFillStyle(0xf57c00)
      menuButton.setScale(1.05)
      menuText.setScale(1.05)
    })
    
    menuButton.on('pointerout', () => {
      menuButton.setFillStyle(0xff9800)
      menuButton.setScale(1)
      menuText.setScale(1)
    })
    
    // 主标题
    const title = this.add.text(450, 120, '🧋 我是奶茶大师', {
      fontSize: '56px',
      fontFamily: 'Arial',
      color: '#8B4513',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 8,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 5,
        fill: true
      }
    }).setOrigin(0.5)
    
    // 标题动画
    this.tweens.add({
      targets: title,
      y: 115,
      scale: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // 副标题（流程说明 - 按实际制作顺序）
    const subtitle = this.add.text(450, 190, '🧊 配料 → 🍬 糖度 → 🍵 茶底 → 🥛 牛奶 → 🍓 水果', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#D2691E',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 3
    }).setOrigin(0.5)
    
    // 副标题动画
    this.tweens.add({
      targets: subtitle,
      alpha: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // 显示奶茶图片（静态资源）
    const bubbleTea = this.add.image(450, 380, 'bubbleTea')
    bubbleTea.setScale(0.5) // 原始大小648x648，缩放到324x324
    
    // 添加缩放动画（略微变大再恢复）
    this.tweens.add({
      targets: bubbleTea,
      scale: 0.55, // 从0.5放大到0.55
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // 开始游戏按钮
    const startButton = this.add.rectangle(450, 600, 200, 70, 0xFF6B9D)
      .setInteractive({ useHandCursor: true })
    
    const startText = this.add.text(450, 600, '🎮 开始游戏', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    startButton.on('pointerdown', () => {
      this.scene.start('MilkTeaGameScene')
    })
    
    startButton.on('pointerover', () => {
      startButton.setFillStyle(0xFF1493)
      startButton.setScale(1.1)
      startText.setScale(1.1)
    })
    
    startButton.on('pointerout', () => {
      startButton.setFillStyle(0xFF6B9D)
      startButton.setScale(1)
      startText.setScale(1)
    })
  }
}

