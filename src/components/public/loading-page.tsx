/**
 * LoadingPage - 全页加载骨架屏
 * 数据加载时显示的占位 UI
 */

import { Skeleton } from '#/components/ui/skeleton'
import { Card, CardContent } from '#/components/ui/card'

export function LoadingPage() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 标题骨架 */}
      <Skeleton className="h-8 w-48" />

      {/* 统计卡片骨架 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-xl ring-0 border border-border">
            <CardContent className="p-6">
              <Skeleton className="mb-3 h-4 w-24" />
              <Skeleton className="mb-2 h-8 w-32" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 表格骨架 */}
      <Card className="rounded-xl ring-0 border border-border">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
