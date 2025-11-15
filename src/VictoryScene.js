export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' })
  }
  
  create(data) {
    const { level } = data
    const centerX = 450
    const centerY = 350
    
    // 背景
    this.add.rectangle(0, 0, 900, 700, 0x2d3561).setOrigin(0)
    
    // 胜利标题
    this.add.text(centerX, 120, '🎉 恭喜过关！', {
      fontSize: '56px',
      fontFamily: 'Arial',
      color: '#4caf50',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // 关卡信息
    this.add.text(centerX, 200, `第${level}关 完成`, {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5)
    
    // 鼓励语 - 警察学校培训主题
    const messages = {
      1: '太棒了！你掌握了观察和预判的基本技巧！',
      2: '出色！你学会了团队配合，懂得封锁要点！',
      3: '完美！你已经具备了成为精英警察的素质！'
    }
    
    // 技能提示
    const skills = {
      1: '✓ 学会了：观察犯罪嫌疑人的移动路线',
      2: '✓ 学会了：与队友配合，形成包围圈',
      3: '✓ 学会了：综合运用策略，成功抓捕'
    }
    
    this.add.text(centerX, 260, messages[level], {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffeb3b'
    }).setOrigin(0.5)
    
    // 显示技能提示
    this.add.text(centerX, 310, skills[level], {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#4caf50'
    }).setOrigin(0.5)
    
    // 按钮区域
    if (level < 3) {
      // 不是最后一关，显示"下一关"按钮
      this.createButton(centerX, 360, '下一关', 0x4caf50, () => {
        this.scene.start('GameScene', { level: level + 1 })
      })
      
      this.createButton(centerX, 460, '返回菜单', 0x2196f3, () => {
        this.scene.start('MenuScene')
      })
    } else {
      // 最后一关，跳转到终极胜利页面
      this.time.delayedCall(2000, () => {
        this.scene.start('FinalVictoryScene')
      })
      
      this.add.text(centerX, 360, '即将进入终极胜利页面...', {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#90caf9'
      }).setOrigin(0.5)
    }
    
    // 重玩本关
    this.createButton(centerX, 560, '重玩本关', 0x757575, () => {
      this.scene.start('GameScene', { level })
    })
  }
  
  createButton(x, y, text, color, callback) {
    const button = this.add.rectangle(x, y, 250, 60, color)
      .setInteractive({ useHandCursor: true })
    
    const buttonText = this.add.text(x, y, text, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    button.on('pointerover', () => {
      button.setFillStyle(color, 0.8)
      button.setScale(1.05)
      buttonText.setScale(1.05)
    })
    
    button.on('pointerout', () => {
      button.setFillStyle(color, 1)
      button.setScale(1)
      buttonText.setScale(1)
    })
    
    button.on('pointerdown', callback)
  }
}

