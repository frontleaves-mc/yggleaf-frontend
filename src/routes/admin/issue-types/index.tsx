/**
 * 管理员端 - 问题类型管理页
 * CRUD 操作问题分类类型，使用 TanStack Table + 排序
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Plus, Pencil, Trash2, Tags } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Badge } from '#/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
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
  useIssueTypes,
  useCreateIssueTypeMutation,
  useUpdateIssueTypeMutation,
  useDeleteIssueTypeMutation,
} from '#/api/endpoints/issue-type'
import { useUserInfo } from '#/api/endpoints/user'
import type { IssueType } from '#/api/types'
import { toast } from 'sonner'
import { isSuperAdmin } from '#/lib/permissions'

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export const Route = createFileRoute('/admin/issue-types/')({
  component: IssueTypesPage,
})

function IssueTypesPage() {
  const navigate = useNavigate()
  const { data: userInfo } = useUserInfo()
  if (!isSuperAdmin(userInfo?.user?.role_name)) {
    navigate({ to: '/admin' })
    return null
  }

  const { data: issueTypes, isLoading } = useIssueTypes()
  const createMutation = useCreateIssueTypeMutation()
  const updateMutation = useUpdateIssueTypeMutation()
  const deleteMutation = useDeleteIssueTypeMutation()

  const [editTarget, setEditTarget] = useState<IssueType | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<IssueType | null>(null)

  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formSort, setFormSort] = useState('0')

  const openEdit = (type: IssueType) => {
    setEditTarget(type)
    setFormName(type.name)
    setFormDesc(type.description ?? '')
    setFormSort(String(type.sort_order ?? 0))
  }

  const openCreate = () => {
    setShowCreate(true)
    setFormName('')
    setFormDesc('')
    setFormSort('0')
  }

  const resetForm = () => {
    setFormName('')
    setFormDesc('')
    setFormSort('0')
  }

  const handleCreate = async () => {
    if (!formName.trim()) return
    try {
      await createMutation.mutateAsync({
        name: formName.trim(),
        description: formDesc.trim() || undefined,
        sort_order: Number(formSort) || 0,
      })
      toast.success('类型创建成功')
      setShowCreate(false)
      resetForm()
    } catch {
      toast.error('创建失败')
    }
  }

  const handleUpdate = async () => {
    if (!editTarget || !formName.trim()) return
    try {
      await updateMutation.mutateAsync({
        id: editTarget.id,
        data: {
          name: formName.trim(),
          description: formDesc.trim() || undefined,
          sort_order: Number(formSort) || 0,
        },
      })
      toast.success('类型更新成功')
      setEditTarget(null)
      resetForm()
    } catch {
      toast.error('更新失败')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success('类型已删除')
      setDeleteTarget(null)
    } catch {
      toast.error('删除失败')
    }
  }

  const handleToggleEnabled = async (type: IssueType) => {
    try {
      await updateMutation.mutateAsync({
        id: type.id,
        data: { is_enabled: !type.is_enabled },
      })
      toast.success(type.is_enabled ? '已禁用' : '已启用')
    } catch {
      toast.error('操作失败')
    }
  }

  if (isLoading) return <LoadingPage />

  const types = issueTypes ?? []

  const columns: ColumnDef<IssueType, unknown>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          #{row.getValue('id')}
        </span>
      ),
      size: 64,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <TableColumnHeader column={column} title="名称" />,
      cell: ({ row }) => (
        <span className="font-medium text-sm">{row.getValue('name')}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => <TableColumnHeader column={column} title="描述" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {(row.getValue('description') as string) || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'sort_order',
      header: ({ column }) => <TableColumnHeader column={column} title="排序" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.getValue('sort_order')}</span>
      ),
      size: 80,
    },
    {
      accessorKey: 'is_enabled',
      header: ({ column }) => <TableColumnHeader column={column} title="状态" />,
      cell: ({ row }) => {
        const enabled = row.getValue('is_enabled') as boolean
        const type = row.original as IssueType
        return (
          <Badge
            variant="secondary"
            className={`cursor-pointer ${
              enabled
                ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            onClick={() => handleToggleEnabled(type)}
          >
            {enabled ? '启用' : '禁用'}
          </Badge>
        )
      },
      size: 80,
    },
    {
      id: 'actions',
      header: () => <span className="text-sm font-medium">操作</span>,
      cell: ({ row }) => {
        const type = row.original as IssueType
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => openEdit(type)}
            >
              <Pencil className="mr-1 h-3 w-3" />
              编辑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={() => setDeleteTarget(type)}
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

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <PageHeader title="问题类型管理" description="管理问题反馈的分类类型">
          <Button onClick={openCreate} className="gap-1.5 text-sm">
            <Plus className="h-4 w-4" />
            新建类型
          </Button>
        </PageHeader>
      </motion.div>

      <motion.div variants={fadeUpItem} className="rounded-xl border border-border/70 overflow-hidden">
        <TableProvider columns={columns} data={types}>
          <TSTableHeader>
            {({ headerGroup }) => (
              <TSTableHeaderGroup headerGroup={headerGroup}>
                {({ header }) => <TSTableHead header={header} />}
              </TSTableHeaderGroup>
            )}
          </TSTableHeader>
          <TSTableBody>
            {({ row }) => (
              <TSTableRow row={row}>
                {({ cell }) => <TSTableCell cell={cell} />}
              </TSTableRow>
            )}
          </TSTableBody>
        </TableProvider>

        {types.length === 0 && (
          <div className="py-16 text-center">
            <Tags className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">暂无问题类型，点击右上角新建</p>
          </div>
        )}
      </motion.div>

      {/* 创建/编辑弹窗 */}
      <Dialog
        open={showCreate || !!editTarget}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreate(false)
            setEditTarget(null)
            resetForm()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? '编辑类型' : '新建类型'}</DialogTitle>
            <DialogDescription>
              {editTarget ? '修改问题类型的名称、描述或排序' : '创建新的问题分类类型'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">名称 *</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="类型名称"
                maxLength={32}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">描述</label>
              <Input
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="类型描述（可选）"
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">排序</label>
              <Input
                type="number"
                value={formSort}
                onChange={(e) => setFormSort(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreate(false)
                setEditTarget(null)
                resetForm()
              }}
            >
              取消
            </Button>
            <Button
              onClick={editTarget ? handleUpdate : handleCreate}
              disabled={createMutation.isPending || updateMutation.isPending || !formName.trim()}
            >
              {(createMutation.isPending || updateMutation.isPending) ? '处理中...' : (editTarget ? '保存' : '创建')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="确认删除"
        description={`确定要删除类型「${deleteTarget?.name}」吗？已关联的问题不受影响。`}
        confirmLabel="删除"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
      />
    </motion.div>
  )
}
