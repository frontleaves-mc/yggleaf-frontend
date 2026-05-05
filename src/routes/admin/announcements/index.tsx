/**
 * 管理员端 - 公告管理页
 * CRUD 操作 + 发布/下线，使用 TanStack Table
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Plus,
  Pencil,
  Trash2,
  Megaphone,
  SendHorizontal,
  EyeOff,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
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
  useAdminAnnouncements,
  useDeleteAnnouncementMutation,
  usePublishAnnouncementMutation,
  useOfflineAnnouncementMutation,
} from '#/api/endpoints/api-mc/admin-announcement'
import type {
  AnnouncementListItem,
  AdminAnnouncementListParams,
} from '#/api/types/api-mc/announcement'
import { AnnouncementType, AnnouncementStatus } from '#/api/types/api-mc/announcement'
import { toast } from 'sonner'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { getAnnouncementTypeBadge, getAnnouncementStatusBadge } from '#/lib/announcement-helpers'

// ─── 路由注册 ──────────────────────────────────────────────

export const Route = createFileRoute('/admin/announcements/')({
  component: AdminAnnouncementsPage,
})

function AdminAnnouncementsPage() {
  // ─── 分页参数 ────────────────────────────────────────
  const [page, setPage] = useState(1)
  const [pageSize] = useState(15)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const params: AdminAnnouncementListParams = {
    page,
    page_size: pageSize,
    ...(filterType !== 'all' ? { type: Number(filterType) } : {}),
    ...(filterStatus !== 'all' ? { status: Number(filterStatus) } : {}),
  }

  // ─── 数据查询 ────────────────────────────────────────
  const { data, isLoading } = useAdminAnnouncements(params)
  const deleteMutation = useDeleteAnnouncementMutation()
  const publishMutation = usePublishAnnouncementMutation()
  const offlineMutation = useOfflineAnnouncementMutation()

  // ─── 弹窗状态 ────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] =
    useState<AnnouncementListItem | null>(null)
  const [publishTarget, setPublishTarget] =
    useState<AnnouncementListItem | null>(null)
  const [offlineTarget, setOfflineTarget] =
    useState<AnnouncementListItem | null>(null)

  // ─── 操作处理 ────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success('公告已删除')
      setDeleteTarget(null)
    } catch {
      toast.error('删除失败')
    }
  }

  const handlePublish = async () => {
    if (!publishTarget) return
    try {
      await publishMutation.mutateAsync(publishTarget.id)
      toast.success('公告已发布')
      setPublishTarget(null)
    } catch {
      toast.error('发布失败')
    }
  }

  const handleOffline = async () => {
    if (!offlineTarget) return
    try {
      await offlineMutation.mutateAsync(offlineTarget.id)
      toast.success('公告已下线')
      setOfflineTarget(null)
    } catch {
      toast.error('下线失败')
    }
  }

  // ─── 加载状态 ────────────────────────────────────────

  if (isLoading) return <LoadingPage />

  const announcements = data?.list ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize)

  // ─── 列定义 ──────────────────────────────────────────

  const columns: ColumnDef<AnnouncementListItem, unknown>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="标题" />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-sm">
          {row.getValue('title')}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="类型" />
      ),
      cell: ({ row }) =>
        getAnnouncementTypeBadge(row.original.type),
      size: 96,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="状态" />
      ),
      cell: ({ row }) =>
        getAnnouncementStatusBadge(row.original.status),
      size: 100,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="创建时间" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString(
                'zh-CN',
              )
            : '-'}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'published_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="发布时间" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.published_at
            ? new Date(row.original.published_at).toLocaleDateString(
                'zh-CN',
              )
            : '-'}
        </span>
      ),
      size: 120,
    },
    {
      id: 'actions',
      header: () => <span className="text-sm font-medium">操作</span>,
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center gap-1">
            <Link
              to="/admin/announcements/$announcementId"
              params={{ announcementId: item.id }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
              >
                <Pencil className="mr-1 h-3 w-3" />
                编辑
              </Button>
            </Link>
            {item.status === AnnouncementStatus.Draft && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-500/10"
                onClick={() => setPublishTarget(item)}
              >
                <SendHorizontal className="mr-1 h-3 w-3" />
                发布
              </Button>
            )}
            {item.status === AnnouncementStatus.Published && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-500/10"
                onClick={() => setOfflineTarget(item)}
              >
                <EyeOff className="mr-1 h-3 w-3" />
                下线
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              disabled={item.status === AnnouncementStatus.Published}
              onClick={() => setDeleteTarget(item)}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              删除
            </Button>
          </div>
        )
      },
      size: 240,
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
      {/* 页头 */}
      <motion.div variants={fadeUpItem}>
        <PageHeader
          title="公告管理"
          description="管理系统公告"
        >
          <Link to="/admin/announcements/create">
            <Button className="gap-1.5 text-sm">
              <Plus className="h-4 w-4" />
              创建公告
            </Button>
          </Link>
        </PageHeader>
      </motion.div>

      {/* 筛选区域 */}
      <motion.div
        variants={fadeUpItem}
        className="flex flex-wrap items-center gap-4 rounded-xl border border-border/70 bg-card p-4"
      >
        <div className="flex items-center gap-2">
          <Label htmlFor="filter-type" className="text-sm whitespace-nowrap">
            类型
          </Label>
          <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1) }}>
            <SelectTrigger id="filter-type" className="w-[120px]">
              <SelectValue placeholder="全部类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value={String(AnnouncementType.InSite)}>
                站内
              </SelectItem>
              <SelectItem value={String(AnnouncementType.Global)}>
                全局
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="filter-status" className="text-sm whitespace-nowrap">
            状态
          </Label>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1) }}>
            <SelectTrigger id="filter-status" className="w-[120px]">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value={String(AnnouncementStatus.Draft)}>草稿</SelectItem>
              <SelectItem value={String(AnnouncementStatus.Published)}>已发布</SelectItem>
              <SelectItem value={String(AnnouncementStatus.Offline)}>已下线</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* 表格 */}
      <motion.div
        variants={fadeUpItem}
        className="rounded-xl border border-border/70 overflow-hidden"
      >
        <TableProvider columns={columns} data={announcements}>
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
                <Megaphone className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  暂无公告
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
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
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
        description={`确定要删除公告「${deleteTarget?.title}」吗？此操作不可恢复。`}
        confirmLabel="删除"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
      />

      {/* 发布确认 */}
      <ConfirmDialog
        open={!!publishTarget}
        onOpenChange={(open) => !open && setPublishTarget(null)}
        title="确认发布"
        description={`确定要发布公告「${publishTarget?.title}」吗？发布后将对用户可见。`}
        confirmLabel="发布"
        onConfirm={handlePublish}
        loading={publishMutation.isPending}
      />

      {/* 下线确认 */}
      <ConfirmDialog
        open={!!offlineTarget}
        onOpenChange={(open) => !open && setOfflineTarget(null)}
        title="确认下线"
        description={`确定要下线公告「${offlineTarget?.title}」吗？下线后将不再对用户可见。`}
        confirmLabel="下线"
        onConfirm={handleOffline}
        loading={offlineMutation.isPending}
        variant="destructive"
      />
    </motion.div>
  )
}
