/**
 * 用户端 - 游戏档案列表页
 *
 * 显示当前用户关联的 Minecraft 游戏角色档案
 * 包含配额展示、创建档案、皮肤/披风设置、用户名修改、档案详情查看
 */

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  Gamepad2,
  Plus,
  Shirt,
  Flag,
  ExternalLink,
  Pencil,
  Check,
  X,
  Circle,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Skeleton } from '#/components/ui/skeleton'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { PageHeader } from '#/components/public/page-header'
import { McBadge } from '#/components/shared/mc-badge'
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
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { authStore } from '#/stores/auth-store'
import {
  useGameProfiles,
  useGameProfileQuota,
  useGameProfileDetail,
  useCreateGameProfileMutation,
  useUpdateUsernameMutation,
  useSetSkinMutation,
  useSetCapeMutation,
} from '#/api/endpoints/api-auth/game-profile'
import { useSkinsList } from '#/api/endpoints/api-auth/skin-library'
import { useCapesList } from '#/api/endpoints/api-auth/cape-library'
import { useOnlineGameProfiles } from '#/api/endpoints/api-mc/player-online'
import type { OnlineGameProfileResponse } from '#/api/types/api-mc/player-online'
import type { GameProfile, LibrarySimpleItem } from '#/api/types'
import { SkinPreview } from '#/components/user/skin-preview'

export const Route = createFileRoute('/user/profiles/')({
  component: ProfilesPage,
})

// ─── 页面组件 ─────────────────────────────────────────────

export default function ProfilesPage() {
  const isAuthenticated = authStore.state.isAuthenticated
  const {
    data: profiles = [],
    isLoading,
    error,
  } = useGameProfiles({ enabled: isAuthenticated })
  const { data: quota } = useGameProfileQuota({ enabled: isAuthenticated })
  const { data: onlineProfiles = [] } = useOnlineGameProfiles()
  const createMutation = useCreateGameProfileMutation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')

  const isQuotaExhausted = quota != null && quota.used >= quota.total

  const handleCreateSuccess = () => {
    setDialogOpen(false)
    setNewProfileName('')
  }
  const handleCreateError = (err: Error) =>
    toast.error(`创建失败: ${err.message}`)

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面标题 + 操作 */}
      <motion.div variants={fadeUpItem}>
        <div className="flex items-start justify-between gap-4">
          <PageHeader
            title="游戏档案"
            description="管理你的 Minecraft 角色档案"
            icon={Gamepad2}
            variant="grass"
            className="flex-1 mb-0"
          />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="gap-1.5"
                variant="gradient"
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
                        {
                          onSuccess: handleCreateSuccess,
                          onError: handleCreateError,
                        },
                      )
                    }
                  }}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button
                    variant="gradient"
                    disabled={
                      !newProfileName.trim() || createMutation.isPending
                    }
                    onClick={() =>
                      createMutation.mutate(
                        { name: newProfileName.trim() },
                        {
                          onSuccess: handleCreateSuccess,
                          onError: handleCreateError,
                        },
                      )
                    }
                  >
                    {createMutation.isPending ? '创建中...' : '确认绑定'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* 档案列表 */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-4">
        {quota && (
          <McBadge variant="grass">配额 {quota.used} / {quota.total}</McBadge>
        )}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <McCard key={i} variant="glass" color="default" className="p-5">
                <Skeleton className="h-5 w-32" />
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </McCard>
            ))}
          </div>
        ) : error ? (
          <McCard variant="glass" color="nether" className="py-8 text-center">
            <p className="text-destructive">加载档案失败: {error.message}</p>
          </McCard>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} onlineProfiles={onlineProfiles} />
            ))}
          </div>
        ) : (
          <McCard variant="glass" color="default" className="border-dashed py-12 text-center">
            <McIconBox variant="diamond" size="lg" className="mx-auto mb-4 text-muted-foreground/30 [&>svg]:text-muted-foreground/30">
              <Gamepad2 />
            </McIconBox>
            <h3 className="font-medium text-foreground">暂无游戏档案</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              绑定你的 Minecraft 角色以开始使用皮肤和披风
            </p>
            <Button
              className="mt-4 gap-1.5"
              variant="gradient"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="size-4" />
              绑定第一个档案
            </Button>
          </McCard>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── 档案卡片组件 ─────────────────────────────────────────

function ProfileCard({ profile, onlineProfiles }: { profile: GameProfile; onlineProfiles: OnlineGameProfileResponse[] }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [skinDialogOpen, setSkinDialogOpen] = useState(false)
  const [capeDialogOpen, setCapeDialogOpen] = useState(false)

  const onlineInfo = onlineProfiles.find((op) => op.uuid === profile.uuid)

  return (
    <>
      <McCard variant="glass" color="grass" className="overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-foreground">{profile.name}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setDetailOpen(true)}
            >
              <ExternalLink className="size-3.5" />
              详情
            </Button>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-mono">
                UUID: {profile.uuid}
              </p>
              {onlineInfo ? (
                <McBadge variant="grass">
                  <Circle className="size-2 fill-current" />
                  在线 · {onlineInfo.server_name}
                  {onlineInfo.world_name && ` · ${onlineInfo.world_name}`}
                </McBadge>
              ) : null}
              <span className="text-xs text-muted-foreground">
                更新于:{' '}
                {new Date(profile.updated_at).toLocaleDateString('zh-CN')}
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
        </div>
      </McCard>

      {/* 关联 Dialog */}
      <ProfileDetailDialog
        profileId={profile.id}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
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

const LIBRARY_CONFIG: Record<
  LibraryType,
  {
    label: string
    emptyHint: string
    uploadHint: string
    equipMsg: string
    unequipMsg: string
  }
> = {
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
  mutation: { mutate: (variables: any, options?: any) => void; isPending: boolean }
}) {
  const [selectedId, setSelectedId] = useState<string>('')
  const hasCurrentValue = currentId != null

  function handleConfirm() {
    const isUnequip = selectedId === '__unequip__'
    // 雪花算法 ID 使用 string 传递以避免精度丢失
    const payload = isUnequip ? null : selectedId || null
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
          <DialogDescription>
            选择要装备的{config.label}，或卸下当前{config.label}
          </DialogDescription>
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
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            取消
          </Button>
          <Button
            variant="gradient"
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
  const { data, isLoading } = useSkinsList({
    enabled: props.open && isAuthenticated,
  })
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
  const { data, isLoading } = useCapesList({
    enabled: props.open && isAuthenticated,
  })
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
  const { data: profile, isLoading } = useGameProfileDetail(
    open ? profileId : null,
  )
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
        onSuccess: () => {
          toast.success('用户名修改成功')
          setIsEditing(false)
        },
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
    if (!newOpen) {
      setIsEditing(false)
      setEditName('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>档案详情</DialogTitle>
          <DialogDescription>查看游戏档案的完整信息</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          /* 加载态：左右分栏骨架屏 */
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-80 w-full sm:w-50 rounded-lg shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        ) : profile ? (
          /* 数据就绪：左侧 3D 预览 + 右侧信息 */
          <div className="flex flex-col sm:flex-row gap-4">
            {/* ====== 左侧：3D 角色预览 ====== */}
            <div className="w-full sm:w-50 h-80 rounded-lg bg-linear-to-br from-primary/5 to-primary/10 overflow-hidden shrink-0">
              <SkinPreview
                skinUrl={profile.skin?.texture_url}
                capeUrl={profile.cape?.texture_url}
                autoRotate
              />
            </div>

            {/* ====== 右侧：档案信息 ====== */}
            <div className="flex-1 min-w-0 space-y-3 text-sm">
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
                      size="sm"
                      variant="ghost"
                      className="size-7 p-0 text-green-600 hover:text-green-700"
                      onClick={confirmEdit}
                      disabled={updateMutation.isPending}
                    >
                      <Check className="size-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-7 p-0 text-muted-foreground"
                      onClick={cancelEdit}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{profile.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-6 p-0 text-muted-foreground hover:text-foreground"
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
                <span>{profile.skin?.name ?? '未设置'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">披风</span>
                <span>{profile.cape?.name ?? '未设置'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">更新时间</span>
                <span>
                  {new Date(profile.updated_at).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            加载失败
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
