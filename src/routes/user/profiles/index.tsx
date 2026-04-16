/**
 * 用户端 - 游戏档案列表页
 *
 * 显示当前用户关联的 Minecraft 游戏角色档案
 * 包含配额展示、创建档案、皮肤/披风设置、用户名修改、档案详情查看
 */

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Gamepad2, Plus, Shirt, Flag, ExternalLink, Pencil, Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Badge } from '#/components/ui/badge'
import { Skeleton } from '#/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { motion } from 'motion/react'
import { cardHoverVariants, hoverLiftTransition } from '#/lib/motion-presets'
import { authStore } from '#/stores/auth-store'
import {
  useGameProfiles,
  useGameProfileQuota,
  useGameProfileDetail,
  useCreateGameProfileMutation,
  useUpdateUsernameMutation,
  useSetSkinMutation,
  useSetCapeMutation,
} from '#/api/endpoints/game-profile'
import { useSkinsList } from '#/api/endpoints/skin-library'
import { useCapesList } from '#/api/endpoints/cape-library'
import type { GameProfile, LibrarySimpleItem } from '#/api/types'

export const Route = createFileRoute('/user/profiles/')({
  component: ProfilesPage,
})

// ─── 页面组件 ─────────────────────────────────────────────

export default function ProfilesPage() {
  const isAuthenticated = authStore.state.isAuthenticated
  const { data: profiles = [], isLoading, error } = useGameProfiles({ enabled: isAuthenticated })
  const { data: quota } = useGameProfileQuota({ enabled: isAuthenticated })
  const createMutation = useCreateGameProfileMutation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')

  const isQuotaExhausted = quota != null && quota.used >= quota.total

  const handleCreateSuccess = () => { setDialogOpen(false); setNewProfileName('') }
  const handleCreateError = (err: Error) => toast.error(`创建失败: ${err.message}`)

  return (
    <div className="space-y-6">
      {/* 页面标题 + 操作 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground font-display">游戏档案</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="gap-1.5 bg-linear-to-r from-primary to-primary text-white hover:opacity-90"
                disabled={isQuotaExhausted}
              >
                <Plus className="size-4" />
                绑定档案
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>绑定新档案</DialogTitle>
                <DialogDescription>
                  输入你的 Minecraft 游戏内用户名来创建档案
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="游戏内用户名"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newProfileName.trim()) {
                    createMutation.mutate(
                      { name: newProfileName.trim() },
                      { onSuccess: handleCreateSuccess, onError: handleCreateError },
                    )
                  }
                }}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                <Button
                  className="bg-linear-to-r from-primary to-primary text-white hover:opacity-90"
                  disabled={!newProfileName.trim() || createMutation.isPending}
                  onClick={() =>
                    createMutation.mutate(
                      { name: newProfileName.trim() },
                      { onSuccess: handleCreateSuccess, onError: handleCreateError },
                    )
                  }
                >
                  {createMutation.isPending ? '创建中...' : '确认绑定'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">管理你的 Minecraft 角色档案</p>
          {quota && (
            <Badge variant="secondary" className="text-xs">
              配额 {quota.used} / {quota.total}
            </Badge>
          )}
        </div>
      </div>

      {/* 档案列表 */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive/50">
          <CardContent className="py-8 text-center">
            <p className="text-destructive">加载档案失败: {error.message}</p>
          </CardContent>
        </Card>
      ) : profiles.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Gamepad2 className="mx-auto size-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-medium text-foreground">暂无游戏档案</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              绑定你的 Minecraft 角色以开始使用皮肤和披风
            </p>
            <Button
              className="mt-4 gap-1.5 bg-linear-to-r from-primary to-primary text-white hover:opacity-90"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="size-4" />
              绑定第一个档案
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── 档案卡片组件 ─────────────────────────────────────────

function ProfileCard({ profile }: { profile: GameProfile }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [skinDialogOpen, setSkinDialogOpen] = useState(false)
  const [capeDialogOpen, setCapeDialogOpen] = useState(false)

  return (
    <>
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        transition={hoverLiftTransition}
        className="rounded-lg"
      >
        <Card className="ring-0 border border-border/70 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">{profile.name}</CardTitle>
            <CardAction>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setDetailOpen(true)}
              >
                <ExternalLink className="size-3.5" />
                详情
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-mono">UUID: {profile.uuid}</p>
                <span className="text-xs text-muted-foreground">
                  更新于: {new Date(profile.updated_at).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => setSkinDialogOpen(true)}
                >
                  <Shirt className="size-3.5" />
                  {profile.skin_library ? '更换皮肤' : '设置皮肤'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => setCapeDialogOpen(true)}
                >
                  <Flag className="size-3.5" />
                  {profile.cape_library ? '更换披风' : '设置披风'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 关联 Dialog */}
      <ProfileDetailDialog profileId={profile.id} open={detailOpen} onOpenChange={setDetailOpen} />
      <SkinSelectDialog
        profileId={profile.id}
        currentId={profile.skin_library_id}
        open={skinDialogOpen}
        onOpenChange={setSkinDialogOpen}
      />
      <CapeSelectDialog
        profileId={profile.id}
        currentId={profile.cape_library_id}
        open={capeDialogOpen}
        onOpenChange={setCapeDialogOpen}
      />
    </>
  )
}

// ─── 资源选择 Dialog（皮肤 / 披风各自独立，避免多余 hook 调用） ──

type LibraryType = 'skin' | 'cape'

const LIBRARY_CONFIG: Record<LibraryType, {
  label: string
  emptyHint: string
  uploadHint: string
  equipMsg: string
  unequipMsg: string
}> = {
  skin: {
    label: '皮肤',
    emptyHint: '你还没有上传任何皮肤',
    uploadHint: '前往「我的」页面上传皮肤',
    equipMsg: '皮肤设置成功',
    unequipMsg: '已卸下皮肤',
  },
  cape: {
    label: '披风',
    emptyHint: '你还没有上传任何披风',
    uploadHint: '前往「我的」页面上传披风',
    equipMsg: '披风设置成功',
    unequipMsg: '已卸下披风',
  },
}

/** 通用选择器内部实现（接收已确定的 query + mutation） */
function LibrarySelectInner({
  currentId,
  open,
  onOpenChange,
  type,
  config,
  items,
  isLoading,
  mutation,
}: {
  currentId: number | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  type: LibraryType
  config: (typeof LIBRARY_CONFIG)[LibraryType]
  items: LibrarySimpleItem[]
  isLoading: boolean
  mutation: { mutate(...args: unknown[]): void; isPending: boolean }
}) {
  const [selectedId, setSelectedId] = useState<string>('')
  const hasCurrentValue = currentId != null

  function handleConfirm() {
    const isUnequip = selectedId === '__unequip__'
    // 雪花算法 ID 使用 string 传递以避免精度丢失
    const payload = isUnequip ? null : (selectedId || null)
    mutation.mutate(
      type === 'skin'
        ? { skin_library_id: payload }
        : { cape_library_id: payload },
      {
        onSuccess: () => {
          toast.success(isUnequip ? config.unequipMsg : config.equipMsg)
          onOpenChange(false)
          setSelectedId('')
        },
        onError: (err: Error) => toast.error(`操作失败: ${err.message}`),
      },
    )
  }

  function handleOpenChange(newOpen: boolean) {
    onOpenChange(newOpen)
    if (!newOpen) setSelectedId('')
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>更换{config.label}</DialogTitle>
          <DialogDescription>选择要装备的{config.label}，或卸下当前{config.label}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {isLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : items.length > 0 ? (
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`请选择${config.label}...`} />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
                {hasCurrentValue && (
                  <>
                    <SelectSeparator />
                    <SelectItem value="__unequip__">
                      <span className="flex items-center gap-1.5 text-destructive">
                        <X className="size-3.5" />
                        卸下{config.label}
                      </span>
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {config.emptyHint}
              <br />
              <span className="text-xs">{config.uploadHint}</span>
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>取消</Button>
          <Button
            className="bg-linear-to-r from-primary to-primary text-white hover:opacity-90"
            disabled={!selectedId || mutation.isPending}
            onClick={handleConfirm}
          >
            {mutation.isPending ? '设置中...' : '确认设置'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** 皮肤选择 Dialog（仅注册皮肤相关 hook） */
function SkinSelectDialog(props: {
  profileId: number
  currentId: number | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const isAuthenticated = authStore.state.isAuthenticated
  const { data, isLoading } = useSkinsList({ enabled: props.open && isAuthenticated })
  const mutation = useSetSkinMutation(props.profileId)

  return (
    <LibrarySelectInner
      {...props}
      type="skin"
      config={LIBRARY_CONFIG.skin}
      items={data?.items ?? []}
      isLoading={isLoading}
      mutation={mutation}
    />
  )
}

/** 披风选择 Dialog（仅注册披风相关 hook） */
function CapeSelectDialog(props: {
  profileId: number
  currentId: number | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const isAuthenticated = authStore.state.isAuthenticated
  const { data, isLoading } = useCapesList({ enabled: props.open && isAuthenticated })
  const mutation = useSetCapeMutation(props.profileId)

  return (
    <LibrarySelectInner
      {...props}
      type="cape"
      config={LIBRARY_CONFIG.cape}
      items={data?.items ?? []}
      isLoading={isLoading}
      mutation={mutation}
    />
  )
}

// ─── 档案详情 Dialog（含内联用户名编辑） ─────────────────

function ProfileDetailDialog({
  profileId,
  open,
  onOpenChange,
}: {
  profileId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { data: profile, isLoading } = useGameProfileDetail(open ? profileId : null)
  const updateMutation = useUpdateUsernameMutation(profileId)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')

  function startEdit(currentName: string) {
    setEditName(currentName)
    setIsEditing(true)
  }

  function confirmEdit() {
    const trimmed = editName.trim()
    if (!trimmed || trimmed === profile?.name) {
      setIsEditing(false)
      return
    }
    updateMutation.mutate(
      { new_name: trimmed },
      {
        onSuccess: () => { toast.success('用户名修改成功'); setIsEditing(false) },
        onError: (err) => toast.error(`修改失败: ${err.message}`),
      },
    )
  }

  function cancelEdit() {
    setIsEditing(false)
    setEditName('')
  }

  function handleOpenChange(newOpen: boolean) {
    onOpenChange(newOpen)
    if (!newOpen) { setIsEditing(false); setEditName('') }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>档案详情</DialogTitle>
          <DialogDescription>查看游戏档案的完整信息</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : profile ? (
          <div className="space-y-3 text-sm">
            {/* 用户名（可编辑） */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">用户名</span>
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <Input
                    className="h-7 w-40 text-xs"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    autoFocus
                  />
                  <Button
                    size="sm" variant="ghost" className="size-7 p-0 text-green-600 hover:text-green-700"
                    onClick={confirmEdit}
                    disabled={updateMutation.isPending}
                  >
                    <Check className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="size-7 p-0 text-muted-foreground" onClick={cancelEdit}>
                    <X className="size-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{profile.name}</span>
                  <Button
                    size="sm" variant="ghost" className="size-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => startEdit(profile.name)}
                  >
                    <Pencil className="size-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">UUID</span>
              <span className="font-mono text-xs">{profile.uuid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">皮肤</span>
              <span>{profile.skin_library?.name ?? '未设置'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">披风</span>
              <span>{profile.cape_library?.name ?? '未设置'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">更新时间</span>
              <span>{new Date(profile.updated_at).toLocaleString('zh-CN')}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">加载失败</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
