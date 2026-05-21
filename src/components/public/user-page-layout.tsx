/**
 * UserPageLayout - 用户页面统一布局
 *
 * 提供标准化的用户页面结构：
 *   顶部：标题 + 操作区（flex justify-between）
 *   底部：主内容插槽
 *
 * 整体包裹 staggerContainer 动画，各区域使用 fadeUpItem 入场
 */

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

import { PageHeader } from '#/components/public/page-header'
import { mcStaggerGrid, mcStaggerGridItem } from '#/lib/motion-presets'
import { cn } from '#/lib/utils'

// ─── Props ──────────────────────────────────────────────────

interface UserPageLayoutProps {
  /** 页面标题 */
  title: string
  /** 页面描述 */
  description?: string
  /** 右侧操作区（如玩家选择器） */
  actions?: ReactNode
  /** 主内容区 */
  children: ReactNode
  /** 容器额外类名 */
  className?: string
}

// ─── 组件 ──────────────────────────────────────────────────

export function UserPageLayout({
  title,
  description,
  actions,
  children,
  className,
}: UserPageLayoutProps) {
  return (
    <motion.div
      className={cn('space-y-6', className)}
      variants={mcStaggerGrid}
      initial="hidden"
      animate="visible"
    >
      {/* ── 顶部：标题 + 操作区 ─────────────────────── */}
      <motion.div variants={mcStaggerGridItem}>
        <div className="flex items-end justify-between gap-4">
          <PageHeader
            title={title}
            description={description}
            className="mb-0"
          />
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      </motion.div>

      {/* ── 主内容区 ─────────────────────────────────── */}
      <div className="space-y-6">{children}</div>
    </motion.div>
  )
}
