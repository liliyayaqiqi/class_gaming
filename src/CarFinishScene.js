export default class CarFinishScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CarFinishScene' })
  }

  preload() {
    // 资源已在 CarBeauticianScene 中加载
  }

  create() {
    // 设置背景色
    this.cameras.main.setBackgroundColor('#87CEEB') // 天蓝色
    
    // 显示干净的车（648*648，向上移动）
    this.carClean = this.add.image(450, 340, 'car_clean')
    this.carClean.setDisplaySize(648, 648)
    
    // 创建持续的闪亮特效（范围调整到车身区域）
    this.createContinuousSparkles()
    
    // 显示奖励勋章
    this.medal = this.add.image(450, 120, 'reward_medal')
    this.medal.setScale(0)
    this.medal.setDepth(100)
    
    // 勋章缩放动画
    this.tweens.add({
      targets: this.medal,
      scale: 0.6,
      duration: 600,
      ease: 'Back.easeOut',
      delay: 500
    })
    
    // 勋章旋转动画
    this.tweens.add({
      targets: this.medal,
      angle: 360,
      duration: 2000,
      repeat: -1,
      ease: 'Linear'
    })
    
    // 显示主标题文字
    this.time.delayedCall(800, () => {
      const titleText = this.add.text(450, 200, '🎉 校车干净了！', {
        fontSize: '40px',
        fontFamily: 'Arial',
        color: '#ffeb3b',
        fontStyle: 'bold',
        stroke: '#2196f3', // 改为蓝色描边
        strokeThickness: 6 // 加粗描边
      }).setOrigin(0.5).setAlpha(0).setDepth(200) // 提高深度到200，确保在最前面
      
      this.tweens.add({
        targets: titleText,
        alpha: 1,
        scale: 1.05,
        duration: 500,
        ease: 'Back.easeOut'
      })
      
      // 文字跳动效果
      this.tweens.add({
        targets: titleText,
        y: 195,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    })
    
    // 显示技能学习文字
    this.time.delayedCall(1200, () => {
      // 创建banner背景（半透明深色背景）
      const bannerBg = this.add.rectangle(450, 550, 750, 200, 0x000000, 0.75)
      bannerBg.setDepth(150)
      bannerBg.setAlpha(0)
      
      // 添加边框装饰
      const bannerBorder = this.add.rectangle(450, 550, 750, 200)
      bannerBorder.setStrokeStyle(4, 0xffd700, 1) // 金色边框
      bannerBorder.setDepth(151)
      bannerBorder.setAlpha(0)
      
      // banner淡入动画
      this.tweens.add({
        targets: [bannerBg, bannerBorder],
        alpha: 1,
        duration: 400,
        ease: 'Sine.easeOut'
      })
      
      const skillTitle = this.add.text(450, 480, '作为汽车美容师，你学会了：', {
        fontSize: '26px',
        fontFamily: 'Arial',
        color: '#ffeb3b',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5).setAlpha(0).setDepth(160)
      
      const skills = [
        '✨ 耐心细致 - 认真冲洗每一处污渍',
        '✨ 按步骤做事 - 冲水、打泡、擦干有顺序',
        '✨ 爱护物品 - 让校车保持整洁美观'
      ]
      
      const skillTexts = []
      skills.forEach((skill, index) => {
        const skillText = this.add.text(450, 530 + index * 40, skill, {
          fontSize: '20px',
          fontFamily: 'Arial',
          color: '#ffffff',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5).setAlpha(0).setDepth(160)
        skillTexts.push(skillText)
      })
      
      // 标题淡入
      this.tweens.add({
        targets: skillTitle,
        alpha: 1,
        duration: 400,
        delay: 200
      })
      
      // 技能逐个淡入
      skillTexts.forEach((text, index) => {
        this.tweens.add({
          targets: text,
          alpha: 1,
          x: 450,
          duration: 400,
          delay: 400 + index * 200,
          ease: 'Back.easeOut'
        })
      })
    })
    
    // 创建按钮组
    this.time.delayedCall(2500, () => {
      this.createButtons()
    })
  }

  createContinuousSparkles() {
    // 定时创建闪亮特效（在车身区域）
    this.time.addEvent({
      delay: 300,
      callback: () => {
        const x = 200 + Math.random() * 500  // 车身宽度范围
        const y = 150 + Math.random() * 500  // 车身高度范围
        this.createSparkleEffect(x, y)
      },
      loop: true
    })
  }

  createSparkleEffect(x, y) {
    const sparkle = this.add.image(x, y, 'fx_sparkle')
    sparkle.setScale(0.2 + Math.random() * 0.2)
    sparkle.setAlpha(0)
    sparkle.setDepth(50)
    
    this.tweens.add({
      targets: sparkle,
      alpha: 1,
      scale: sparkle.scale * 1.5,
      angle: 360,
      duration: 800,
      yoyo: true,
      onComplete: () => {
        sparkle.destroy()
      }
    })
  }

  createButtons() {
    // 再玩一次按钮（提高深度到170，在banner之上）
    const replayButton = this.add.rectangle(350, 660, 140, 50, 0x4caf50)
      .setInteractive({ useHandCursor: true })
      .setDepth(170)
    
    const replayText = this.add.text(350, 660, '再玩一次', {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(171)
    
    replayButton.on('pointerdown', () => {
      this.scene.start('CarBeauticianScene')
    })
    
    replayButton.on('pointerover', () => {
      replayButton.setFillStyle(0x45a049)
      replayButton.setScale(1.05)
    })
    
    replayButton.on('pointerout', () => {
      replayButton.setFillStyle(0x4caf50)
      replayButton.setScale(1)
    })
    
    // 返回菜单按钮（提高深度到170，在banner之上）
    const menuButton = this.add.rectangle(550, 660, 140, 50, 0x2196f3)
      .setInteractive({ useHandCursor: true })
      .setDepth(170)
    
    const menuText = this.add.text(550, 660, '返回菜单', {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(171)
    
    menuButton.on('pointerdown', () => {
      this.scene.start('CarMenuScene')
    })
    
    menuButton.on('pointerover', () => {
      menuButton.setFillStyle(0x1976d2)
      menuButton.setScale(1.05)
    })
    
    menuButton.on('pointerout', () => {
      menuButton.setFillStyle(0x2196f3)
      menuButton.setScale(1)
    })
    
    // 按钮入场动画
    replayButton.setAlpha(0)
    replayText.setAlpha(0)
    menuButton.setAlpha(0)
    menuText.setAlpha(0)
    
    this.tweens.add({
      targets: [replayButton, replayText],
      alpha: 1,
      y: 660,
      duration: 400,
      ease: 'Back.easeOut'
    })
    
    this.tweens.add({
      targets: [menuButton, menuText],
      alpha: 1,
      y: 660,
      duration: 400,
      delay: 200,
      ease: 'Back.easeOut'
    })
  }
}

