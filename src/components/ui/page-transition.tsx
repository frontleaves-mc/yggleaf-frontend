/**
 * PageTransition — 页面进入过渡动画
 *
 * 基于 motion 库实现页面内容入场动画。
 * 替代旧版 CSS @keyframes page-enter 方案。
 *
 * 用法:
 *   <PageTransition className="space-y-6">
 *     {children}
 *   </PageTransition>
 */

import { motion } from 'motion/react'

// ─── 动画预设 ──────────────────────────────────────────

const pageEnter = {
  initial: { opacity: 0, y: 6, scale: 0.998 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
}

const riseIn = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

// ─── 组件 ──────────────────────────────────────────────

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div {...pageEnter} className={className}>
      {children}
    </motion.div>
  )
}

export function RiseTransition({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div {...riseIn} className={className}>
      {children}
    </motion.div>
  )
}
