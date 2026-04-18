/**
 * 游戏档案详情页
 * 查看单个游戏档案的详细信息
 */

import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">游戏档案详情</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <div key={label} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                    <span className="text-[13px] text-muted-foreground">{label}</span>
                    <span className="text-[13px] font-mono font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
