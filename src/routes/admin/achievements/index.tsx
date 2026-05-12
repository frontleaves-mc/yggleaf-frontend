/**
 * 管理员端 - 成就管理列表页
 * 展示成就列表，支持类型筛选、分页、删除
 */

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Plus, Trash2, Trophy, Eye } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
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
import { PageHeader } from '#/components/public/page-header'
import { LoadingPage } from '#/components/public/loading-page'
import { ConfirmDialog } from '#/components/public/confirm-dialog'
import {
  useAdminAchievements,
  useDeleteAchievementMutation,
} from '#/api/endpoints/api-mc/admin-achievement'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import { AchievementType } from '#/api/types'
import type {
  AchievementResponse,
  AdminAchievementListParams,
} from '#/api/types'
import { toast } from 'sonner'
import { isSuperAdmin } from '#/lib/permissions'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'

// ─── 辅助函数 ──────────────────────────────────────────────

function getAchievementTypeBadge(type: AchievementType) {
  const map: Record<number, { label: string; className: string }> = {
    [AchievementType.Stat]: {
      label: '统计类',
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    [AchievementType.Event]: {
      label: '事件类',
      className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    [AchievementType.Special]: {
      label: '特殊条件',
      className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    [AchievementType.Manual]: {
      label: '管理员手动',
      className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    },
  }
  const info = map[type] ?? {
    label: '未知' as const,
    className: 'bg-muted text-muted-foreground' as const,
  }
  return (
    <Badge variant="secondary" className={info.className}>
      {info.label}
    </Badge>
  )
}

// ─── 路由注册 ──────────────────────────────────────────────

export const Route = createFileRoute('/admin/achievements/')({
  component: AchievementsAdminPage,
})

function AchievementsAdminPage() {
  const navigate = useNavigate()
  const { data: userInfo } = useUserInfo()
  if (!isSuperAdmin(userInfo?.user?.role_name)) {
    navigate({ to: '/admin' })
    return null
  }

  // ─── 分页 + 筛选参数 ──────────────────────────────────
  const [page, setPage] = useState(1)
  const [pageSize] = useState(15)
  const [filterType, setFilterType] = useState<string>('all')

  const params: AdminAchievementListParams = {
    page,
    page_size: pageSize,
    ...(filterType !== 'all' ? { type: Number(filterType) as AchievementType } : {}),
  }

  // ─── 数据查询 ────────────────────────────────────────
  const { data, isLoading } = useAdminAchievements(params)
  const deleteMutation = useDeleteAchievementMutation()

  // ─── 删除状态 ────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<AchievementResponse | null>(
    null,
  )

  // ─── 操作处理 ────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success('成就已删除')
      setDeleteTarget(null)
    } catch {
      toast.error('删除失败')
    }
  }

  // ─── 加载状态 ────────────────────────────────────────

  if (isLoading) return <LoadingPage />

  const achievements = data?.list ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize)

  // ─── 列定义 ──────────────────────────────────────────

  const columns: ColumnDef<AchievementResponse, unknown>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="名称" />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-sm">{row.getValue('name')}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="描述" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {row.getValue('description') || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="类型" />
      ),
      cell: ({ row }) => getAchievementTypeBadge(row.original.type),
      size: 110,
    },
    {
      accessorKey: 'condition_key',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="条件键" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.getValue('condition_key') || '-'}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'sort_order',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="排序" />
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.original.sort_order}</span>
      ),
      size: 64,
    },
    {
      accessorKey: 'is_active',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="状态" />
      ),
      cell: ({ row }) => {
        const active = row.original.is_active
        return (
          <Badge
            variant="secondary"
            className={
              active
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : 'bg-muted text-muted-foreground'
            }
          >
            {active ? '启用' : '禁用'}
          </Badge>
        )
      },
      size: 80,
    },
    {
      id: 'actions',
      header: () => <span className="text-sm font-medium">操作</span>,
      cell: ({ row }) => {
        const achievement = row.original
        return (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
              <Link to="/admin/achievements/$achievementId" params={{ achievementId: achievement.id }}>
                <Eye className="mr-1 h-3 w-3" />
                详情
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={() => setDeleteTarget(achievement)}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              删除
            </Button>
          </div>
        )
      },
      size: 160,
    },
  ]

  // ─── 渲染 ────────────────────────────────────────────

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <PageHeader description="管理游戏成就的定义、条件与奖励">
          <Button asChild className="gap-1.5">
            <Link to="/admin/achievements/create">
              <Plus className="h-4 w-4" />
              创建成就
            </Link>
          </Button>
        </PageHeader>
      </motion.div>

      {/* 类型筛选 */}
      <motion.div variants={fadeUpItem} className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">类型筛选：</span>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="全部类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value={String(AchievementType.Stat)}>统计类</SelectItem>
            <SelectItem value={String(AchievementType.Event)}>事件类</SelectItem>
            <SelectItem value={String(AchievementType.Special)}>特殊条件</SelectItem>
            <SelectItem value={String(AchievementType.Manual)}>管理员手动</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        variants={fadeUpItem}
        className="rounded-xl border border-border/70 overflow-hidden"
      >
        <TableProvider columns={columns} data={achievements}>
          <TSTableHeader>
            {({ headerGroup }) => (
              <TSTableHeaderGroup headerGroup={headerGroup}>
                {({ header }) => <TSTableHead header={header} />}
              </TSTableHeaderGroup>
            )}
          </TSTableHeader>
          <TSTableBody
            emptyContent={
              <>
                <Trophy className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  暂无成就，点击右上角创建
                </p>
              </>
            }
          >
            {({ row }) => (
              <TSTableRow row={row}>
                {({ cell }) => <TSTableCell cell={cell} />}
              </TSTableRow>
            )}
          </TSTableBody>
        </TableProvider>
      </motion.div>

      {/* 分页 */}
      {totalPages > 1 && (
        <motion.div
          variants={fadeUpItem}
          className="flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            共 {data?.total ?? 0} 条记录，第 {page}/{totalPages} 页
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              下一页
            </Button>
          </div>
        </motion.div>
      )}

      {/* 删除确认 */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="确认删除"
        description={`删除后，所有已获得此成就的玩家记录也将被清除。确定要删除成就「${deleteTarget?.name}」吗？`}
        confirmLabel="删除"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
      />
    </motion.div>
  )
}
