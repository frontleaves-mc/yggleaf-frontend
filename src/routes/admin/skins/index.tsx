/**
 * 皮肤库列表页
 * 展示所有皮肤资源，支持查看、编辑、删除操作
 */

import { createFileRoute } from '@tanstack/react-router'
import { useSkins, useDeleteSkinMutation } from '#/api/endpoints/skin-library'
import { PageHeader } from '#/components/public/page-header'
import { DataTable, type Column } from '#/components/public/data-table'
import { LoadingPage } from '#/components/public/loading-page'
import { ConfirmDialog } from '#/components/public/confirm-dialog'
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
import { motion } from 'motion/react'

/** stagger 容器动画 - 子元素依次入场 */
const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

/** 单项淡入上移动画 */
const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

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

  const columns: Column<SkinLibrary>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (row) => (
        <span className="tabular-nums text-muted-foreground">#{row.id}</span>
      ),
      className: 'w-16',
    },
    {
      key: 'name',
      header: '名称',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Shirt className="h-4 w-4 text-primary" />
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
              ? 'bg-chart-2/10 text-chart-2 hover:bg-chart-2/15 border-chart-2/20'
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
        <span className="text-[13px] text-muted-foreground">
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
            className="h-7 px-2 text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
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
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <PageHeader title="皮肤库管理" description="管理和预览所有 Minecraft 皮肤资源">
          <Link to="/admin/skins/create">
            <Button className="gap-1.5 bg-gradient-to-r from-primary to-primary text-white hover:opacity-90 text-sm">
              <Plus className="h-4 w-4" />
              新建皮肤
            </Button>
          </Link>
        </PageHeader>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <DataTable
          columns={columns}
          data={skins ?? []}
          rowKey={(row) => row.id}
          emptyMessage="暂无皮肤数据，点击右上角新建"
        />
      </motion.div>

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
    </motion.div>
  )
}
