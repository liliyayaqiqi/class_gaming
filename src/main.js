import './style.css'
import Phaser from 'phaser'
import MainMenuScene from './MainMenuScene.js'
import PoliceMenuScene from './PoliceMenuScene.js'
import GameScene from './GameScene.js'
import VictoryScene from './VictoryScene.js'
import FinalVictoryScene from './FinalVictoryScene.js'
import CarMenuScene from './CarMenuScene.js'
import CarBeauticianScene from './CarBeauticianScene.js'
import CarFinishScene from './CarFinishScene.js'
import CarBeautyScene from './CarBeautyScene.js'
import FashionScene from './FashionScene.js'
import BubbleTeaScene from './BubbleTeaScene.js'

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 700,
  parent: 'game-container',
  backgroundColor: '#2d3561',
  scene: [MainMenuScene, PoliceMenuScene, GameScene, VictoryScene, FinalVictoryScene, CarMenuScene, CarBeauticianScene, CarFinishScene, CarBeautyScene, FashionScene, BubbleTeaScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
}

const game = new Phaser.Game(config)
