export default class FinalVictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FinalVictoryScene' })
  }
  
  create() {
    const centerX = 450
    const centerY = 350
    
    // 背景渐变效果
    const graphics = this.add.graphics()
    graphics.fillGradientStyle(0x4caf50, 0x4caf50, 0x2196f3, 0x2196f3, 1)
    graphics.fillRect(0, 0, 900, 700)
    
    // 创建星星粒子效果
    this.createStarParticles()
    
    // 主标题 - 带动画
    const mainTitle = this.add.text(centerX, 150, '🎓 恭喜你从警察学校毕业！', {
      fontSize: '56px',
      fontFamily: 'Arial',
      color: '#ffeb3b',
      fontStyle: 'bold',
      stroke: '#ff9800',
      strokeThickness: 6
    }).setOrigin(0.5).setAlpha(0)
    
    // 标题淡入动画
    this.tweens.add({
      targets: mainTitle,
      alpha: 1,
      scale: { from: 0.5, to: 1 },
      duration: 1000,
      ease: 'Back.easeOut'
    })
    
    // 警察素质总结标题
    const qualityTitle = this.add.text(centerX, 240, '你已经具备了优秀警察的必备素质：', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffeb3b',
      fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0)
    
    this.tweens.add({
      targets: qualityTitle,
      alpha: 1,
      duration: 600,
      delay: 1000,
      ease: 'Power2'
    })
    
    // 警察素质列表
    const achievements = [
      '👁️ 观察力 - 能够准确判断嫌疑人的行动',
      '🧠 推理能力 - 预测嫌疑人的逃跑路线',
      '🤝 团队协作 - 与队友配合形成包围',
      '⚡ 决策能力 - 在关键时刻做出正确选择',
      '🎯 执行力 - 坚定执行抓捕计划'
    ]
    
    achievements.forEach((text, index) => {
      const achievementText = this.add.text(centerX, 300 + index * 50, text, {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#ffffff'
      }).setOrigin(0.5).setAlpha(0)
      
      this.tweens.add({
        targets: achievementText,
        alpha: 1,
        x: centerX,
        duration: 500,
        delay: 1600 + index * 250,
        ease: 'Power2'
      })
    })
    
    // 按钮
    this.time.delayedCall(3500, () => {
      this.createButton(centerX - 140, 640, '返回菜单', 0x2196f3, () => {
        this.scene.start('PoliceMenuScene')
      })
      
      this.createButton(centerX + 140, 640, '再玩一次', 0x4caf50, () => {
        this.scene.start('GameScene', { level: 1 })
      })
    })
  }
  
  createStarParticles() {
    // 创建闪烁的星星效果
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 900
      const y = Math.random() * 700
      const size = 2 + Math.random() * 3
      
      const star = this.add.circle(x, y, size, 0xffffff, 0.8)
      
      this.tweens.add({
        targets: star,
        alpha: { from: 0.3, to: 1 },
        scale: { from: 0.5, to: 1.5 },
        duration: 1000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2000
      })
    }
  }
  
  createButton(x, y, text, color, callback) {
    const button = this.add.rectangle(x, y, 220, 60, color)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0)
    
    const buttonText = this.add.text(x, y, text, {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0)
    
    // 按钮淡入
    this.tweens.add({
      targets: [button, buttonText],
      alpha: 1,
      duration: 500,
      ease: 'Power2'
    })
    
    button.on('pointerover', () => {
      button.setFillStyle(color, 0.8)
      this.tweens.add({
        targets: [button, buttonText],
        scale: 1.1,
        duration: 200
      })
    })
    
    button.on('pointerout', () => {
      button.setFillStyle(color, 1)
      this.tweens.add({
        targets: [button, buttonText],
        scale: 1,
        duration: 200
      })
    })
    
    button.on('pointerdown', callback)
  }
}

