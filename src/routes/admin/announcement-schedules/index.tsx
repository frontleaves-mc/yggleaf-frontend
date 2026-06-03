/**
 * 管理员端 - 调度管理页 (MC 风格)
 * CRUD 操作 + 激活/停用，使用 TanStack Table + Dialog + 动态调度项列表
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Plus, Pencil, Trash2, Clock, Play, Pause, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
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
import { LoadingPage } from '#/components/public/loading-page'
import { ConfirmDialog } from '#/components/public/confirm-dialog'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import {
  useAdminSchedules,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useActivateScheduleMutation,
  useDeactivateScheduleMutation,
} from '#/api/endpoints/api-mc/admin-announcement-schedule'
import { useAdminAnnouncements } from '#/api/endpoints/api-mc/admin-announcement'
import type {
  ScheduleResponse,
  AdminScheduleListParams,
} from '#/api/types/api-mc/announcement-schedule'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { isSuperAdmin } from '#/lib/permissions'
import { McCard } from '#/components/shared/mc-card'
import { PageHeader } from '#/components/public/page-header'
import { McBadge } from '#/components/shared/mc-badge'

// ─── 常量映射 ──────────────────────────────────────────────

const MODE_LABEL_MAP: Record<number, string> = {
  1: '顺序',
  2: '循环',
}

/** 调度项表单状态（本地编辑用） */
interface ScheduleFormItem {
  uid: string
  announcement_id: string
  delay_seconds: number
  sort_order: number
}

// ─── 辅助函数 ──────────────────────────────────────────────

function getModeBadge(mode: number) {
  const label = MODE_LABEL_MAP[mode] ?? '未知'
  return (
    <McBadge
      variant={mode === 1 ? 'diamond' : mode === 2 ? 'nether' : 'default'}
    >
      {label}
    </McBadge>
  )
}

function getActiveBadge(isActive: boolean) {
  return (
    <McBadge variant={isActive ? 'grass' : 'default'}>
      {isActive ? '启用' : '停用'}
    </McBadge>
  )
}

// ─── 路由注册 ──────────────────────────────────────────────

export const Route = createFileRoute('/admin/announcement-schedules/')({
  component: AdminAnnouncementSchedulesPage,
})

function AdminAnnouncementSchedulesPage() {
  const navigate = useNavigate()
  const { data: userInfo } = useUserInfo()

  // ─── 分页参数 ────────────────────────────────────────
  const [page, setPage] = useState(1)
  const [pageSize] = useState(15)
  const params: AdminScheduleListParams = { page, page_size: pageSize }

  // ─── 数据查询 ────────────────────────────────────────
  const { data, isLoading } = useAdminSchedules(params)
  const createMutation = useCreateScheduleMutation()
  const updateMutation = useUpdateScheduleMutation()
  const deleteMutation = useDeleteScheduleMutation()
  const activateMutation = useActivateScheduleMutation()
  const deactivateMutation = useDeactivateScheduleMutation()

  // 公告列表（用于调度项选择下拉）
  const { data: announcementsData } = useAdminAnnouncements({ page_size: 100 })
  const announcements = announcementsData?.list ?? []

  // ─── 弹窗状态 ────────────────────────────────────────
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<ScheduleResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ScheduleResponse | null>(
    null,
  )
  const [toggleTarget, setToggleTarget] = useState<{
    schedule: ScheduleResponse
    action: 'activate' | 'deactivate'
  } | null>(null)

  // ─── 表单状态 ────────────────────────────────────────
  const [formName, setFormName] = useState('')
  const [formMode, setFormMode] = useState<string>('1')
  const [formIntervalSeconds, setFormIntervalSeconds] = useState<string>('')
  const [formItems, setFormItems] = useState<ScheduleFormItem[]>([])

  // ─── 权限检查 ────────────────────────────────────────
  if (!isSuperAdmin(userInfo?.user?.role_name)) {
    navigate({ to: '/admin' })
    return null
  }

  /** 重置表单为空白 */
  const resetForm = () => {
    setFormName('')
    setFormMode('1')
    setFormIntervalSeconds('')
    setFormItems([])
  }

  /** 打开创建弹窗 */
  const openCreate = () => {
    resetForm()
    setShowCreate(true)
  }

  /** 打开编辑弹窗，预填数据 */
  const openEdit = (schedule: ScheduleResponse) => {
    setFormName(schedule.name)
    setFormMode(String(schedule.mode))
    setFormIntervalSeconds(
      schedule.interval_seconds ? String(schedule.interval_seconds) : '',
    )
    setFormItems(
      schedule.items.map((item) => ({
        uid: crypto.randomUUID(),
        announcement_id: item.announcement_id,
        delay_seconds: item.delay_seconds,
        sort_order: item.sort_order,
      })),
    )
    setEditTarget(schedule)
  }

  /** 添加一个空调度项 */
  const addItem = () => {
    setFormItems((prev) => [
      ...prev,
      {
        uid: crypto.randomUUID(),
        announcement_id: '',
        delay_seconds: 0,
        sort_order: prev.length,
      },
    ])
  }

  /** 移除指定索引的调度项 */
  const removeItem = (index: number) => {
    setFormItems((prev) => prev.filter((_, i) => i !== index))
  }

  /** 更新指定索引的调度项字段 */
  const updateItem = (
    index: number,
    field: keyof ScheduleFormItem,
    value: string | number,
  ) => {
    setFormItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
  }

  // ─── 操作处理 ────────────────────────────────────────

  const handleCreate = async () => {
    if (!formName.trim()) return
    try {
      await createMutation.mutateAsync({
        name: formName.trim(),
        mode: Number(formMode),
        items: formItems
          .filter((it) => it.announcement_id)
          .map((it) => ({
            announcement_id: it.announcement_id,
            delay_seconds: it.delay_seconds || undefined,
            sort_order: it.sort_order || undefined,
          })),
        interval_seconds:
          formMode === '2' && formIntervalSeconds
            ? Number(formIntervalSeconds)
            : undefined,
      })
      toast.success('调度创建成功')
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
          mode: Number(formMode),
          items: formItems
            .filter((it) => it.announcement_id)
            .map((it) => ({
              announcement_id: it.announcement_id,
              delay_seconds: it.delay_seconds || undefined,
              sort_order: it.sort_order || undefined,
            })),
          interval_seconds:
            formMode === '2' && formIntervalSeconds
              ? Number(formIntervalSeconds)
              : undefined,
        },
      })
      toast.success('调度更新成功')
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
      toast.success('调度已删除')
      setDeleteTarget(null)
    } catch {
      toast.error('删除失败')
    }
  }

  const handleToggle = async () => {
    if (!toggleTarget) return
    try {
      if (toggleTarget.action === 'activate') {
        await activateMutation.mutateAsync(toggleTarget.schedule.id)
        toast.success('调度已激活')
      } else {
        await deactivateMutation.mutateAsync(toggleTarget.schedule.id)
        toast.success('调度已停用')
      }
      setToggleTarget(null)
    } catch {
      toast.error('操作失败')
    }
  }

  // ─── 加载状态 ────────────────────────────────────────

  if (isLoading) return <LoadingPage />

  const schedules = data?.list ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize)

  // ─── 列定义 ──────────────────────────────────────────

  const columns: ColumnDef<ScheduleResponse, unknown>[] = [
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
      accessorKey: 'mode',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="模式" />
      ),
      cell: ({ row }) => getModeBadge(row.original.mode),
      size: 96,
    },
    {
      accessorKey: 'interval_seconds',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="间隔(秒)" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground tabular-nums">
          {row.original.interval_seconds ?? '-'}
        </span>
      ),
      size: 96,
    },
    {
      accessorKey: 'is_active',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="状态" />
      ),
      cell: ({ row }) => getActiveBadge(row.original.is_active),
      size: 80,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="创建时间" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.created_at).toLocaleDateString('zh-CN')}
        </span>
      ),
      size: 120,
    },
    {
      id: 'actions',
      header: () => <span className="text-sm font-medium">操作</span>,
      cell: ({ row }) => {
        const schedule = row.original
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => openEdit(schedule)}
            >
              <Pencil className="mr-1 h-3 w-3" />
              编辑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 text-xs ${
                schedule.is_active
                  ? ''
                  : 'bg-mc-grass/10 text-mc-grass hover:bg-mc-grass/20 hover:text-mc-grass'
              }`}
              onClick={() =>
                setToggleTarget({
                  schedule,
                  action: schedule.is_active ? 'deactivate' : 'activate',
                })
              }
            >
              {schedule.is_active ? (
                <>
                  <Pause className="mr-1 h-3 w-3" />
                  停用
                </>
              ) : (
                <>
                  <Play className="mr-1 h-3 w-3" />
                  激活
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              disabled={schedule.is_active}
              onClick={() => setDeleteTarget(schedule)}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              删除
            </Button>
          </div>
        )
      },
      size: 220,
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
        <div className="flex items-center justify-between">
          <PageHeader
            title="调度管理"
            subtitle="Schedules"
            description="管理公告推送调度"
            icon={Clock}
            variant="gold"
          />
          <Button onClick={openCreate} className="gap-1.5">
            <Plus className="h-4 w-4" />
            创建调度
          </Button>
        </div>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <McCard
          variant="solid"
          color="gold"
          className="p-0 overflow-hidden [&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none"
        >
          <TableProvider columns={columns} data={schedules}>
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
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    暂无调度，点击右上角创建
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
        </McCard>
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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editTarget ? '编辑调度' : '创建调度'}</DialogTitle>
            <DialogDescription>
              {editTarget
                ? '修改调度的名称、模式及调度项配置'
                : '创建新的公告推送调度'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="schedule-name">名称 *</Label>
              <Input
                id="schedule-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="调度名称"
                maxLength={64}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-mode">模式 *</Label>
              <Select value={formMode} onValueChange={setFormMode}>
                <SelectTrigger id="schedule-mode">
                  <SelectValue placeholder="选择模式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">顺序模式</SelectItem>
                  <SelectItem value="2">循环模式</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formMode === '2' && (
              <div className="space-y-2">
                <Label htmlFor="schedule-interval">间隔秒数</Label>
                <Input
                  id="schedule-interval"
                  type="number"
                  min={0}
                  value={formIntervalSeconds}
                  onChange={(e) => setFormIntervalSeconds(e.target.value)}
                  placeholder="循环间隔秒数"
                />
              </div>
            )}

            {/* 调度项动态列表 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>调度项</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={addItem}
                >
                  <Plus className="h-3 w-3" />
                  添加调度项
                </Button>
              </div>

              {formItems.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">
                  暂无调度项，点击上方按钮添加
                </p>
              )}

              {formItems.map((item, index) => (
                <div
                  key={item.uid}
                  className="flex items-start gap-2 rounded-none border p-3 space-x-2"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    <Select
                      value={item.announcement_id}
                      onValueChange={(val) =>
                        updateItem(index, 'announcement_id', val)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择公告" />
                      </SelectTrigger>
                      <SelectContent>
                        {announcements.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={0}
                        placeholder="延迟秒数"
                        value={item.delay_seconds}
                        onChange={(e) =>
                          updateItem(
                            index,
                            'delay_seconds',
                            Number(e.target.value),
                          )
                        }
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min={0}
                        placeholder="排序序号"
                        value={item.sort_order}
                        onChange={(e) =>
                          updateItem(
                            index,
                            'sort_order',
                            Number(e.target.value),
                          )
                        }
                        className="w-24"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8 text-destructive hover:bg-destructive/10 mt-5"
                    onClick={() => removeItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
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
                formItems.length === 0 ||
                formItems.every((it) => !it.announcement_id)
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

      {/* 删除确认 */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="确认删除"
        description={
          deleteTarget?.is_active
            ? '活动调度需先停用才能删除'
            : `确定要删除调度「${deleteTarget?.name}」吗？此操作不可撤销。`
        }
        confirmLabel="删除"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending || !!deleteTarget?.is_active}
        variant="destructive"
      />

      {/* 激活/停用确认 */}
      <ConfirmDialog
        open={!!toggleTarget}
        onOpenChange={(open) => !open && setToggleTarget(null)}
        title={toggleTarget?.action === 'activate' ? '确认激活' : '确认停用'}
        description={
          toggleTarget?.action === 'activate'
            ? `确定要激活调度「${toggleTarget?.schedule.name}」吗？激活后将开始按计划推送公告。`
            : `确定要停用调度「${toggleTarget?.schedule.name}」吗？停用后将停止推送。`
        }
        confirmLabel={toggleTarget?.action === 'activate' ? '激活' : '停用'}
        onConfirm={handleToggle}
        loading={
          toggleTarget?.action === 'activate'
            ? activateMutation.isPending
            : deactivateMutation.isPending
        }
        variant={
          toggleTarget?.action === 'deactivate' ? 'destructive' : 'default'
        }
      />
    </motion.div>
  )
}
