/**
 * 管理员端 - 服务器管理列表页
 * MC 风格：nether + gold 配色
 * 分页表格 + 创建/编辑 Dialog + 删除 ConfirmDialog + 启用/公开切换
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { Plus, Trash2, Server, Pencil } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Switch } from '#/components/ui/switch'
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
  useAdminServerList,
  useCreateServerMutation,
  useUpdateServerMutation,
  useDeleteServerMutation,
  useSetServerEnabledMutation,
  useSetServerPublicMutation,
} from '#/api/endpoints/api-mc/admin-server'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import type { ServerResponse } from '#/api/types/api-mc/server-management'
import { toast } from 'sonner'
import { isSuperAdmin } from '#/lib/permissions'
import { McCard } from '#/components/shared/mc-card'
import { McBadge } from '#/components/shared/mc-badge'
import { McIconBox } from '#/components/shared/mc-icon-box'

// ─── 路由注册 ──────────────────────────────────────────────

export const Route = createFileRoute('/admin/servers/')({
  component: ServerManagementPage,
})

function ServerManagementPage() {
  const navigate = useNavigate()
  const { data: userInfo } = useUserInfo()
  if (!isSuperAdmin(userInfo?.user?.role_name)) {
    navigate({ to: '/admin' })
    return null
  }

  // 分页参数
  const [page, setPage] = useState(1)
  const [pageSize] = useState(15)

  // 数据查询
  const { data, isLoading } = useAdminServerList({
    page,
    page_size: pageSize,
  })
  const createMutation = useCreateServerMutation()
  const updateMutation = useUpdateServerMutation()
  const deleteMutation = useDeleteServerMutation()
  const setEnabledMutation = useSetServerEnabledMutation()
  const setPublicMutation = useSetServerPublicMutation()

  // 弹窗状态
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ServerResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ServerResponse | null>(null)

  // 创建表单状态
  const [formName, setFormName] = useState('')
  const [formDisplayName, setFormDisplayName] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formSortOrder, setFormSortOrder] = useState('')

  // 编辑表单状态
  const [editDisplayName, setEditDisplayName] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editSortOrder, setEditSortOrder] = useState('')
  const [editEnabled, setEditEnabled] = useState(false)
  const [editPublic, setEditPublic] = useState(false)

  const resetCreateForm = () => {
    setFormName('')
    setFormDisplayName('')
    setFormAddress('')
    setFormDescription('')
    setFormSortOrder('')
  }

  const openCreate = () => {
    resetCreateForm()
    setIsCreateDialogOpen(true)
  }

  const openEdit = (server: ServerResponse) => {
    setEditDisplayName(server.display_name)
    setEditAddress(server.address)
    setEditDescription(server.description)
    setEditSortOrder(String(server.sort_order))
    setEditEnabled(server.is_enabled)
    setEditPublic(server.is_public)
    setEditTarget(server)
  }

  // 操作处理

  const handleCreate = async () => {
    if (!formName.trim() || !formDisplayName.trim()) return
    try {
      await createMutation.mutateAsync({
        name: formName.trim(),
        display_name: formDisplayName.trim(),
        address: formAddress.trim() || undefined,
        description: formDescription.trim() || undefined,
        sort_order: formSortOrder.trim() ? Number(formSortOrder) : undefined,
      })
      toast.success('服务器创建成功')
      setIsCreateDialogOpen(false)
      resetCreateForm()
    } catch {
      toast.error('创建失败')
    }
  }

  const handleEdit = async () => {
    if (!editTarget || !editDisplayName.trim()) return
    try {
      if (editTarget.is_enabled !== editEnabled) {
        await setEnabledMutation.mutateAsync({
          id: editTarget.id,
          data: { is_enabled: editEnabled },
        })
      }
      if (editTarget.is_public !== editPublic) {
        await setPublicMutation.mutateAsync({
          id: editTarget.id,
          data: { is_public: editPublic },
        })
      }
      await updateMutation.mutateAsync({
        id: editTarget.id,
        data: {
          display_name: editDisplayName.trim(),
          address: editAddress.trim() || undefined,
          description: editDescription.trim() || undefined,
          sort_order: editSortOrder.trim() ? Number(editSortOrder) : undefined,
        },
      })
      toast.success('服务器已更新')
      setEditTarget(null)
    } catch {
      toast.error('更新失败')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success('服务器已删除')
      setDeleteTarget(null)
      const remainCount = (data?.total ?? 1) - 1
      const totalPages = Math.ceil(remainCount / pageSize)
      if (page > totalPages && totalPages > 0) {
        setPage(totalPages)
      }
    } catch {
      toast.error('删除失败')
    }
  }

  // 加载状态

  if (isLoading) return <LoadingPage />

  const servers = data?.list ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize)

  // 列定义

  const columns: ColumnDef<ServerResponse, unknown>[] = [
    {
      accessorKey: 'display_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="名称" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <McIconBox variant="nether" size="sm">
            <Server />
          </McIconBox>
          <span className="font-medium text-sm">
            {row.getValue('display_name')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="标识" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.getValue('name')}
        </span>
      ),
    },
    {
      accessorKey: 'address',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="地址" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {row.getValue('address') || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'is_enabled',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="状态" />
      ),
      cell: ({ row }) => {
        const server = row.original
        return (
          <McBadge variant={server.is_enabled ? 'gold' : 'nether'}>
            {server.is_enabled ? '启用' : '禁用'}
          </McBadge>
        )
      },
    },
    {
      accessorKey: 'is_public',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="可见性" />
      ),
      cell: ({ row }) => {
        const server = row.original
        return (
          <McBadge variant={server.is_public ? 'gold' : 'default'}>
            {server.is_public ? '公开' : '私有'}
          </McBadge>
        )
      },
    },
    {
      id: 'actions',
      header: () => <span className="text-sm font-medium">操作</span>,
      cell: ({ row }) => {
        const server = row.original
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs rounded-md hover:bg-muted transition-colors"
              onClick={() => openEdit(server)}
            >
              <Pencil data-icon="inline-start" className="size-3.5" />
              编辑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              onClick={() => setDeleteTarget(server)}
            >
              <Trash2 data-icon="inline-start" className="size-3.5" />
              删除
            </Button>
          </div>
        )
      },
      size: 160,
    },
  ]

  // 渲染

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <PageHeader description="管理游戏服务器，查看、创建、编辑或删除服务器配置">
          <Button onClick={openCreate} className="gap-1.5" variant="gradient">
            <Plus className="size-4" />
            创建服务器
          </Button>
        </PageHeader>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <McCard variant="solid" color="nether" className="overflow-hidden">
          <TableProvider columns={columns} data={servers}>
            <TSTableHeader>
              {({ headerGroup }) => (
                <TSTableHeaderGroup headerGroup={headerGroup}>
                  {({ header }) => <TSTableHead header={header} />}
                </TSTableHeaderGroup>
              )}
            </TSTableHeader>
            <TSTableBody
              emptyContent={
                <div className="flex flex-col items-center gap-3 py-8">
                  <McIconBox variant="nether" size="lg" className="mx-auto">
                    <Server />
                  </McIconBox>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      暂无服务器
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      点击右上角「创建服务器」开始
                    </p>
                  </div>
                </div>
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

      {/* 分页 */}
      {totalPages > 1 && (
        <motion.div
          variants={fadeUpItem}
          className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3"
        >
          <p className="text-[13px] text-muted-foreground">
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

      {/* 创建弹窗 */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false)
            resetCreateForm()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建服务器</DialogTitle>
            <DialogDescription>创建新的游戏服务器配置</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="server-name">服务器标识 *</Label>
              <Input
                id="server-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="例如：survival"
                maxLength={64}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-display-name">显示名称 *</Label>
              <Input
                id="server-display-name"
                value={formDisplayName}
                onChange={(e) => setFormDisplayName(e.target.value)}
                placeholder="例如：生存服务器"
                maxLength={64}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-address">服务器地址</Label>
              <Input
                id="server-address"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="例如：play.example.com:25565"
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-description">描述</Label>
              <Input
                id="server-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="服务器描述"
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server-sort-order">排序</Label>
              <Input
                id="server-sort-order"
                type="number"
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                resetCreateForm()
              }}
            >
              取消
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                createMutation.isPending ||
                !formName.trim() ||
                !formDisplayName.trim()
              }
            >
              {createMutation.isPending ? '创建中...' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑弹窗 */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑服务器</DialogTitle>
            <DialogDescription>修改服务器配置信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>服务器标识</Label>
              <p className="text-sm font-mono text-muted-foreground bg-muted/60 rounded-md px-3 py-2">
                {editTarget?.name}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-display-name">显示名称 *</Label>
              <Input
                id="edit-display-name"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                placeholder="例如：生存服务器"
                maxLength={64}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">服务器地址</Label>
              <Input
                id="edit-address"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="例如：play.example.com:25565"
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">描述</Label>
              <Input
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="服务器描述"
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sort-order">排序</Label>
              <Input
                id="edit-sort-order"
                type="number"
                value={editSortOrder}
                onChange={(e) => setEditSortOrder(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
              <div className="space-y-0.5">
                <Label className="text-sm">启用状态</Label>
                <p className="text-xs text-muted-foreground">
                  关闭后该服务器将停止响应查询
                </p>
              </div>
              <Switch checked={editEnabled} onCheckedChange={setEditEnabled} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
              <div className="space-y-0.5">
                <Label className="text-sm">公开可见</Label>
                <p className="text-xs text-muted-foreground">
                  公开后所有用户可见该服务器
                </p>
              </div>
              <Switch checked={editPublic} onCheckedChange={setEditPublic} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              取消
            </Button>
            <Button
              onClick={handleEdit}
              disabled={updateMutation.isPending || !editDisplayName.trim()}
            >
              {updateMutation.isPending ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="确认删除"
        description={`确定要删除服务器「${deleteTarget?.display_name}」吗？此操作不可撤销。`}
        confirmLabel="删除"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
      />
    </motion.div>
  )
}
