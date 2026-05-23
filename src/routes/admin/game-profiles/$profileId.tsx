/**
 * 游戏档案详情页
 * 查看单个游戏档案的详细信息 — MC 风格
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Gamepad2, ArrowLeft } from 'lucide-react'
import { McCard } from '#/components/shared/mc-card'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'

export const Route = createFileRoute('/admin/game-profiles/$profileId')({
  component: GameProfileDetailPage,
})

function GameProfileDetailPage() {
  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <Link
          to="/admin/game-profiles"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回档案列表
        </Link>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <McSectionHeader
          title="游戏档案详情"
          description="查看玩家档案的完整信息"
          icon={Gamepad2}
          variant="nether"
          className="mb-2"
        />
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <McCard variant="glass" color="nether" className="p-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              档案详情接口正在对接中，完成后将展示完整的档案信息、关联皮肤、关联披风等数据。
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['档案 ID', '--'],
                ['玩家名称', '--'],
                ['Minecraft UUID', '--'],
                ['关联皮肤', '--'],
                ['关联披风', '--'],
                ['更新时间', '--'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-4 py-3"
                >
                  <span className="text-[13px] text-muted-foreground">
                    {label}
                  </span>
                  <span className="text-[13px] font-mono font-medium">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </McCard>
      </motion.div>
    </motion.div>
  )
}
