/**
 * 用户端 - 游戏档案列表页
 *
 * 显示当前用户关联的 Minecraft 游戏角色档案
 * 包含配额展示、创建档案、档案详情查看
 */

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Gamepad2, Plus, Shirt, ExternalLink } from 'lucide-react'
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
import { motion } from 'motion/react'
import { cardHoverVariants, hoverLiftTransition } from '#/lib/motion-presets'
import { authStore } from '#/stores/auth-store'
import {
  useGameProfiles,
  useGameProfileQuota,
  useGameProfileDetail,
  useCreateGameProfileMutation,
} from '#/api/endpoints/game-profile'
import type { GameProfile } from '#/api/types'

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
                      { onSuccess: () => { setDialogOpen(false); setNewProfileName('') } },
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
                  className="bg-gradient-to-r from-primary to-primary text-white hover:opacity-90"
                  disabled={!newProfileName.trim() || createMutation.isPending}
                  onClick={() => {
                    createMutation.mutate(
                      { name: newProfileName.trim() },
                      { onSuccess: () => { setDialogOpen(false); setNewProfileName('') } },
                    )
                  }}
                >
                  {createMutation.isPending ? '创建中...' : '确认绑定'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            管理你的 Minecraft 角色档案
          </p>
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
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
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
        /* 空状态 */
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Gamepad2 className="mx-auto size-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-medium text-foreground">暂无游戏档案</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              绑定你的 Minecraft 角色以开始使用皮肤和披风
            </p>
            <Button
              className="mt-4 gap-1.5 bg-gradient-to-r from-primary to-primary text-white hover:opacity-90"
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
                <p className="text-xs text-muted-foreground font-mono">
                  UUID: {profile.uuid}
                </p>
                <span className="text-xs text-muted-foreground">
                  更新于: {new Date(profile.updated_at).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs shrink-0">
                <Shirt className="size-3.5" />
                更换皮肤
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <ProfileDetailDialog
        profileId={profile.id}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  )
}

// ─── 档案详情 Dialog ──────────────────────────────────────

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>档案详情</DialogTitle>
          <DialogDescription>
            查看游戏档案的完整信息
          </DialogDescription>
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">用户名</span>
              <span className="font-medium">{profile.name}</span>
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
