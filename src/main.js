import './style.css'
import Phaser from 'phaser'
import GameScene from './GameScene.js'

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 700,
  parent: 'game-container',
  backgroundColor: '#2d3561',
  scene: [GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
}

const game = new Phaser.Game(config)
