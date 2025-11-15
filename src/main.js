import './style.css'
import Phaser from 'phaser'
import MenuScene from './MenuScene.js'
import GameScene from './GameScene.js'
import VictoryScene from './VictoryScene.js'
import FinalVictoryScene from './FinalVictoryScene.js'

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 700,
  parent: 'game-container',
  backgroundColor: '#2d3561',
  scene: [MenuScene, GameScene, VictoryScene, FinalVictoryScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
}

const game = new Phaser.Game(config)
