/**
 * 游戏档案列表页
 * 展示所有游戏档案，支持创建新档案和查看详情
 */

import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/admin/shared/PageHeader'
import { DataTable, type Column } from '#/components/admin/shared/DataTable'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import {
  UserCircle,
  Eye,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { GameProfile } from '#/api/types'

// 临时数据（API 对接后替换为真实查询）
const mockProfiles: GameProfile[] = []

export const Route = createFileRoute('/admin/game-profiles/')({
  component: GameProfileListPage,
})

function GameProfileListPage() {
  const columns: Column<GameProfile>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (row) => (
        <span className="tabular-nums text-[var(--muted-foreground)]">#{row.id}</span>
      ),
      className: 'w-16',
    },
    {
      key: 'name',
      header: '玩家名称',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--lagoon)]/10">
            <UserCircle className="h-4 w-4 text-[var(--lagoon-deep)]" />
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'uuid',
      header: 'UUID',
      render: (row) => (
        <span className="font-mono text-xs text-[var(--muted-foreground)]">
          {row.uuid.slice(0, 8)}...
        </span>
      ),
    },
    {
      key: 'updated_at',
      header: '更新时间',
      render: (row) => (
        <span className="text-[13px] text-[var(--muted-foreground)]">
          {new Date(row.updated_at).toLocaleDateString('zh-CN')}
        </span>
      ),
      className: 'w-32',
    },
    {
      key: 'actions',
      header: '操作',
      render: (row) => (
        <Link to={`/admin/game-profiles/${row.id}` as any}>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <Eye className="mr-1 h-3 w-3" />
            详情
          </Button>
        </Link>
      ),
      className: 'w-20',
    },
  ]

  return (
    <div className="admin-page-enter space-y-6">
      <PageHeader title="游戏档案管理" description="管理所有玩家的 Minecraft 游戏档案">
        <Badge variant="secondary" className="text-xs">接口开发中</Badge>
      </PageHeader>

      <DataTable
        columns={columns}
        data={mockProfiles}
        rowKey={(row) => row.id}
        emptyMessage="暂无游戏档案数据，完整列表接口开发中"
      />
    </div>
  )
}
