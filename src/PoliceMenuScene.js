// 警察学校菜单场景
export default class PoliceMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PoliceMenuScene' })
  }
  
  create() {
    const centerX = 450
    const centerY = 350
    
    // 背景
    this.add.rectangle(0, 0, 900, 700, 0x2d3561).setOrigin(0)
    
    // 返回按钮
    this.createBackButton()
    
    // 标题
    this.add.text(centerX, 80, '🎓 警察学校', {
      fontSize: '64px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // 副标题
    this.add.text(centerX, 160, '从新手到抓捕高手的成长之路', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffeb3b'
    }).setOrigin(0.5)
    
    // 欢迎语
    this.add.text(centerX, 200, '选择你的训练课程', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#90caf9'
    }).setOrigin(0.5)
    
    // 关卡选择
    this.createLevelButton(centerX, 270, 1, '新手训练：基础抓捕', '学习观察和预判，掌握基本技巧', 0x4caf50)
    this.createLevelButton(centerX, 390, 2, '实战演练：团队配合', '学会与队友协作，封锁逃跑路线', 0x2196f3)
    this.createLevelButton(centerX, 510, 3, '毕业考核：抓捕高手', '综合运用所学技能，成为精英警察', 0xff9800)
    
    // 说明
    this.add.text(centerX, 630, '💡 提示：从第一关开始，循序渐进', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#90caf9'
    }).setOrigin(0.5)
  }
  
  createBackButton() {
    // 返回主菜单按钮
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
  
  createLevelButton(x, y, level, title, description, color) {
    // 按钮背景
    const button = this.add.rectangle(x, y, 500, 90, color, 0.8)
      .setInteractive({ useHandCursor: true })
    
    // 关卡标题
    const titleText = this.add.text(x, y - 15, title, {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // 关卡描述
    const descText = this.add.text(x, y + 15, description, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5)
    
    // 悬停效果
    button.on('pointerover', () => {
      button.setFillStyle(color, 1)
      button.setScale(1.05)
      titleText.setScale(1.05)
      descText.setScale(1.05)
    })
    
    button.on('pointerout', () => {
      button.setFillStyle(color, 0.8)
      button.setScale(1)
      titleText.setScale(1)
      descText.setScale(1)
    })
    
    // 点击开始游戏
    button.on('pointerdown', () => {
      this.scene.start('GameScene', { level })
    })
  }
}


