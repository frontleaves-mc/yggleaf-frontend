/**
 * 管理员端 - 称号管理页
 * CRUD 操作 + 分配/撤销，使用 TanStack Table + Dialog
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Plus, Pencil, Trash2, Tags, UserPlus, UserMinus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Badge } from '#/components/ui/badge'
import { Label } from '#/components/ui/label'
import { ColorPicker } from '#/components/ui/color-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
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
  useAdminTitles,
  useCreateTitleMutation,
  useUpdateTitleMutation,
  useDeleteTitleMutation,
  useAssignTitleMutation,
  useRevokeTitleMutation,
} from '#/api/endpoints/api-mc/admin-title'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import { TitleType } from '#/api/types'
import type { TitleResponse, AdminTitleListParams } from '#/api/types'
import { toast } from 'sonner'
import { isSuperAdmin } from '#/lib/permissions'

// ─── 动画预设 ──────────────────────────────────────────────

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

// ─── 辅助函数 ──────────────────────────────────────────────

function getTitleTypeBadge(type: TitleType) {
  const map: Record<number, { label: string; className: string }> = {
    [TitleType.General]: {
      label: '通用',
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    [TitleType.Group]: {
      label: '权限组',
      className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    [TitleType.Exclusive]: {
      label: '专属',
      className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
  }
  const info = map[type] ?? {
    label: '未知',
    className: 'bg-muted text-muted-foreground',
  }
  return (
    <Badge variant="secondary" className={info.className}>
      {info.label}
    </Badge>
  )
}

// ─── 路由注册 ──────────────────────────────────────────────

export const Route = createFileRoute('/admin/titles/')({
  component: TitlesAdminPage,
})

function TitlesAdminPage() {
  const navigate = useNavigate()
  const { data: userInfo } = useUserInfo()
  if (!isSuperAdmin(userInfo?.user?.role_name)) {
    navigate({ to: '/admin' })
    return null
  }

  // ─── 分页参数 ────────────────────────────────────────
  const [page, setPage] = useState(1)
  const [pageSize] = useState(15)
  const params: AdminTitleListParams = { page, page_size: pageSize }

  // ─── 数据查询 ────────────────────────────────────────
  const { data, isLoading } = useAdminTitles(params)
  const createMutation = useCreateTitleMutation()
  const updateMutation = useUpdateTitleMutation()
  const deleteMutation = useDeleteTitleMutation()
  const assignMutation = useAssignTitleMutation()
  const revokeMutation = useRevokeTitleMutation()

  // ─── 弹窗状态 ────────────────────────────────────────
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<TitleResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TitleResponse | null>(null)
  const [assignTarget, setAssignTarget] = useState<TitleResponse | null>(null)

  // ─── 表单状态 ────────────────────────────────────────
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formType, setFormType] = useState<string>(String(TitleType.General))
  const [formPermGroup, setFormPermGroup] = useState('')
  const [formColor, setFormColor] = useState('#000000')
  const [formIsActive, setFormIsActive] = useState(true)
  const [formPlayerUuid, setFormPlayerUuid] = useState('')

  const resetForm = () => {
    setFormName('')
    setFormDesc('')
    setFormColor('#000000')
    setFormType(String(TitleType.General))
    setFormPermGroup('')
    setFormIsActive(true)
  }

  const resetAssignForm = () => {
    setFormPlayerUuid('')
  }

  const openCreate = () => {
    resetForm()
    setShowCreate(true)
  }

  const openEdit = (title: TitleResponse) => {
    setFormName(title.name)
    setFormDesc(title.description)
    setFormColor(title.color ?? '#000000')
    setFormType(String(title.type))
    setFormPermGroup(title.permission_group ?? '')
    setFormIsActive(title.is_active)
    setEditTarget(title)
  }

  // ─── 操作处理 ────────────────────────────────────────

  const handleCreate = async () => {
    if (!formName.trim()) return
    if (!/^#[0-9A-Fa-f]{6}$/.test(formColor)) {
      toast.error('颜色格式无效，请选择有效的十六进制颜色')
      return
    }
    try {
      await createMutation.mutateAsync({
        name: formName.trim(),
        description: formDesc.trim(),
        color: formColor,
        type: Number(formType) as TitleType,
        permission_group: formPermGroup.trim() || undefined,
      })
      toast.success('称号创建成功')
      setShowCreate(false)
      resetForm()
    } catch {
      toast.error('创建失败')
    }
  }

  const handleUpdate = async () => {
    if (!editTarget || !formName.trim()) return
    if (!/^#[0-9A-Fa-f]{6}$/.test(formColor)) {
      toast.error('颜色格式无效，请选择有效的十六进制颜色')
      return
    }
    try {
      await updateMutation.mutateAsync({
        id: editTarget.id,
        data: {
          name: formName.trim(),
          description: formDesc.trim(),
          color: formColor,
          type: Number(formType) as TitleType,
          permission_group: formPermGroup.trim() || undefined,
          is_active: formIsActive,
        },
      })
      toast.success('称号更新成功')
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
      toast.success('称号已删除')
      setDeleteTarget(null)
    } catch {
      toast.error('删除失败')
    }
  }

  const handleToggleActive = async (title: TitleResponse) => {
    try {
      await updateMutation.mutateAsync({
        id: title.id,
        data: {
          name: title.name,
          description: title.description,
          color: title.color,
          type: title.type,
          permission_group: title.permission_group || undefined,
          is_active: !title.is_active,
        },
      })
      toast.success(title.is_active ? '已禁用' : '已启用')
    } catch {
      toast.error('操作失败')
    }
  }

  const handleAssign = async () => {
    if (!assignTarget || !formPlayerUuid.trim()) return
    try {
      await assignMutation.mutateAsync({
        id: assignTarget.id,
        data: { player_uuid: formPlayerUuid.trim() },
      })
      toast.success('称号已分配')
      setAssignTarget(null)
      resetAssignForm()
    } catch {
      toast.error('分配失败')
    }
  }

  const handleRevoke = async () => {
    if (!assignTarget || !formPlayerUuid.trim()) return
    try {
      await revokeMutation.mutateAsync({
        id: assignTarget.id,
        data: { player_uuid: formPlayerUuid.trim() },
      })
      toast.success('称号已撤销')
      setAssignTarget(null)
      resetAssignForm()
    } catch {
      toast.error('撤销失败')
    }
  }

  // ─── 加载状态 ────────────────────────────────────────

  if (isLoading) return <LoadingPage />

  const titles = data?.list ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize)

  // ─── 列定义 ──────────────────────────────────────────

  const columns: ColumnDef<TitleResponse, unknown>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {row.original.id.slice(0, 8)}...
        </span>
      ),
      size: 80,
    },
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
      accessorKey: 'color',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="颜色" />
      ),
      cell: ({ row }) => (
        <div
          className="size-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      ),
      size: 64,
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
      cell: ({ row }) => getTitleTypeBadge(row.original.type),
      size: 96,
    },
    {
      accessorKey: 'permission_group',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="权限组" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue('permission_group') || '-'}
        </span>
      ),
      size: 100,
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
            className={`cursor-pointer ${
              active
                ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            onClick={() => handleToggleActive(row.original)}
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
        const title = row.original
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => openEdit(title)}
            >
              <Pencil className="mr-1 h-3 w-3" />
              编辑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {
                setAssignTarget(title)
                resetAssignForm()
              }}
            >
              <UserPlus className="mr-1 h-3 w-3" />
              分配
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={() => setDeleteTarget(title)}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              删除
            </Button>
          </div>
        )
      },
      size: 200,
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
        <PageHeader description="管理 Minecraft 服务器称号的创建、分配与撤销">
          <Button onClick={openCreate} className="gap-1.5">
            <Plus className="h-4 w-4" />
            新建称号
          </Button>
        </PageHeader>
      </motion.div>

      <motion.div
        variants={fadeUpItem}
        className="rounded-xl border border-border/70 overflow-hidden"
      >
        <TableProvider columns={columns} data={titles}>
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
                <Tags className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  暂无称号，点击右上角新建
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
            <DialogTitle>{editTarget ? '编辑称号' : '新建称号'}</DialogTitle>
            <DialogDescription>
              {editTarget ? '修改称号的名称、描述或类型' : '创建新的称号定义'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title-name">名称 *</Label>
              <Input
                id="title-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="称号名称"
                maxLength={64}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title-desc">描述 *</Label>
              <Input
                id="title-desc"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="称号描述"
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label>颜色</Label>
              <ColorPicker value={formColor} onChange={setFormColor} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title-type">类型 *</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger id="title-type">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(TitleType.General)}>
                    通用称号
                  </SelectItem>
                  <SelectItem value={String(TitleType.Group)}>
                    权限组称号
                  </SelectItem>
                  <SelectItem value={String(TitleType.Exclusive)}>
                    玩家专属称号
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title-perm">权限组</Label>
              <Input
                id="title-perm"
                value={formPermGroup}
                onChange={(e) => setFormPermGroup(e.target.value)}
                placeholder="权限组标识（可选）"
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
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                !formName.trim() ||
                !formDesc.trim()
              }
            >
              {createMutation.isPending || updateMutation.isPending
                ? '处理中...'
                : editTarget
                  ? '保存'
                  : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 分配/撤销弹窗 */}
      <Dialog
        open={!!assignTarget}
        onOpenChange={(open) => {
          if (!open) {
            setAssignTarget(null)
            resetAssignForm()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>分配 / 撤销称号</DialogTitle>
            <DialogDescription>
              为玩家分配或撤销称号「{assignTarget?.name}」
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="player-uuid">玩家 UUID *</Label>
              <Input
                id="player-uuid"
                value={formPlayerUuid}
                onChange={(e) => setFormPlayerUuid(e.target.value)}
                placeholder="输入玩家 UUID"
              />
            </div>
          </div>
          <DialogFooter className="flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setAssignTarget(null)
                resetAssignForm()
              }}
            >
              取消
            </Button>
            <Button
              onClick={handleRevoke}
              disabled={revokeMutation.isPending || !formPlayerUuid.trim()}
              variant="destructive"
            >
              {revokeMutation.isPending ? (
                '处理中...'
              ) : (
                <>
                  <UserMinus className="mr-2 h-4 w-4" />
                  撤销
                </>
              )}
            </Button>
            <Button
              onClick={handleAssign}
              disabled={assignMutation.isPending || !formPlayerUuid.trim()}
            >
              {assignMutation.isPending ? (
                '处理中...'
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  分配
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="确认删除"
        description={`确定要删除称号「${deleteTarget?.name}」吗？已分配给玩家的称号将被收回。`}
        confirmLabel="删除"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
      />
    </motion.div>
  )
}
