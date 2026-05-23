/**
 * 披风库列表页（MC 风格）
 * 展示所有披风资源，支持查看、编辑、删除操作
 * 配色：gold(黄) + nether(红) 作为 MC 点缀色
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import {
  useCapes,
  useDeleteCapeMutation,
} from '#/api/endpoints/api-auth/cape-library'
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
import { ConfirmDialog } from '#/components/public/confirm-dialog'
import { Button } from '#/components/ui/button'
import { Plus, Pencil, Trash2, Flag } from 'lucide-react'
import { useState } from 'react'
import type { CapeLibrary } from '#/api/types'
import { motion } from 'motion/react'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { PageHeader } from '#/components/public/page-header'
import { McBadge } from '#/components/shared/mc-badge'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'

export const Route = createFileRoute('/admin/capes/')({
  component: CapeListPage,
})

function CapeListPage() {
  const { data, isLoading } = useCapes()
  const capes = data?.items
  const deleteMutation = useDeleteCapeMutation()
  const [deleteTarget, setDeleteTarget] = useState<CapeLibrary | null>(null)

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
    } catch {
      // 错误由 mutation error handling 处理
    }
  }

  const columns: ColumnDef<CapeLibrary, unknown>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          #{row.original.id}
        </span>
      ),
      size: 64,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="名称" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <McIconBox variant="gold" size="sm">
            <Flag />
          </McIconBox>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'is_public',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="状态" />
      ),
      cell: ({ row }) => {
        const isPublic = row.original.is_public
        return (
          <McBadge variant={isPublic ? 'gold' : 'default'}>
            {isPublic ? '公开' : '私有'}
          </McBadge>
        )
      },
      size: 72,
    },
    {
      accessorKey: 'texture_hash',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="纹理哈希" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.texture_hash.slice(0, 10)}...
        </span>
      ),
    },
    {
      accessorKey: 'updated_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="更新时间" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground">
          {new Date(row.original.updated_at).toLocaleDateString('zh-CN')}
        </span>
      ),
      size: 128,
    },
    {
      id: 'actions',
      header: () => <span>操作</span>,
      cell: ({ row }) => {
        const cape = row.original
        return (
          <div className="flex items-center gap-1">
            <Link to={`/admin/capes/${cape.id}` as any}>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                <Pencil className="mr-1 h-3 w-3" />
                编辑
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={() => setDeleteTarget(cape)}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              删除
            </Button>
          </div>
        )
      },
      size: 128,
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
      <motion.div variants={fadeUpItem}>
        <div className="flex items-center justify-between gap-4">
          <PageHeader
            subtitle="Cape Library"
            title="披风库管理"
            icon={Flag}
            variant="gold"
            description="管理和预览所有 Minecraft 披风资源"
          />
          <Link to="/admin/capes/create">
            <Button variant="gradient" className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" />
              新建披风
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <McCard variant="glass" color="gold" className="overflow-hidden">
          <TableProvider columns={columns} data={capes ?? []}>
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
                  暂无披风数据，点击右上角新建
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

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="确认删除"
        description={`确定要删除披风「${deleteTarget?.name}」吗？此操作不可撤销。`}
        confirmLabel="删除"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
      />
    </motion.div>
  )
}
