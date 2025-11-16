// 主菜单场景 - 我是职业体验官
export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' })
  }
  
  create() {
    const centerX = 450
    const centerY = 350
    
    // 背景
    this.add.rectangle(0, 0, 900, 700, 0x2d3561).setOrigin(0)
    
    // 主标题
    this.add.text(centerX, 80, '🎮 我是职业体验官', {
      fontSize: '64px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // 副标题
    this.add.text(centerX, 160, '探索不同职业，体验精彩人生', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffeb3b'
    }).setOrigin(0.5)
    
    // 欢迎语
    this.add.text(centerX, 210, '选择你想体验的职业', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#90caf9'
    }).setOrigin(0.5)
    
    // 职业选择按钮
    this.createCareerButton(centerX, 280, '🚔 警察学校', '学习抓捕技巧，成为正义卫士', 0x2196f3, 'PoliceMenuScene')
    this.createCareerButton(centerX, 380, '🚗 汽车美容师', '打造完美座驾，展现专业技术', 0x4caf50, 'CarMenuScene')
    this.createCareerButton(centerX, 480, '👗 时装造型师', '设计时尚造型，引领潮流风向', 0xe91e63, 'FashionScene')
    this.createCareerButton(centerX, 580, '🧋 奶茶大师', '调制美味饮品，创造甜蜜时光', 0xff9800, 'BubbleTeaScene')
    
    // 底部提示
    this.add.text(centerX, 660, '💡 提示：点击任意职业开始体验', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#90caf9'
    }).setOrigin(0.5)
  }
  
  createCareerButton(x, y, title, description, color, targetScene) {
    // 按钮背景
    const button = this.add.rectangle(x, y, 600, 80, color, 0.8)
      .setInteractive({ useHandCursor: true })
    
    // 职业名称
    const titleText = this.add.text(x, y - 15, title, {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // 职业描述
    const descText = this.add.text(x, y + 15, description, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5)
    
    // 判断是否已实现
    const isImplemented = targetScene === 'PoliceMenuScene' || targetScene === 'CarMenuScene'
    
    if (!isImplemented) {
      // 未实现的职业添加"敬请期待"标签
      const comingSoon = this.add.text(x + 250, y, '敬请期待', {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#ffeb3b',
        fontStyle: 'bold',
        backgroundColor: '#000000',
        padding: { x: 8, y: 4 }
      }).setOrigin(0.5)
    }
    
    // 点击事件
    button.on('pointerdown', () => {
      if (isImplemented) {
        this.scene.start(targetScene)
      } else {
        // 显示"敬请期待"提示
        this.showComingSoonMessage()
      }
    })
    
    // 悬停效果
    button.on('pointerover', () => {
      button.setFillStyle(color, 1)
      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2'
      })
    })
    
    button.on('pointerout', () => {
      button.setFillStyle(color, 0.8)
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2'
      })
    })
  }
  
  showComingSoonMessage() {
    // 创建提示消息
    const message = this.add.text(450, 350, '🎮 该职业正在开发中\n敬请期待！', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 30, y: 20 },
      align: 'center'
    }).setOrigin(0.5).setDepth(1000)
    
    // 淡入效果
    message.setAlpha(0)
    this.tweens.add({
      targets: message,
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    })
    
    // 2秒后淡出并销毁
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: message,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
          message.destroy()
        }
      })
    })
  }
}


