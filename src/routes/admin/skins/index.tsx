/**
 * 皮肤库列表页（MC 风格）
 * 展示所有皮肤资源，支持查看、编辑、删除操作
 * 配色：nether(红) + gold(黄) 作为 MC 点缀色
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import { Pencil, Plus, Shirt, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import {
  useDeleteSkinMutation,
  useSkins,
} from '#/api/endpoints/api-auth/skin-library'
import type { SkinLibrary } from '#/api/types'
import { ConfirmDialog } from '#/components/public/confirm-dialog'
import { LoadingPage } from '#/components/public/loading-page'
import { Button } from '#/components/ui/button'
import type { ColumnDef } from '#/components/ui/tanstack-table'
import {
  TableColumnHeader,
  TableProvider,
  TSTableBody,
  TSTableCell,
  TSTableHead,
  TSTableHeader,
  TSTableHeaderGroup,
  TSTableRow,
} from '#/components/ui/tanstack-table'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { PageHeader } from '#/components/public/page-header'
import { McBadge } from '#/components/shared/mc-badge'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'

export const Route = createFileRoute('/admin/skins/')({
  component: SkinListPage,
})

function SkinListPage() {
  const { data, isLoading } = useSkins()
  const skins = data?.items
  const deleteMutation = useDeleteSkinMutation()
  const [deleteTarget, setDeleteTarget] = useState<SkinLibrary | null>(null)

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
    } catch {
      // 错误由 mutation error handling 处理
    }
  }

  const columns: ColumnDef<SkinLibrary, unknown>[] = [
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
          <McIconBox variant="nether" size="sm">
            <Shirt />
          </McIconBox>
          <span className="font-medium">{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'model',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="模型" />
      ),
      cell: ({ row }) => (
        <McBadge variant="diamond" className="font-mono">
          {row.original.model === 1 ? 'Classic' : 'Slim'}
        </McBadge>
      ),
      size: 80,
    },
    {
      accessorKey: 'is_public',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="状态" />
      ),
      cell: ({ row }) => {
        const isPublic = row.original.is_public
        return (
          <McBadge variant={isPublic ? 'grass' : 'default'}>
            {isPublic ? '公开' : '私有'}
          </McBadge>
        )
      },
      size: 72,
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
        const skin = row.original
        return (
          <div className="flex items-center gap-1">
            <Link to={`/admin/skins/${skin.id}` as any}>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                <Pencil className="mr-1 h-3 w-3" />
                编辑
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={() => setDeleteTarget(skin)}
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
            subtitle="Skin Library"
            title="皮肤库管理"
            icon={Shirt}
            variant="nether"
            description="管理和预览所有 Minecraft 皮肤资源"
          />
          <Link to="/admin/skins/create">
            <Button variant="gradient" className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" />
              新建皮肤
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <McCard variant="glass" color="nether" className="overflow-hidden">
          <TableProvider columns={columns} data={skins ?? []}>
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
                  暂无皮肤数据，点击右上角新建
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
        description={`确定要删除皮肤「${deleteTarget?.name}」吗？此操作不可撤销。`}
        confirmLabel="删除"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
      />
    </motion.div>
  )
}
