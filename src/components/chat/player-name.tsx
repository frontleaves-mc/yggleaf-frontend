'use client'

/**
 * 彩色玩家名组件
 * 基于玩家名哈希值生成确定性 HSL 色相，模拟 MC 游戏内彩色玩家名
 */

interface PlayerNameProps {
  name: string
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function PlayerName({ name }: PlayerNameProps) {
  const hue = hashCode(name) % 360
  return (
    <span className="font-medium" style={{ color: `hsl(${hue}, 70%, 60%)` }}>
      {name}
    </span>
  )
}
