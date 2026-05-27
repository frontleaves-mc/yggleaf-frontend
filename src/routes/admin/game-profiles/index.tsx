/**
 * 管理员端 - 游戏档案管理列表页
 * MC 风格：nether + gold 配色
 * 支持关键词搜索、分页
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserCircle,
} from 'lucide-react'
import { PageHeader } from '#/components/public/page-header'
import type { ColumnDef } from '#/components/ui/tanstack-table'
import {
  TableProvider,
  TableColumnHeader,
  TSTableHeader,
  TSTableHeaderGroup,
  TSTableHead,
  TSTableBody,
  TSTableRow,
  TSTableCell,
} from '#/components/ui/tanstack-table'
import { LoadingPage } from '#/components/public/loading-page'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { useAdminGameProfiles } from '#/api/endpoints/api-auth/admin-game-profile'
import type { AdminGameProfileListItem } from '#/api/types'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { formatTime } from '#/lib/format'

// ─── 常量 ──────────────────────────────────────────────────

const PAGE_SIZE = 20

// ─── Route 定义 ────────────────────────────────────────────

export const Route = createFileRoute('/admin/game-profiles/')({
  component: GameProfileListPage,
})

// ─── 页面组件 ──────────────────────────────────────────────

function GameProfileListPage() {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAdminGameProfiles({
    page,
    page_size: PAGE_SIZE,
    keyword: keyword || undefined,
  })

  const list = data?.list ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const columns: ColumnDef<AdminGameProfileListItem, unknown>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground font-mono text-xs">
          {row.original.id}
        </span>
      ),
      size: 200,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="玩家名称" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <McIconBox variant="nether" size="sm">
            <UserCircle />
          </McIconBox>
          <div className="min-w-0">
            <span className="font-medium truncate">{row.original.name}</span>
            <p className="text-[11px] text-muted-foreground">
              {row.original.username}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'uuid',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="UUID" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.uuid.slice(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: 'updated_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="更新时间" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground whitespace-nowrap">
          {formatTime(row.original.updated_at)}
        </span>
      ),
      size: 144,
    },
    {
      id: 'actions',
      header: () => <span className="text-sm font-medium">操作</span>,
      cell: ({ row }) => (
        <Link
          to="/admin/game-profiles/$profileId"
          params={{ profileId: row.original.id }}
        >
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <Eye className="mr-1 h-3 w-3" />
            详情
          </Button>
        </Link>
      ),
      size: 80,
    },
  ]

  if (isLoading) return <LoadingPage />

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面标题 */}
      <motion.div variants={fadeUpItem}>
        <PageHeader
          title="游戏档案"
          description="管理所有玩家的 Minecraft 游戏档案"
          icon={UserCircle}
          variant="nether"
        >
          <span className="text-xs text-muted-foreground tabular-nums">
            共 {total} 个档案
          </span>
        </PageHeader>
      </motion.div>

      {/* 搜索栏 */}
      <motion.div
        variants={fadeUpItem}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索玩家名称..."
            className="pl-9 h-9"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value)
              setPage(1)
            }}
          />
        </div>
      </motion.div>

      {/* 数据表格 */}
      <motion.div variants={fadeUpItem}>
        <McCard variant="solid" color="nether" className="overflow-hidden">
          <TableProvider columns={columns} data={list}>
            <TSTableHeader>
              {({ headerGroup }) => (
                <TSTableHeaderGroup headerGroup={headerGroup}>
                  {({ header }) => <TSTableHead header={header} />}
                </TSTableHeaderGroup>
              )}
            </TSTableHeader>
            <TSTableBody
              emptyContent={
                <p className="text-sm text-muted-foreground">
                  暂无游戏档案数据
                </p>
              }
            >
              {({ row }) => (
                <TSTableRow row={row}>
                  {({ cell }) => <TSTableCell cell={cell} />}
                </TSTableRow>
              )}
            </TSTableBody>
          </TableProvider>
        </McCard>
      </motion.div>

      {/* 分页控制 */}
      {totalPages > 1 && (
        <motion.div
          variants={fadeUpItem}
          className="flex items-center justify-between"
        >
          <span className="text-xs text-muted-foreground">
            第 {page}/{totalPages} 页，共 {total} 条
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              下一页
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
