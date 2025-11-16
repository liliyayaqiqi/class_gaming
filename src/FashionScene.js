// 时装造型师场景（占位）
export default class FashionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FashionScene' })
  }
  
  create() {
    const centerX = 450
    const centerY = 350
    
    // 背景
    this.add.rectangle(0, 0, 900, 700, 0x2d3561).setOrigin(0)
    
    // 返回按钮
    this.createBackButton()
    
    // 标题
    this.add.text(centerX, centerY - 100, '👗 时装造型师', {
      fontSize: '64px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // 提示信息
    this.add.text(centerX, centerY, '该职业体验正在开发中', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffeb3b'
    }).setOrigin(0.5)
    
    this.add.text(centerX, centerY + 60, '敬请期待！', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#90caf9'
    }).setOrigin(0.5)
    
    // 职业简介
    this.add.text(centerX, centerY + 150, '在这里你将学习：\n• 色彩搭配技巧\n• 服装款式设计\n• 造型风格打造\n• 时尚潮流把握', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 10
    }).setOrigin(0.5)
  }
  
  createBackButton() {
    const backButton = this.add.rectangle(80, 40, 120, 40, 0x607d8b, 0.8)
      .setInteractive({ useHandCursor: true })
    
    const backText = this.add.text(80, 40, '← 返回', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    backButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene')
    })
    
    backButton.on('pointerover', () => {
      backButton.setFillStyle(0x455a64, 1)
    })
    
    backButton.on('pointerout', () => {
      backButton.setFillStyle(0x607d8b, 0.8)
    })
  }
}


