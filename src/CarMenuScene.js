export default class CarMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CarMenuScene' })
  }

  preload() {
    // 加载车辆图标
    this.load.image('car_clean', '/car/car_clean.png')
  }

  create() {
    // 设置背景色
    this.cameras.main.setBackgroundColor('#87CEEB') // 天蓝色
    
    // 左上角返回主菜单按钮（小号）
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
    
    // 主标题（可爱字体）
    const title = this.add.text(450, 120, '我是汽车美容师', {
      fontSize: '56px',
      fontFamily: 'Arial',
      color: '#ff6b9d',
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
    
    // 副标题（流程说明）
    const subtitle = this.add.text(450, 190, '💦 冲水 → 🧽 抹泡泡 → ✨ 擦干', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffeb3b',
      fontStyle: 'bold',
      stroke: '#ff9800',
      strokeThickness: 4
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
    
    // 居中显示车辆图标
    const carIcon = this.add.image(450, 390, 'car_clean')
    carIcon.setDisplaySize(400, 400)
    
    // 车辆图标动画
    this.tweens.add({
      targets: carIcon,
      displayWidth: 420,
      displayHeight: 420,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // 开始游戏按钮（车辆下方）
    const startButton = this.add.rectangle(450, 600, 200, 70, 0x4caf50)
      .setInteractive({ useHandCursor: true })
    
    const startText = this.add.text(450, 600, '🚗 开始游戏', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    startButton.on('pointerdown', () => {
      this.scene.start('CarBeauticianScene')
    })
    
    startButton.on('pointerover', () => {
      startButton.setFillStyle(0x45a049)
      startButton.setScale(1.1)
      startText.setScale(1.1)
    })
    
    startButton.on('pointerout', () => {
      startButton.setFillStyle(0x4caf50)
      startButton.setScale(1)
      startText.setScale(1)
    })
  }
}

