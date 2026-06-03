/**
 * 管理员端 - 插件凭证管理列表页
 * MC 风格：nether + gold 配色
 * 分页表格 + 创建 Dialog + 删除 ConfirmDialog
 */

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Plus, Trash2, KeyRound, Eye, Lock } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
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
import { SecretKeyRevealDialog } from '#/components/shared/secret-key-reveal-dialog'
import {
  usePluginCredentialList,
  useCreatePluginCredentialMutation,
  useDeletePluginCredentialMutation,
} from '#/api/endpoints/api-mc/admin-plugin-credential'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import type { PluginCredentialResponse } from '#/api/types'
import { toast } from 'sonner'
import { isSuperAdmin } from '#/lib/permissions'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { McDataTableShell } from '#/components/shared/mc-data-table-shell'
import { McEmptyState } from '#/components/shared/mc-empty-state'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'

// ─── 路由注册 ──────────────────────────────────────────────

export const Route = createFileRoute('/admin/plugin-credentials/')({
  component: PluginCredentialsPage,
})

function PluginCredentialsPage() {
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
  const { data, isLoading } = usePluginCredentialList({
    page,
    page_size: pageSize,
  })
  const createMutation = useCreatePluginCredentialMutation()
  const deleteMutation = useDeletePluginCredentialMutation()

  // 弹窗状态
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isKeyRevealDialogOpen, setIsKeyRevealDialogOpen] = useState(false)
  const [revealedKey, setRevealedKey] = useState('')
  const [revealedCredentialName, setRevealedCredentialName] = useState('')
  const [deleteTarget, setDeleteTarget] =
    useState<PluginCredentialResponse | null>(null)

  // 创建表单状态
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')

  const resetCreateForm = () => {
    setFormName('')
    setFormDesc('')
  }

  const openCreate = () => {
    resetCreateForm()
    setIsCreateDialogOpen(true)
  }

  // 操作处理

  const handleCreate = async () => {
    if (!formName.trim() || !formDesc.trim()) return
    try {
      const result = await createMutation.mutateAsync({
        name: formName.trim(),
        description: formDesc.trim(),
      })
      toast.success('凭证创建成功')
      setIsCreateDialogOpen(false)
      resetCreateForm()
      // 展示完整密钥
      setRevealedKey(result.secret_key)
      setRevealedCredentialName(result.name)
      setIsKeyRevealDialogOpen(true)
    } catch {
      toast.error('创建失败')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success('凭证已删除')
      setDeleteTarget(null)
      // 删除后如果当前页无数据，回退到上一页
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

  const credentials = data?.list ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize)

  // 列定义

  const columns: ColumnDef<PluginCredentialResponse, unknown>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="凭证名称" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <McIconBox variant="gold" size="sm">
            <KeyRound />
          </McIconBox>
          <span className="font-medium text-sm">{row.getValue('name')}</span>
        </div>
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
      accessorKey: 'secret_key',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="密钥" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 rounded-none bg-muted/60 px-2.5 py-1.5">
          <Lock className="size-3 text-muted-foreground shrink-0" />
          <span className="font-mono text-xs text-muted-foreground truncate max-w-[180px]">
            {row.original.secret_key}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="创建时间" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.created_at)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] text-foreground">
              {date.toLocaleDateString('zh-CN')}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {diffDays === 0
                ? '今天'
                : diffDays === 1
                  ? '昨天'
                  : `${diffDays} 天前`}
              {' · '}
              {date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: () => <span className="text-sm font-medium">操作</span>,
      cell: ({ row }) => {
        const credential = row.original
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs rounded-none hover:bg-muted transition-colors"
              asChild
            >
              <Link
                to="/admin/plugin-credentials/$credentialId"
                params={{ credentialId: credential.id }}
              >
                <Eye data-icon="inline-start" className="size-3.5" />
                详情
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none transition-colors"
              onClick={() => setDeleteTarget(credential)}
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
        <PageHeader description="管理 API 插件凭证，查看、创建或删除凭证密钥">
          <Button onClick={openCreate} className="gap-1.5" variant="gradient">
            <Plus className="size-4" />
            创建凭证
          </Button>
        </PageHeader>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <McDataTableShell accent="gold">
          <TableProvider columns={columns} data={credentials}>
            <TSTableHeader>
              {({ headerGroup }) => (
                <TSTableHeaderGroup headerGroup={headerGroup}>
                  {({ header }) => <TSTableHead header={header} />}
                </TSTableHeaderGroup>
              )}
            </TSTableHeader>
            <TSTableBody
              emptyContent={
                <McEmptyState
                  title="暂无插件凭证"
                  description="点击右上角「创建凭证」开始"
                  icon={KeyRound}
                />
              }
            >
              {({ row }) => (
                <TSTableRow row={row}>
                  {({ cell }) => <TSTableCell cell={cell} />}
                </TSTableRow>
              )}
            </TSTableBody>
          </TableProvider>
        </McDataTableShell>
      </motion.div>

      {/* 分页 */}
      {totalPages > 1 && (
        <motion.div
          variants={fadeUpItem}
          className="flex items-center justify-between rounded-none border border-border/60 bg-muted/30 px-4 py-3"
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
            <DialogTitle>创建插件凭证</DialogTitle>
            <DialogDescription>
              创建新的 API 插件凭证，创建后密钥仅展示一次
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="credential-name">凭证名称 *</Label>
              <Input
                id="credential-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="例如：my-plugin-client"
                maxLength={64}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credential-desc">描述 *</Label>
              <Input
                id="credential-desc"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="凭证用途描述"
                maxLength={255}
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
                createMutation.isPending || !formName.trim() || !formDesc.trim()
              }
            >
              {createMutation.isPending ? '创建中...' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 密钥展示弹窗 */}
      <SecretKeyRevealDialog
        open={isKeyRevealDialogOpen}
        onOpenChange={setIsKeyRevealDialogOpen}
        secretKey={revealedKey}
        credentialName={revealedCredentialName}
      />

      {/* 删除确认 */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="确认删除"
        description={`确定要删除凭证「${deleteTarget?.name}」吗？此操作不可撤销，关联的插件将无法继续使用该密钥。`}
        confirmLabel="删除"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
      />
    </motion.div>
  )
}
