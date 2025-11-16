export default class CarBeauticianScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CarBeauticianScene' })
  }

  init() {
    // 游戏状态：'intro', 'spray', 'foam', 'dry', 'complete'
    this.gamePhase = 'intro'
    
    // 污渍数组（多个污渍叠加）
    this.dirts = []
    
    // 泡泡层
    this.foamLayer = null
    
    // 灰尘效果层（用于冲水完成后）
    this.dustLayer = null
    
    // 擦干区域（8个）
    this.dryAreas = []
    this.dryProgress = 0
    
    // 工具
    this.currentTool = null
    
    // 冲水进度
    this.sprayProgress = 0
    this.sprayTimer = null
    this.isSprayingActive = false
    this.sprayPhaseCompleted = false
    
    // 擦泡泡进度
    this.foamProgress = 0
    this.foamTimer = null
    this.isSpongeActive = false
    this.foamPhaseCompleted = false
    
    // 水珠特效数组
    this.waterDrops = []
  }

  preload() {
    // 加载车辆资源
    this.load.image('car_dirty', '/car/car_dirty.png')
    this.load.image('car_clean', '/car/car_clean.png')
    
    // 加载污渍
    this.load.image('dirt_01', '/car/dirt_01.png')
    this.load.image('dirt_02', '/car/dirt_02.png')
    this.load.image('dirt_03', '/car/dirt_03.png')
    
    // 加载泡泡层
    this.load.image('foam_layer', '/car/foam_layer.png')
    
    // 加载工具
    this.load.image('tool_spray', '/car/tool_spray.png')
    this.load.image('tool_sponge', '/car/tool_sponge.png')
    
    // 加载UI按钮
    this.load.image('ui_foam_button', '/car/ui_foam_button.png')
    this.load.image('ui_next_button', '/car/ui_next_button.png')
    
    // 加载特效和奖励
    this.load.image('fx_sparkle', '/car/fx_sparkle.png')
    this.load.image('reward_medal', '/car/reward_medal.png')
  }

  create() {
    // 设置背景色
    this.cameras.main.setBackgroundColor('#87CEEB') // 天蓝色
    
    // 创建顶部进度指示器
    this.createProgressIndicator()
    
    // 创建脏车（648*648，稍微向上移动）
    this.carDirty = this.add.image(450, 360, 'car_dirty')
    this.carDirty.setDisplaySize(648, 648)
    this.carDirty.setDepth(1)
    
    // 创建干净车（初始隐藏，在脏车下层）
    this.carClean = this.add.image(450, 360, 'car_clean')
    this.carClean.setDisplaySize(648, 648)
    this.carClean.setVisible(false)
    this.carClean.setAlpha(0)
    this.carClean.setDepth(0)
    
    // 添加返回主菜单按钮（左上角）
    this.createMenuButton()
    
    // 开始介绍环节
    this.showIntro()
  }
  
  createProgressIndicator() {
    // 顶部居中显示当前阶段名称
    this.stageTitle = this.add.text(450, 40, '', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(1000)
  }
  
  updateProgressIndicator(currentStep) {
    // 更新阶段名称（不显示"阶段"两个字）
    if (currentStep === 'spray') {
      this.stageTitle.setText('💦 冲水')
    } else if (currentStep === 'foam') {
      this.stageTitle.setText('🧽 泡沫')
    } else if (currentStep === 'dry') {
      this.stageTitle.setText('✨ 擦干')
    }
  }

  createMenuButton() {
    // 返回主菜单按钮（左上角）
    const menuButton = this.add.rectangle(80, 30, 140, 40, 0x2196f3)
      .setInteractive({ useHandCursor: true })
    menuButton.setDepth(2000)
    
    const menuText = this.add.text(80, 30, '返回主菜单', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    menuText.setDepth(2001)
    
    menuButton.on('pointerdown', () => {
      this.scene.start('CarMenuScene')
    })
    
    menuButton.on('pointerover', () => {
      menuButton.setFillStyle(0x1976d2)
    })
    
    menuButton.on('pointerout', () => {
      menuButton.setFillStyle(0x2196f3)
    })
  }

  showIntro() {
    this.gamePhase = 'intro'
    
    // 先创建30个污渍在脏车上
    this.createInitialDirts()
    
    // 显示提示文字（底部居中，儿童化表达，可爱字体）
    this.instructionText = this.add.text(450, 680, '🚗 校车脏了，我们帮它美美容吧！', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffeb3b',
      fontStyle: 'bold',
      stroke: '#ff6b9d',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(1000)
    
    // 创建开始按钮（右下角，使用简单的文字按钮）
    const buttonBg = this.add.rectangle(820, 680, 140, 60, 0x4caf50, 1)
    buttonBg.setDepth(1000)
    buttonBg.setInteractive({ useHandCursor: true })
    
    const buttonText = this.add.text(820, 680, '开始', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    buttonText.setDepth(1001)
    
    this.nextButton = this.add.container(0, 0, [buttonBg, buttonText])
    this.nextButton.setDepth(1000)
    
    buttonBg.on('pointerdown', () => {
      this.nextButton.destroy()
      this.nextButton = null
      this.startSprayPhase()
    })
    
    buttonBg.on('pointerover', () => {
      buttonBg.setFillStyle(0x45a049)
      buttonBg.setScale(1.1)
      buttonText.setScale(1.1)
    })
    
    buttonBg.on('pointerout', () => {
      buttonBg.setFillStyle(0x4caf50)
      buttonBg.setScale(1)
      buttonText.setScale(1)
    })
  }

  // 创建初始的30个污渍（在intro阶段就显示）
  createInitialDirts() {
    // 生成30个污渍位置，集中在车身安全区域
    // 车头在右边，避开左上角和四周边缘
    const dirtPositions = []
    for (let i = 0; i < 30; i++) {
      let x, y
      let isValid = false
      
      // 重复生成直到找到有效位置（集中在安全区域）
      while (!isValid) {
        // 更集中的安全区域：x: 300-650, y: 250-600
        x = 300 + Math.random() * 350
        y = 250 + Math.random() * 350
        
        isValid = true
      }
      
      dirtPositions.push({ x, y })
    }
    
    dirtPositions.forEach((pos, index) => {
      const dirtKey = `dirt_0${(index % 3) + 1}`
      const dirt = this.add.image(pos.x, pos.y, dirtKey)
      dirt.setDisplaySize(50 + Math.random() * 20, 50 + Math.random() * 20) // 大小随机
      dirt.setDepth(5)
      dirt.setActive(true)
      dirt.setAlpha(0.7 + Math.random() * 0.3) // 随机透明度
      this.dirts.push(dirt)
    })
  }

  startSprayPhase() {
    this.gamePhase = 'spray'
    
    // 更新阶段标题
    this.updateProgressIndicator('spray')
    
    // 简化提示文字（底部居中）
    this.instructionText.setText('用水枪冲洗汽车')
    
    // 污渍已经在 intro 阶段创建，不需要重新创建
    // 但需要为每个污渍记录初始alpha，用于单独控制
    this.dirts.forEach(dirt => {
      dirt.setData('initialAlpha', dirt.alpha)
      dirt.setData('sprayProgress', 0) // 每个污渍独立的冲洗进度
    })
    
    // 创建进度条（显示出来）
    this.sprayProgressBg = this.add.rectangle(450, 100, 400, 30, 0x333333, 0.8)
    this.sprayProgressBg.setDepth(200)
    
    this.sprayProgressBar = this.add.rectangle(252, 100, 2, 26, 0x4fc3f7, 1)
    this.sprayProgressBar.setDepth(201)
    this.sprayProgressBar.setOrigin(0, 0.5)
    
    this.sprayProgressText = this.add.text(450, 100, '冲水进度: 0%', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(202)
    
    // 创建水枪工具（添加错误处理和备用方案，调大尺寸）
    try {
      this.sprayTool = this.add.image(100, 300, 'tool_spray')
      this.sprayTool.setDisplaySize(120, 120) // 从80增加到120
      
      if (!this.textures.exists('tool_spray')) {
        console.warn('水枪图片未加载，使用备用方案')
        this.createBackupSprayTool()
      }
    } catch (error) {
      console.error('加载水枪工具失败:', error)
      this.createBackupSprayTool()
    }
    
    if (this.sprayTool) {
      this.sprayTool.setInteractive({ draggable: true, useHandCursor: true })
      this.sprayTool.setDepth(100)
    }
    
    // 工具拖拽逻辑
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY
      
      // 检查与污渍的重叠
      if (this.gamePhase === 'spray') {
        this.isSprayingActive = true
        this.checkSprayCollision(gameObject)
        this.createWaterEffect(dragX, dragY) // 添加水特效
      }
    })
    
    // 拖拽开始
    this.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setScale(gameObject.scale * 1.1)
      this.isSprayingActive = true
    })
    
    // 拖拽结束
    this.input.on('dragend', (pointer, gameObject) => {
      gameObject.setScale(gameObject.scale / 1.1)
      this.isSprayingActive = false
      
      // 拖拽结束后再检查一次是否所有污渍都清除了
      if (this.gamePhase === 'spray') {
        this.time.delayedCall(100, () => {
          this.checkAllDirtsCleared()
        })
      }
    })
    
    // 重置进度和标记
    this.sprayProgress = 0
    this.allDirtsCleared = false // 标记污渍是否已全部清除
    
    // 启动计时器（只在有效冲水时计时）
    this.sprayTimer = this.time.addEvent({
      delay: 100,
      callback: this.updateSprayProgress,
      callbackScope: this,
      loop: true
    })
  }
  
  createBackupSprayTool() {
    // 备用方案：用图形绘制一个水枪图标（调大尺寸）
    if (this.sprayTool) {
      this.sprayTool.destroy()
    }
    
    const container = this.add.container(100, 300)
    
    // 绘制水枪形状（放大1.5倍）
    const graphics = this.add.graphics()
    graphics.fillStyle(0x4fc3f7, 1) // 浅蓝色
    graphics.fillCircle(0, 0, 30) // 从20增加到30
    graphics.fillRect(22, -8, 38, 16) // 从(15, -5, 25, 10)放大
    graphics.fillStyle(0xffffff, 1)
    graphics.fillCircle(0, 0, 15) // 从10增加到15
    
    // 添加水滴图标
    graphics.fillStyle(0x2196f3, 1)
    graphics.fillCircle(45, -22, 8) // 从(30, -15, 5)放大
    graphics.fillCircle(52, -30, 6) // 从(35, -20, 4)放大
    
    container.add(graphics)
    container.setSize(90, 90) // 从(60, 60)增加到(90, 90)
    container.setDepth(100)
    
    this.sprayTool = container
  }
  
  
  updateSprayProgress() {
    // 只在有效冲水时增加进度
    if (this.isSprayingActive && this.gamePhase === 'spray') {
      this.sprayProgress += 100 / 150 // 15秒 = 150个0.1秒
      
      // 限制进度不超过100
      if (this.sprayProgress > 100) {
        this.sprayProgress = 100
      }
      
      // 更新进度条显示
      const barWidth = (this.sprayProgress / 100) * 396
      this.sprayProgressBar.width = Math.max(2, barWidth)
      this.sprayProgressText.setText(`冲水进度: ${Math.floor(this.sprayProgress)}%`)
      
      // 如果所有污渍已清除，且进度超过50%，开始淡入淡出
      if (this.allDirtsCleared && this.sprayProgress > 50) {
        // 显示干净车（如果还没显示）
        if (!this.carClean.visible) {
          this.carClean.setVisible(true)
          this.carClean.setAlpha(0)
          
          // 创建灰尘效果层（初始透明）
          this.createDustLayer()
          this.dustParticles.forEach(dust => {
            dust.setAlpha(0)
          })
        }
        
        // 后50%的进度用于淡入淡出（50%-100% 映射到 0%-100%）
        const fadeRawProgress = (this.sprayProgress - 50) / 50 // 0-1
        
        // 使用缓动函数让淡入淡出更丝滑（easeInOutQuad）
        const fadeProgress = fadeRawProgress < 0.5 
          ? 2 * fadeRawProgress * fadeRawProgress 
          : 1 - Math.pow(-2 * fadeRawProgress + 2, 2) / 2
        
        // 脏车淡出（更丝滑的过渡）
        this.carDirty.setAlpha(1 - fadeProgress)
        
        // 干净车淡入（更丝滑的过渡）
        this.carClean.setAlpha(fadeProgress)
        
        // 灰尘效果同步淡入（最终alpha为0.15-0.3，使用缓动）
        if (this.dustParticles) {
          this.dustParticles.forEach(dust => {
            const targetAlpha = dust.getData('targetAlpha') || 0.15
            dust.setAlpha(targetAlpha * fadeProgress)
          })
        }
      }
      
      // 进度达到100%，完成冲水阶段
      if (this.sprayProgress >= 100) {
        this.completeSprayPhase()
      }
    }
  }
  
  // 检查水枪与污渍的碰撞（只影响接触的污渍）
  checkSprayCollision(tool) {
    let hasRemovedDirt = false
    
    this.dirts.forEach(dirt => {
      if (!dirt.active) return
      
      const distance = Phaser.Math.Distance.Between(
        tool.x, tool.y,
        dirt.x, dirt.y
      )
      
      // 如果水枪在污渍附近（范围80px）
      if (distance < 80) {
        // 增加这个污渍的冲洗进度
        let sprayProgress = dirt.getData('sprayProgress') || 0
        sprayProgress += 2 // 每次增加2%
        dirt.setData('sprayProgress', sprayProgress)
        
        // 根据冲洗进度减少污渍的透明度
        const initialAlpha = dirt.getData('initialAlpha')
        const targetAlpha = initialAlpha * (1 - sprayProgress / 100)
        dirt.setAlpha(Math.max(0, targetAlpha))
        
        // 如果冲洗进度达到100%，标记为已清除
        if (sprayProgress >= 100) {
          dirt.setActive(false)
          dirt.setVisible(false)
          hasRemovedDirt = true
          console.log('污渍已清除！剩余污渍:', this.dirts.filter(d => d.active).length)
        }
      }
    })
    
    // 如果刚刚清除了污渍，检查是否所有污渍都被清除
    if (hasRemovedDirt) {
      this.checkAllDirtsCleared()
    }
  }
  
  checkAllDirtsCleared() {
    const activeDirts = this.dirts.filter(d => d.active)
    console.log('🔍 检查污渍清除状态，剩余活跃污渍:', activeDirts.length)
    
    if (activeDirts.length === 0 && !this.allDirtsCleared) {
      console.log('✅ 所有污渍已清除，继续冲水到50%后开始淡入淡出')
      this.allDirtsCleared = true
      // 不重置进度，让进度条自然继续，到50%后触发淡入淡出
    }
  }
  
  createWaterEffect(x, y) {
    // 创建水滴特效
    const waterDrop = this.add.circle(x + Phaser.Math.Between(-20, 20), 
                                       y + Phaser.Math.Between(-20, 20), 
                                       Phaser.Math.Between(2, 5), 
                                       0x4fc3f7, 0.8)
    waterDrop.setDepth(50)
    
    this.tweens.add({
      targets: waterDrop,
      y: waterDrop.y + Phaser.Math.Between(30, 60),
      alpha: 0,
      scale: 0.5,
      duration: Phaser.Math.Between(300, 600),
      ease: 'Quad.easeOut',
      onComplete: () => {
        waterDrop.destroy()
      }
    })
  }
  
  completeSprayPhase() {
    // 防止重复调用
    if (this.sprayPhaseCompleted) {
      return
    }
    this.sprayPhaseCompleted = true
    
    console.log('✅ 冲水阶段完成！')
    
    // 停止计时器
    if (this.sprayTimer) {
      this.sprayTimer.remove()
      this.sprayTimer = null
    }
    
    // 销毁并隐藏水枪工具
    if (this.sprayTool) {
      if (this.sprayTool.active) {
        this.sprayTool.destroy()
      }
      this.sprayTool = null
    }
    
    // 销毁所有污渍
    this.dirts.forEach(dirt => {
      if (dirt && dirt.active) {
        dirt.destroy()
      }
    })
    this.dirts = []
    
    // 销毁进度条
    if (this.sprayProgressBg && this.sprayProgressBg.active) {
      this.sprayProgressBg.destroy()
      this.sprayProgressBg = null
    }
    if (this.sprayProgressBar && this.sprayProgressBar.active) {
      this.sprayProgressBar.destroy()
      this.sprayProgressBar = null
    }
    if (this.sprayProgressText && this.sprayProgressText.active) {
      this.sprayProgressText.destroy()
      this.sprayProgressText = null
    }
    
    // 确保脏车完全隐藏，干净车和灰尘完全显示
    this.carDirty.setVisible(false)
    this.carClean.setVisible(true)
    this.carClean.setAlpha(1)
    
    // 确保灰尘效果最终显示
    if (this.dustParticles) {
      this.dustParticles.forEach(dust => {
        const targetAlpha = dust.getData('targetAlpha') || 0.15
        dust.setAlpha(targetAlpha)
      })
    }
    
    // 显示下一步按钮（右下角）
    if (!this.nextButton) {
      this.showNextButton(() => this.startFoamPhase())
    }
  }
  
  // 创建灰尘效果层
  createDustLayer() {
    console.log('🌫️ 创建灰尘效果层')
    
    // 如果已经创建过，直接返回
    if (this.dustParticles && this.dustParticles.length > 0) {
      return
    }
    
    this.dustParticles = []
    
    // 创建较少的、透明度较低的污渍作为灰尘效果，集中在车身安全区域
    const dustCount = 15
    for (let i = 0; i < dustCount; i++) {
      // 安全区域：x: 320-630, y: 270-580
      const x = 320 + Math.random() * 310
      const y = 270 + Math.random() * 310
      
      const dirtKey = `dirt_0${(i % 3) + 1}`
      
      const dust = this.add.image(x, y, dirtKey)
      dust.setDisplaySize(40 + Math.random() * 15, 40 + Math.random() * 15)
      dust.setDepth(10) // 在干净车之上
      
      // 记录目标透明度（最终的灰尘效果）
      const targetAlpha = 0.15 + Math.random() * 0.15
      dust.setData('targetAlpha', targetAlpha)
      dust.setAlpha(0) // 初始透明
      
      this.dustParticles.push(dust)
    }
  }


  showNextButton(callback) {
    console.log('🎯 创建简单的下一步按钮（右下角）')
    
    // 创建简单的下一步按钮
    const buttonBg = this.add.rectangle(820, 680, 120, 50, 0x4caf50, 1)
    buttonBg.setDepth(1000)
    buttonBg.setInteractive({ useHandCursor: true })
    
    const buttonText = this.add.text(820, 680, '下一步', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    buttonText.setDepth(1001)
    
    this.nextButton = this.add.container(0, 0, [buttonBg, buttonText])
    this.nextButton.setDepth(1000)
    
    buttonBg.on('pointerdown', () => {
      console.log('✅ 下一步按钮被点击！')
      this.nextButton.destroy()
      this.nextButton = null
      callback()
    })
    
    buttonBg.on('pointerover', () => {
      buttonBg.setFillStyle(0x45a049)
      buttonBg.setScale(1.05)
      buttonText.setScale(1.05)
    })
    
    buttonBg.on('pointerout', () => {
      buttonBg.setFillStyle(0x4caf50)
      buttonBg.setScale(1)
      buttonText.setScale(1)
    })
  }

  startFoamPhase() {
    this.gamePhase = 'foam'
    
    // 更新阶段标题
    this.updateProgressIndicator('foam')
    
    // 简化提示文字（底部居中）
    this.instructionText.setText('打泡沫清洁汽车')
    
    // 创建简单的下一步按钮（右下角）
    const buttonBg = this.add.rectangle(820, 680, 120, 50, 0x2196f3, 1)
    buttonBg.setDepth(1000)
    buttonBg.setInteractive({ useHandCursor: true })
    
    const buttonText = this.add.text(820, 680, '打泡沫', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    buttonText.setDepth(1001)
    
    this.foamButton = this.add.container(0, 0, [buttonBg, buttonText])
    this.foamButton.setDepth(1000)
    
    buttonBg.on('pointerdown', () => {
      this.applyFoam()
    })
    
    buttonBg.on('pointerover', () => {
      buttonBg.setFillStyle(0x1976d2)
      buttonBg.setScale(1.05)
      buttonText.setScale(1.05)
    })
    
    buttonBg.on('pointerout', () => {
      buttonBg.setFillStyle(0x2196f3)
      buttonBg.setScale(1)
      buttonText.setScale(1)
    })
  }

  applyFoam() {
    // 销毁泡泡按钮
    this.foamButton.destroy()
    
    // 简化提示文字（底部居中）
    this.instructionText.setText('用海绵擦掉泡泡')
    
    // 先销毁灰尘效果层
    if (this.dustParticles) {
      this.dustParticles.forEach(dust => {
        if (dust && dust.active) {
          dust.destroy()
        }
      })
      this.dustParticles = []
    }
    
    // 车辆已经是干净的了（在冲水阶段完成时已切换）
    
    // 先创建水滴层（在泡泡下面）
    this.createWaterDropsUnderFoam()
    
    // 显示"打泡泡中..."提示文字
    const foamingText = this.add.text(450, 360, '打泡泡中...', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffeb3b',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(20).setAlpha(0)
    
    // 文字淡入淡出动画
    this.tweens.add({
      targets: foamingText,
      alpha: 1,
      duration: 400
    })
    
    // 创建泡泡层（更大，完全覆盖整车，深度在水滴之上）
    this.foamLayer = this.add.image(450, 360, 'foam_layer')
    this.foamLayer.setDepth(12) // 在水滴之上
    this.foamLayer.setAlpha(0)
    
    // 先设置初始scale（放大2倍作为起始）
    const targetSize = 700 // 目标尺寸
    const originalWidth = this.foamLayer.width
    const targetScale = targetSize / originalWidth
    
    this.foamLayer.setScale(targetScale * 2) // 初始放大2倍
    
    // 泡泡渐显 + 缩放动画（从2倍缩小到目标大小）
    this.tweens.add({
      targets: this.foamLayer,
      alpha: 1,
      scale: targetScale, // 缩小到正好覆盖车辆的大小
      duration: 1500,
      ease: 'Back.easeOut',
      onUpdate: () => {
        // 泡泡逐渐覆盖的过程中，文字闪烁
        if (foamingText && foamingText.active) {
          if (foamingText.alpha > 0.5) {
            foamingText.alpha = 0.5
          } else {
            foamingText.alpha = 1
          }
        }
      },
      onComplete: () => {
        // 泡泡完全覆盖后，文字淡出消失
        if (foamingText && foamingText.active) {
          this.tweens.add({
            targets: foamingText,
            alpha: 0,
            duration: 400,
            onComplete: () => {
              foamingText.destroy()
            }
          })
        }
        this.showSponge()
      }
    })
    
    // 创建进度条背景
    this.foamProgressBg = this.add.rectangle(450, 100, 400, 30, 0x333333, 0.8)
    this.foamProgressBg.setDepth(200)
    
    // 创建进度条
    this.foamProgressBar = this.add.rectangle(252, 100, 2, 26, 0xffeb3b, 1)
    this.foamProgressBar.setDepth(201)
    this.foamProgressBar.setOrigin(0, 0.5)
    
    // 进度条文字
    this.foamProgressText = this.add.text(450, 100, '擦泡泡进度: 0%', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(202)
    
    // 重置进度
    this.foamProgress = 0
    
    // 启动计时器
    this.foamTimer = this.time.addEvent({
      delay: 100,
      callback: this.updateFoamProgress,
      callbackScope: this,
      loop: true
    })
  }
  
  // 在泡泡下面创建水滴层
  createWaterDropsUnderFoam() {
    console.log('💧 在泡泡下面创建水滴层')
    
    // 清空现有水滴
    if (this.waterDrops) {
      this.waterDrops.forEach(drop => {
        if (drop && drop.active) {
          drop.destroy()
        }
      })
    }
    
    this.waterDrops = []
    
    // 在车身安全区域创建水滴
    const dropCount = 50
    for (let i = 0; i < dropCount; i++) {
      // 安全区域：x: 300-650, y: 260-600
      const x = 300 + Math.random() * 350
      const y = 260 + Math.random() * 340
      
      // 创建水滴（蓝色圆点）
      const dropSize = 4 + Math.random() * 4
      const drop = this.add.circle(x, y, dropSize, 0x2196F3, 0.9)
      drop.setDepth(11) // 在干净车之上，但在泡泡之下
      this.waterDrops.push(drop)
      
      // 水滴闪烁效果
      this.tweens.add({
        targets: drop,
        alpha: 0.5,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }
  }

  showSponge() {
    // 创建海绵工具（添加错误处理和备用方案，调大尺寸）
    try {
      this.spongeTool = this.add.image(100, 300, 'tool_sponge')
      this.spongeTool.setDisplaySize(110, 110) // 从70增加到110
      
      // 检查图片是否正确加载
      if (!this.textures.exists('tool_sponge')) {
        console.warn('海绵图片未加载，使用备用方案')
        this.createBackupSpongeTool()
      }
    } catch (error) {
      console.error('加载海绵工具失败:', error)
      this.createBackupSpongeTool()
    }
    
    if (this.spongeTool) {
      this.spongeTool.setInteractive({ draggable: true, useHandCursor: true })
      this.spongeTool.setDepth(100)
    }
    
    // 更新拖拽逻辑
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY
      
      // 检查与泡泡层的重叠
      if (this.gamePhase === 'foam' && this.foamLayer) {
        this.isSpongeActive = true
        this.checkSpongeCollision(gameObject)
      }
    })
    
    // 拖拽开始
    this.input.on('dragstart', (pointer, gameObject) => {
      if (this.gamePhase === 'foam') {
        this.isSpongeActive = true
      }
    })
    
    // 拖拽结束
    this.input.on('dragend', (pointer, gameObject) => {
      if (this.gamePhase === 'foam') {
        this.isSpongeActive = false
      }
    })
  }
  
  createBackupSpongeTool() {
    // 备用方案：用图形绘制一个海绵图标（调大尺寸）
    if (this.spongeTool) {
      this.spongeTool.destroy()
    }
    
    const container = this.add.container(100, 300)
    
    // 绘制海绵形状（放大1.5倍）
    const graphics = this.add.graphics()
    graphics.fillStyle(0xffeb3b, 1) // 黄色
    graphics.fillRoundedRect(-38, -30, 76, 60, 12) // 从(-25, -20, 50, 40, 8)放大
    
    // 添加纹理孔洞（放大）
    graphics.fillStyle(0xffc107, 1)
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        graphics.fillCircle(-26 + i * 18, -16 + j * 16, 5) // 从(-15, -10, 15, 12, 3)放大
      }
    }
    
    container.add(graphics)
    container.setSize(90, 90) // 从(60, 60)增加到(90, 90)
    container.setDepth(100)
    
    this.spongeTool = container
  }

  checkSpongeCollision(tool) {
    if (!this.foamLayer) return
    
    const distance = Phaser.Math.Distance.Between(
      tool.x, tool.y,
      this.foamLayer.x, this.foamLayer.y
    )
    
    // 在车身范围内才有效
    if (distance < 300) {
      console.log('擦除泡泡中...透明度:', this.foamLayer.alpha.toFixed(2))
    }
  }
  
  updateFoamProgress() {
    // 只在有效擦除时增加进度
    if (this.isSpongeActive && this.gamePhase === 'foam' && this.foamLayer) {
      this.foamProgress += 100 / 150 // 15秒 = 150个0.1秒
      
      // 防止超过100%
      if (this.foamProgress > 100) {
        this.foamProgress = 100
      }
      
      // 更新进度条
      const barWidth = (this.foamProgress / 100) * 396
      this.foamProgressBar.width = Math.max(2, barWidth)
      this.foamProgressText.setText(`擦泡泡进度: ${Math.floor(this.foamProgress)}%`)
      
      // 根据进度严格同步减少泡泡透明度
      const targetAlpha = 1 - (this.foamProgress / 100)
      this.foamLayer.alpha = Math.max(0, targetAlpha)
      
      // 只有进度达到100%才完成
      if (this.foamProgress >= 100) {
        this.foamProgress = 100
        this.completeFoamPhase()
      }
    }
  }
  
  completeFoamPhase() {
    // 防止重复调用
    if (this.foamPhaseCompleted) {
      return
    }
    this.foamPhaseCompleted = true
    
    console.log('✅ 泡泡阶段完成！')
    
    // 停止计时器
    if (this.foamTimer) {
      this.foamTimer.remove()
      this.foamTimer = null
    }
    
    // 销毁泡泡层（水滴层保留，显示在下面）
    if (this.foamLayer && this.foamLayer.active) {
      this.foamLayer.destroy()
      this.foamLayer = null
    }
    
    // 销毁海绵
    if (this.spongeTool && this.spongeTool.active) {
      this.spongeTool.destroy()
      this.spongeTool = null
    }
    
    // 销毁进度条
    if (this.foamProgressBg && this.foamProgressBg.active) {
      this.foamProgressBg.destroy()
      this.foamProgressBg = null
    }
    if (this.foamProgressBar && this.foamProgressBar.active) {
      this.foamProgressBar.destroy()
      this.foamProgressBar = null
    }
    if (this.foamProgressText && this.foamProgressText.active) {
      this.foamProgressText.destroy()
      this.foamProgressText = null
    }
    
    // 水滴已经存在（在applyFoam时创建），不需要再创建
    
    // 延迟显示下一步按钮
    this.time.delayedCall(500, () => {
      if (!this.nextButton) {
        this.showNextButton(() => this.startDryPhase())
      }
    })
  }
  
  createWaterDropsOnCar() {
    console.log('💧 在干净车上创建更多水滴')
    
    // 清空现有水滴
    if (this.waterDrops) {
      this.waterDrops.forEach(drop => {
        if (drop && drop.active) {
          drop.destroy()
        }
      })
    }
    
    this.waterDrops = []
    
    // 在车身安全区域创建水滴
    const dropCount = 50
    for (let i = 0; i < dropCount; i++) {
      // 安全区域：x: 300-650, y: 260-600
      const x = 300 + Math.random() * 350
      const y = 260 + Math.random() * 340
      
      // 创建水滴（更大更明显的蓝色圆点）
      const dropSize = 4 + Math.random() * 4 // 增大水滴尺寸
      const drop = this.add.circle(x, y, dropSize, 0x2196F3, 0.9) // 更深的蓝色，更高透明度
      drop.setDepth(15)
      this.waterDrops.push(drop)
      
      // 水滴闪烁效果（更明显）
      this.tweens.add({
        targets: drop,
        alpha: 0.5,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }
  }

  startDryPhase() {
    this.gamePhase = 'dry'
    
    // 更新进度指示器
    this.updateProgressIndicator('dry')
    
    // 隐藏海绵
    if (this.spongeTool) {
      this.spongeTool.destroy()
    }
    
    // 简化提示文字（底部居中）
    this.instructionText.setText('按顺序擦干车身')
    
    // 8个擦干区域，更分散的分布在车身上（顺序打乱）
    // 车身中心450,400，尺寸648*648
    const areas = [
      { x: 250, y: 200, w: 120, h: 100, num: '①', order: 0 },
      { x: 400, y: 180, w: 120, h: 100, num: '②', order: 1 },
      { x: 550, y: 210, w: 120, h: 100, num: '③', order: 2 },
      { x: 230, y: 350, w: 120, h: 100, num: '④', order: 3 },
      { x: 420, y: 380, w: 120, h: 100, num: '⑤', order: 4 },
      { x: 580, y: 360, w: 120, h: 100, num: '⑥', order: 5 },
      { x: 310, y: 540, w: 120, h: 100, num: '⑦', order: 6 },
      { x: 510, y: 560, w: 120, h: 100, num: '⑧', order: 7 }
    ]
    
    // 重置进度
    this.dryProgress = 0
    this.dryAreas = []
    
    areas.forEach((areaData, index) => {
      // 创建区域
      const area = this.add.rectangle(areaData.x, areaData.y, areaData.w, areaData.h, 0xffffff, 0)
      area.setInteractive({ useHandCursor: true })
      area.setDepth(20)
      area.order = areaData.order // 使用 order 字段而不是 index
      
      // 显示序号（红色，字体更大）
      const numText = this.add.text(areaData.x, areaData.y, areaData.num, {
        fontSize: '40px',  // 增大字体
        color: '#ff0000',  // 红色
        fontStyle: 'bold',
        stroke: '#ffffff',
        strokeThickness: 4
      }).setOrigin(0.5).setDepth(50)
      
      area.numText = numText
      area.areaX = areaData.x
      area.areaY = areaData.y
      
      area.on('pointerdown', () => {
        this.handleDryClick(area)
      })
      
      // 悬停效果
      area.on('pointerover', () => {
        if (this.dryProgress === area.order) {
          area.setFillStyle(0x4caf50, 0.3)
        }
      })
      
      area.on('pointerout', () => {
        if (!area.completed) {
          area.setFillStyle(0xffffff, 0)
        }
      })
      
      this.dryAreas.push(area)
    })
  }

  handleDryClick(area) {
    if (area.order === this.dryProgress) {
      // 正确的顺序
      this.dryProgress++
      area.completed = true
      
      // 创建抹布擦拭效果
      this.createClothWipeEffect(area.areaX, area.areaY)
      
      // 移除该区域的水珠（扩大清除范围）
      this.removeWaterDropsInArea(area.areaX, area.areaY, 80)
      
      // 闪亮特效
      this.createSparkleEffect(area.areaX, area.areaY)
      
      // 禁用该区域
      area.disableInteractive()
      area.setFillStyle(0x4caf50, 0.5)
      
      // 隐藏序号
      if (area.numText) {
        area.numText.destroy()
      }
      
      // 检查是否完成
      if (this.dryProgress >= 8) {
        this.time.delayedCall(500, () => {
          this.completeGame()
        })
      }
    } else {
      // 错误的顺序
      this.showMessage('请按照序号顺序擦干！', 0xff5252)
    }
  }
  
  // 创建抹布擦拭效果
  createClothWipeEffect(x, y) {
    // 创建抹布图形（圆角矩形，淡灰色）
    const cloth = this.add.graphics()
    cloth.fillStyle(0xcccccc, 1) // 淡灰色
    cloth.fillRoundedRect(-30, -20, 60, 40, 8)
    
    // 添加纹理线条（深灰色）
    cloth.lineStyle(2, 0x999999, 1)
    for (let i = 0; i < 5; i++) {
      cloth.lineBetween(-25 + i * 12, -15, -25 + i * 12, 15)
    }
    
    const clothSprite = this.add.container(x - 60, y - 60)
    clothSprite.add(cloth)
    clothSprite.setDepth(100)
    clothSprite.setAlpha(0)
    
    // 抹布淡入
    this.tweens.add({
      targets: clothSprite,
      alpha: 1,
      duration: 150
    })
    
    // 第一次擦拭（从左上到右下）
    this.tweens.add({
      targets: clothSprite,
      x: x + 60,
      y: y + 60,
      duration: 400,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // 第二次擦拭（从右下回到左上）
        this.tweens.add({
          targets: clothSprite,
          x: x - 60,
          y: y - 60,
          duration: 400,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            // 擦拭完成后淡出
            this.tweens.add({
              targets: clothSprite,
              alpha: 0,
              duration: 200,
              onComplete: () => {
                clothSprite.destroy()
              }
            })
          }
        })
        
        // 第二次擦拭的旋转
        this.tweens.add({
          targets: clothSprite,
          angle: -15,
          duration: 200,
          yoyo: true,
          repeat: 1,
          ease: 'Sine.easeInOut'
        })
      }
    })
    
    // 第一次擦拭的旋转
    this.tweens.add({
      targets: clothSprite,
      angle: 15,
      duration: 200,
      yoyo: true,
      repeat: 1,
      ease: 'Sine.easeInOut'
    })
  }
  
  removeWaterDropsInArea(x, y, radius) {
    // 移除该区域内的水珠
    this.waterDrops.forEach(drop => {
      const distance = Phaser.Math.Distance.Between(x, y, drop.x, drop.y)
      if (distance < radius) {
        this.tweens.add({
          targets: drop,
          alpha: 0,
          scale: 0,
          duration: 300,
          onComplete: () => {
            drop.destroy()
          }
        })
      }
    })
  }

  createSparkleEffect(x, y) {
    const sparkle = this.add.image(x, y, 'fx_sparkle')
    sparkle.setScale(0.3)
    sparkle.setAlpha(0)
    sparkle.setDepth(100)
    
    this.tweens.add({
      targets: sparkle,
      alpha: 1,
      scale: 0.6,
      duration: 300,
      yoyo: true,
      onComplete: () => {
        sparkle.destroy()
      }
    })
  }

  showMessage(text, color) {
    if (this.messageText) {
      this.messageText.destroy()
    }
    
    this.messageText = this.add.text(450, 500, text, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: Phaser.Display.Color.IntegerToColor(color).rgba,
      padding: { x: 20, y: 10 },
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(200)
    
    this.time.delayedCall(2000, () => {
      if (this.messageText) {
        this.messageText.destroy()
      }
    })
  }

  completeGame() {
    this.gamePhase = 'complete'
    
    // 清除所有剩余的水珠
    this.waterDrops.forEach(drop => {
      if (drop.active) {
        this.tweens.add({
          targets: drop,
          alpha: 0,
          scale: 0,
          duration: 300,
          onComplete: () => {
            drop.destroy()
          }
        })
      }
    })
    
    // 车已经是干净的了，增强闪亮效果
    for (let i = 0; i < 15; i++) {
      this.time.delayedCall(i * 150, () => {
        const x = 300 + Math.random() * 300
        const y = 250 + Math.random() * 300
        this.createSparkleEffect(x, y)
      })
    }
    
    // 跳转到完成场景
    this.time.delayedCall(2000, () => {
      this.scene.start('CarFinishScene')
    })
  }
}

