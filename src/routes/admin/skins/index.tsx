/**
 * 皮肤库列表页
 * 展示所有皮肤资源，支持查看、编辑、删除操作
 */

import { createFileRoute } from '@tanstack/react-router'
import { useSkins, useDeleteSkinMutation } from '#/api/endpoints/skin-library'
import { PageHeader } from '#/components/admin/shared/PageHeader'
import { DataTable, type Column } from '#/components/admin/shared/DataTable'
import { LoadingPage } from '#/components/admin/shared/LoadingPage'
import { ConfirmDialog } from '#/components/admin/shared/ConfirmDialog'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import {
  Plus,
  Pencil,
  Trash2,
  Shirt,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { SkinLibrary } from '#/api/types'

export const Route = createFileRoute('/admin/skins/')({
  component: SkinListPage,
})

function SkinListPage() {
  const { data: skins, isLoading } = useSkins()
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

  const columns: Column<SkinLibrary>[] = [
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
      header: '名称',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--diamond)]/10">
            <Shirt className="h-4 w-4 text-[var(--diamond-deep)]" />
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'model',
      header: '模型',
      render: (row) => (
        <Badge variant="secondary" className="font-mono text-xs">
          {row.model === 1 ? 'Classic' : 'Slim'}
        </Badge>
      ),
      className: 'w-20',
    },
    {
      key: 'is_public',
      header: '状态',
      render: (row) => (
        <Badge
          variant={row.is_public ? 'default' : 'secondary'}
          className={
            row.is_public
              ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400 border-emerald-500/20'
              : ''
          }
        >
          {row.is_public ? '公开' : '私有'}
        </Badge>
      ),
      className: 'w-18',
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
        <div className="flex items-center gap-1">
          <Link to={`/admin/skins/${row.id}` as any}>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Pencil className="mr-1 h-3 w-3" />
              编辑
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={() => setDeleteTarget(row)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            删除
          </Button>
        </div>
      ),
      className: 'w-32',
    },
  ]

  if (isLoading) return <LoadingPage />

  return (
    <div className="admin-page-enter space-y-6">
      <PageHeader title="皮肤库管理" description="管理和预览所有 Minecraft 皮肤资源">
        <Link to="/admin/skins/create">
          <Button className="gap-1.5 bg-gradient-to-r from-[var(--diamond)] to-[var(--diamond-deep)] text-white hover:opacity-90 text-sm">
            <Plus className="h-4 w-4" />
            新建皮肤
          </Button>
        </Link>
      </PageHeader>

      <DataTable
        columns={columns}
        data={skins ?? []}
        rowKey={(row) => row.id}
        emptyMessage="暂无皮肤数据，点击右上角新建"
      />

      {/* 删除确认弹窗 */}
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
    </div>
  )
}
