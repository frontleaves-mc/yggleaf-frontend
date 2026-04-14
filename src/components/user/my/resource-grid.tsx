/**
 * ResourceGrid - 资源网格组件
 *
 * 展示用户上传的皮肤/披风资源，
 * 支持编辑和删除操作。
 */

import { useState } from 'react'
import { Shirt, Flag, Pencil, Trash2 } from 'lucide-react'
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
import type { SkinLibrary, CapeLibrary } from '#/api/types'

// ─── Mock 数据 ─────────────────────────────────────────

const MOCK_MY_SKINS: SkinLibrary[] = [
  {
    id: 101,
    name: '我的骑士皮肤',
    model: 1,
    texture: 9001,
    texture_hash: 'abc123def456',
    is_public: false,
    user_id: 1,
    updated_at: '2025-12-01T10:00:00Z',
  },
  {
    id: 102,
    name: '暗夜精灵',
    model: 2,
    texture: 9002,
    texture_hash: 'ghi789jkl012',
    is_public: true,
    user_id: 1,
    updated_at: '2025-12-05T14:30:00Z',
  },
  {
    id: 103,
    name: '冰霜猎人',
    model: 1,
    texture: 9003,
    texture_hash: 'mno345pqr678',
    is_public: false,
    user_id: 1,
    updated_at: '2025-12-10T09:15:00Z',
  },
]

const MOCK_MY_CAPES: CapeLibrary[] = [
  {
    id: 201,
    name: '自定义龙翼',
    texture: 8001,
    texture_hash: 'stu901vwx234',
    is_public: false,
    user_id: 1,
    updated_at: '2025-12-03T08:00:00Z',
  },
  {
    id: 202,
    name: '星云披风',
    texture: 8002,
    texture_hash: 'yza567bcd890',
    is_public: true,
    user_id: 1,
    updated_at: '2025-12-08T16:45:00Z',
  },
]

// ─── 资源网格组件 ───────────────────────────────────────

interface ResourceGridProps {
  /** 资源类型 */
  type: 'skin' | 'cape'
}

export function ResourceGrid({ type }: ResourceGridProps) {
  const skins = type === 'skin' ? MOCK_MY_SKINS : []
  const capes = type === 'cape' ? MOCK_MY_CAPES : []
  const items = type === 'skin' ? skins : capes

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
  const isSkin = !!skin
  const item = skin ?? cape!
  const Icon = isSkin ? Shirt : Flag

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
                    // TODO: 删除逻辑
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
            />
          </div>

          {isSkin && (
            <div className="space-y-2">
              <Label>模型类型</Label>
              <Select value={model} onValueChange={setModel}>
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
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            className="bg-gradient-to-r from-primary to-primary text-white hover:opacity-90"
            onClick={() => {
              // TODO: 保存逻辑
              onOpenChange(false)
            }}
          >
            保存修改
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
