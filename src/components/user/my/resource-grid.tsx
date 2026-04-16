/**
 * ResourceGrid - 资源网格组件
 *
 * 展示用户上传的皮肤/披风资源，
 * 支持编辑和删除操作，数据从 API 实时获取。
 */

import { useState } from 'react'
import { Shirt, Flag, Pencil, Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Switch } from '#/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { motion } from 'motion/react'
import { cardHoverVariants, hoverLiftTransition } from '#/lib/motion-presets'
import { toast } from 'sonner'
import type { SkinLibrary, CapeLibrary } from '#/api/types'
import {
  useSkins,
  useUpdateSkinMutation,
  useDeleteSkinMutation,
} from '#/api/endpoints/skin-library'
import {
  useCapes,
  useUpdateCapeMutation,
  useDeleteCapeMutation,
} from '#/api/endpoints/cape-library'
import { ConfirmDialog } from '#/components/public/confirm-dialog'

// ─── 资源网格组件 ───────────────────────────────────────

interface ResourceGridProps {
  /** 资源类型 */
  type: 'skin' | 'cape'
}

export function ResourceGrid({ type }: ResourceGridProps) {
  const skinQuery = useSkins(
    { mode: 'mine' },
    { enabled: type === 'skin' },
  )
  const capeQuery = useCapes(
    { mode: 'mine' },
    { enabled: type === 'cape' },
  )

  const query = type === 'skin' ? skinQuery : capeQuery
  const items = query.data?.items ?? []

  // Loading 状态
  if (query.isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="ring-0 border border-border/70 overflow-hidden">
            <CardContent className="p-4">
              <div className="aspect-[3/4] rounded-lg bg-muted/50 animate-pulse mb-3" />
              <div className="h-4 w-2/3 rounded bg-muted/50 animate-pulse" />
              <div className="mt-2 h-5 w-1/3 rounded bg-muted/50 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Error 状态
  if (query.isError) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          {type === 'skin' ? (
            <Shirt className="mx-auto size-12 text-destructive/50" />
          ) : (
            <Flag className="mx-auto size-12 text-destructive/50" />
          )}
          <h3 className="mt-4 font-medium text-foreground">
            加载失败
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            无法获取{type === 'skin' ? '皮肤' : '披风'}列表，请稍后重试
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => query.refetch()}
          >
            重新加载
          </Button>
        </CardContent>
      </Card>
    )
  }

  // 空状态
  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          {type === 'skin' ? (
            <Shirt className="mx-auto size-12 text-muted-foreground/30" />
          ) : (
            <Flag className="mx-auto size-12 text-muted-foreground/30" />
          )}
          <h3 className="mt-4 font-medium text-foreground">
            暂无{type === 'skin' ? '皮肤' : '披风'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            上传你的第一个{type === 'skin' ? '皮肤' : '披风'}吧
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {type === 'skin'
        ? (items as SkinLibrary[]).map((skin) => (
            <ResourceCard key={skin.id} skin={skin} />
          ))
        : (items as CapeLibrary[]).map((cape) => (
            <ResourceCard key={cape.id} cape={cape} />
          ))}
    </div>
  )
}

// ─── 资源卡片组件 ───────────────────────────────────────

function ResourceCard({
  skin,
  cape,
}: {
  skin?: SkinLibrary
  cape?: CapeLibrary
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const deleteSkinMutation = useDeleteSkinMutation()
  const deleteCapeMutation = useDeleteCapeMutation()

  const isSkin = !!skin
  const item = skin ?? cape!
  const Icon = isSkin ? Shirt : Flag

  const isDeleting = isSkin
    ? deleteSkinMutation.isPending
    : deleteCapeMutation.isPending

  const handleDelete = async () => {
    try {
      if (isSkin) {
        await deleteSkinMutation.mutateAsync(skin!.id)
      } else {
        await deleteCapeMutation.mutateAsync(cape!.id)
      }
      toast.success(`${isSkin ? '皮肤' : '披风'}删除成功`)
      setDeleteOpen(false)
    } catch {
      toast.error(`${isSkin ? '皮肤' : '披风'}删除失败`)
    }
  }

  return (
    <>
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        transition={hoverLiftTransition}
        className="cursor-pointer rounded-lg"
      >
        <Card className="ring-0 border border-border/70 overflow-hidden group relative">
          <CardContent className="p-4">
            {/* 预览区 */}
            <div
              className={`${
                isSkin ? 'aspect-[3/4]' : 'aspect-[2/3]'
              } rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 mb-3 flex items-center justify-center relative overflow-hidden`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-8 text-primary" />
              </div>

              {/* 悬停操作 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-8 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditOpen(true)
                  }}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-8 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteOpen(true)
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* 信息 */}
            <h3 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {isSkin && (
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {skin!.model === 1 ? 'Classic' : 'Slim'}
                </Badge>
              )}
              <Badge
                className={
                  item.is_public
                    ? 'bg-chart-2/10 text-chart-2 border-chart-2/20 text-[10px]'
                    : 'text-[10px]'
                }
                variant="secondary"
              >
                {item.is_public ? '公开' : '私有'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 编辑 Dialog */}
      <EditResourceDialog
        skin={skin}
        cape={cape}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* 删除确认 */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`删除${isSkin ? '皮肤' : '披风'}`}
        description={`确定要删除「${item.name}」吗？此操作不可撤销。`}
        confirmLabel="删除"
        variant="destructive"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </>
  )
}

// ─── 编辑资源 Dialog ───────────────────────────────────

function EditResourceDialog({
  skin,
  cape,
  open,
  onOpenChange,
}: {
  skin?: SkinLibrary
  cape?: CapeLibrary
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const isSkin = !!skin
  const item = skin ?? cape!
  const [name, setName] = useState(item.name)
  const [model, setModel] = useState<string>(String(skin?.model ?? '1'))
  const [isPublic, setIsPublic] = useState(item.is_public)

  const updateSkinMutation = useUpdateSkinMutation(skin?.id ?? 0)
  const updateCapeMutation = useUpdateCapeMutation(cape?.id ?? 0)

  const isSaving = isSkin
    ? updateSkinMutation.isPending
    : updateCapeMutation.isPending

  const handleSave = async () => {
    try {
      if (isSkin) {
        await updateSkinMutation.mutateAsync({ name, is_public: isPublic })
      } else {
        await updateCapeMutation.mutateAsync({ name, is_public: isPublic })
      }
      toast.success(`${isSkin ? '皮肤' : '披风'}更新成功`)
      onOpenChange(false)
    } catch {
      toast.error(`${isSkin ? '皮肤' : '披风'}更新失败`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑{isSkin ? '皮肤' : '披风'}</DialogTitle>
          <DialogDescription>
            修改{isSkin ? '皮肤' : '披风'}的名称和设置
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-name">名称</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
            />
          </div>

          {isSkin && (
            <div className="space-y-2">
              <Label>模型类型</Label>
              <Select value={model} onValueChange={setModel} disabled={isSaving}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Classic (Steve)</SelectItem>
                  <SelectItem value="2">Slim (Alex)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
            <div className="space-y-0.5">
              <Label className="text-sm">公开{isSkin ? '皮肤' : '披风'}</Label>
              <p className="text-[12px] text-muted-foreground">
                开启后所有用户均可使用
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} disabled={isSaving} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            取消
          </Button>
          <Button
            className="bg-gradient-to-r from-primary to-primary text-white hover:opacity-90"
            onClick={handleSave}
            disabled={isSaving || !name}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                保存中...
              </>
            ) : (
              '保存修改'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
