/**
 * 游戏档案详情页
 * 查看单个游戏档案的详细信息
 */

import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { PageTransition } from '#/components/ui/page-transition'

export const Route = createFileRoute('/admin/game-profiles/$profileId')({
  component: GameProfileDetailPage,
})

function GameProfileDetailPage() {
  return (
    <PageTransition className="space-y-6">
      <Link
        to="/admin/game-profiles"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        返回档案列表
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">游戏档案详情</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-[var(--muted-foreground)]">
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
                <div key={label} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-3">
                  <span className="text-[13px] text-[var(--muted-foreground)]">{label}</span>
                  <span className="text-[13px] font-mono font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
