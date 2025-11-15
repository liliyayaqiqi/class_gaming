// 关卡配置验证脚本
import { LEVELS } from './src/LevelConfig.js'

console.log('🔍 开始验证关卡配置...\n')

let hasErrors = false

Object.keys(LEVELS).forEach(levelNum => {
  const level = LEVELS[levelNum]
  console.log(`检查 ${level.name}...`)
  
  const errors = []
  const warnings = []
  
  // 检查小偷与警察位置重叠
  level.policePositions.forEach((policePos, index) => {
    if (policePos === level.thiefPosition) {
      errors.push(`  ❌ 警察${index + 1}与小偷位置重叠 (节点 ${policePos})`)
    }
  })
  
  // 检查警察之间位置重叠
  for (let i = 0; i < level.policePositions.length; i++) {
    for (let j = i + 1; j < level.policePositions.length; j++) {
      if (level.policePositions[i] === level.policePositions[j]) {
        errors.push(`  ❌ 警察${i + 1}和警察${j + 1}位置重叠 (节点 ${level.policePositions[i]})`)
      }
    }
  }
  
  // 检查位置是否在有效节点范围内
  const nodeIds = level.graph.nodes.map(n => n.id)
  
  if (!nodeIds.includes(level.thiefPosition)) {
    errors.push(`  ❌ 小偷位置 ${level.thiefPosition} 不在有效节点中`)
  }
  
  level.policePositions.forEach((policePos, index) => {
    if (!nodeIds.includes(policePos)) {
      errors.push(`  ❌ 警察${index + 1}位置 ${policePos} 不在有效节点中`)
    }
  })
  
  // 检查是否在出口
  const exitNode = level.graph.nodes.find(n => n.type === 'exit')
  if (exitNode) {
    if (level.thiefPosition === exitNode.id) {
      warnings.push(`  ⚠️  小偷初始位置在出口 (节点 ${exitNode.id})`)
    }
    level.policePositions.forEach((policePos, index) => {
      if (policePos === exitNode.id) {
        warnings.push(`  ⚠️  警察${index + 1}初始位置在出口 (节点 ${exitNode.id})`)
      }
    })
  }
  
  // 输出结果
  if (errors.length > 0) {
    hasErrors = true
    console.log('  ❌ 发现错误:')
    errors.forEach(err => console.log(err))
  }
  
  if (warnings.length > 0) {
    console.log('  ⚠️  警告:')
    warnings.forEach(warn => console.log(warn))
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('  ✅ 配置正确')
  }
  
  console.log()
})

if (hasErrors) {
  console.log('❌ 验证失败！请修复上述错误。')
  process.exit(1)
} else {
  console.log('✅ 所有关卡配置验证通过！')
}

