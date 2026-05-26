/**
 * 管理员端 - 游戏档案详情页
 * MC 风格：nether + gold 配色
 * 展示档案完整信息 + 管理操作（强制设置皮肤/披风、重置档案）
 */

import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  Gamepad2,
  Shirt,
  Flag,
  RotateCcw,
  UserCircle,
  Gift,
  X,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { McCard } from '#/components/shared/mc-card'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { LoadingPage } from '#/components/public/loading-page'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { ConfirmDialog } from '#/components/public/confirm-dialog'
import {
  useAdminGameProfileDetail,
  useForceSetSkinMutation,
  useForceSetCapeMutation,
  useForceResetProfileMutation,
} from '#/api/endpoints/api-auth/admin-game-profile'
import {
  useAdminUserSkins,
  useAdminUserCapes,
  useGiftSkinMutation,
  useRevokeSkinMutation,
  useGiftCapeMutation,
  useRevokeCapeMutation,
  useSyncQuotaMutation,
} from '#/api/endpoints/api-auth/admin-library'
import { useSkinsList } from '#/api/endpoints/api-auth/skin-library'
import { useCapesList } from '#/api/endpoints/api-auth/cape-library'
import { useSetPageTitle } from '#/components/layout/page-title-context'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { formatTime } from '#/lib/format'

// ─── Route 定义 ────────────────────────────────────────────

export const Route = createFileRoute('/admin/game-profiles/$profileId')({
  component: GameProfileDetailPage,
})

// ─── 信息行组件 ──────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-4 py-3">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-mono font-medium">{value}</span>
    </div>
  )
}

// ─── 页面组件 ──────────────────────────────────────────────

function GameProfileDetailPage() {
  const { profileId } = useParams({ strict: false })
  const { data: detail, isLoading } = useAdminGameProfileDetail(profileId!)
  const setTitle = useSetPageTitle()

  const skinMutation = useForceSetSkinMutation(profileId!)
  const capeMutation = useForceSetCapeMutation(profileId!)
  const resetMutation = useForceResetProfileMutation(profileId!)

  const userId = detail?.user.id ?? ''
  const { data: skinsData } = useAdminUserSkins(userId)
  const { data: capesData } = useAdminUserCapes(userId)
  const giftSkinMutation = useGiftSkinMutation(userId)
  const revokeSkinMutation = useRevokeSkinMutation(userId)
  const giftCapeMutation = useGiftCapeMutation(userId)
  const revokeCapeMutation = useRevokeCapeMutation(userId)
  const syncQuotaMutation = useSyncQuotaMutation(userId)

  const { data: skinsListData, isLoading: skinsListLoading } = useSkinsList({ enabled: !!userId })
  const { data: capesListData, isLoading: capesListLoading } = useCapesList({ enabled: !!userId })

  // 对话框状态
  const [skinDialogOpen, setSkinDialogOpen] = useState(false)
  const [capeDialogOpen, setCapeDialogOpen] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [giftSkinDialogOpen, setGiftSkinDialogOpen] = useState(false)
  const [giftCapeDialogOpen, setGiftCapeDialogOpen] = useState(false)
  const [syncQuotaDialogOpen, setSyncQuotaDialogOpen] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState<{
    type: 'skin' | 'cape'
    id: string
    name: string
  } | null>(null)

  // 输入状态
  const [skinLibraryId, setSkinLibraryId] = useState('')
  const [capeLibraryId, setCapeLibraryId] = useState('')
  const [giftSkinId, setGiftSkinId] = useState('')
  const [giftCapeId, setGiftCapeId] = useState('')

  // 页面标题同步
  useEffect(() => {
    if (detail) setTitle(detail.name)
    return () => setTitle(null)
  }, [detail, setTitle])

  // ─── 操作处理 ──────────────────────────────────────

  const handleForceSetSkin = async () => {
    try {
      await skinMutation.mutateAsync({
        skin_library_id: skinLibraryId || null,
      })
      toast.success(skinLibraryId ? '皮肤已强制设置' : '皮肤已卸下')
      setSkinDialogOpen(false)
      setSkinLibraryId('')
    } catch {
      toast.error('设置皮肤失败')
    }
  }

  const handleForceSetCape = async () => {
    try {
      await capeMutation.mutateAsync({
        cape_library_id: capeLibraryId || null,
      })
      toast.success(capeLibraryId ? '披风已强制设置' : '披风已卸下')
      setCapeDialogOpen(false)
      setCapeLibraryId('')
    } catch {
      toast.error('设置披风失败')
    }
  }

  const handleForceReset = async () => {
    try {
      await resetMutation.mutateAsync()
      toast.success('档案已重置')
      setResetDialogOpen(false)
    } catch {
      toast.error('重置档案失败')
    }
  }

  const handleGiftSkin = async () => {
    try {
      await giftSkinMutation.mutateAsync({ assignment_type: 3, skin_library_id: giftSkinId })
      toast.success('皮肤赠送成功')
      setGiftSkinDialogOpen(false)
      setGiftSkinId('')
    } catch {
      toast.error('赠送皮肤失败')
    }
  }

  const handleGiftCape = async () => {
    try {
      await giftCapeMutation.mutateAsync({ assignment_type: 3, cape_library_id: giftCapeId })
      toast.success('披风赠送成功')
      setGiftCapeDialogOpen(false)
      setGiftCapeId('')
    } catch {
      toast.error('赠送披风失败')
    }
  }

  const handleRevoke = async () => {
    if (!revokeTarget) return
    try {
      if (revokeTarget.type === 'skin') {
        await revokeSkinMutation.mutateAsync(revokeTarget.id)
      } else {
        await revokeCapeMutation.mutateAsync(revokeTarget.id)
      }
      toast.success(`${revokeTarget.type === 'skin' ? '皮肤' : '披风'}撤销成功`)
      setRevokeTarget(null)
    } catch {
      toast.error('撤销失败')
    }
  }

  const handleSyncQuota = async () => {
    try {
      await syncQuotaMutation.mutateAsync()
      toast.success('配额同步成功')
      setSyncQuotaDialogOpen(false)
    } catch {
      toast.error('同步配额失败')
    }
  }

  // ─── 加载 / 错误态 ──────────────────────────────────

  if (isLoading) return <LoadingPage />
  if (!detail) {
    return (
      <div className="p-8 text-center text-muted-foreground">档案不存在</div>
    )
  }

  const { user } = detail

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面头部 */}
      <motion.header variants={fadeUpItem} className="flex items-center gap-4">
        <Link
          to="/admin/game-profiles"
          className="group inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-colors hover:border-mc-nether/30 hover:text-mc-nether"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">游戏档案详情</p>
          <h1 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl truncate">
            {detail.name}
          </h1>
        </div>
      </motion.header>

      {/* 主内容区：左 + 右 */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* 左侧：档案信息 */}
        <motion.div variants={fadeUpItem} className="space-y-4 min-w-0">
          <McCard variant="solid" color="nether">
            <div className="p-5 space-y-4">
              <McSectionHeader
                title="档案信息"
                icon={Gamepad2}
                variant="nether"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow label="档案 ID" value={detail.id} />
                <InfoRow label="玩家名称" value={detail.name} />
                <InfoRow label="UUID" value={detail.uuid} />
                <InfoRow label="所属用户" value={user.username} />
                <InfoRow
                  label="皮肤库 ID"
                  value={detail.skin_library_id || '未设置'}
                />
                <InfoRow
                  label="披风库 ID"
                  value={detail.cape_library_id || '未设置'}
                />
                <InfoRow
                  label="更新时间"
                  value={formatTime(detail.updated_at)}
                />
              </div>
            </div>
          </McCard>

          {/* 关联用户信息 */}
          <McCard variant="solid" color="gold">
            <div className="p-5 space-y-4">
              <McSectionHeader
                title="关联用户"
                icon={UserCircle}
                variant="gold"
              />
              <div className="flex items-center gap-4">
                <McIconBox variant="gold" size="md">
                  <UserCircle />
                </McIconBox>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    用户 ID: {user.id}
                  </p>
                </div>
              </div>
            </div>
          </McCard>
        </motion.div>

        {/* 右侧：管理操作 */}
        <motion.aside
          variants={fadeUpItem}
          className="lg:sticky lg:top-6 lg:self-start space-y-4"
        >
          <McCard variant="solid" color="nether">
            <div className="p-5 space-y-3">
              <McSectionHeader
                title="管理操作"
                icon={Gamepad2}
                variant="nether"
              />

              {/* 强制设置皮肤 */}
              <div className="space-y-2">
                <Input
                  placeholder="皮肤库 ID（留空卸下）"
                  value={skinLibraryId}
                  onChange={(e) => setSkinLibraryId(e.target.value)}
                  className="text-xs"
                />
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  size="sm"
                  onClick={() => setSkinDialogOpen(true)}
                >
                  <Shirt className="h-4 w-4 mr-2" />
                  强制设置皮肤
                </Button>
              </div>

              {/* 强制设置披风 */}
              <div className="space-y-2">
                <Input
                  placeholder="披风库 ID（留空卸下）"
                  value={capeLibraryId}
                  onChange={(e) => setCapeLibraryId(e.target.value)}
                  className="text-xs"
                />
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  size="sm"
                  onClick={() => setCapeDialogOpen(true)}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  强制设置披风
                </Button>
              </div>

              {/* 重置档案 */}
              <Button
                className="w-full justify-start"
                variant="destructive"
                size="sm"
                onClick={() => setResetDialogOpen(true)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                重置档案
              </Button>

              {/* 同步配额 */}
              <Button
                className="w-full justify-start cursor-pointer transition-colors duration-200"
                variant="outline"
                size="sm"
                onClick={() => setSyncQuotaDialogOpen(true)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                同步配额
              </Button>
            </div>
          </McCard>

          {/* 用户皮肤库 */}
          <McCard variant="solid" color="gold">
            <div className="p-5 space-y-3">
              <McSectionHeader
                title="用户皮肤库"
                icon={Shirt}
                variant="gold"
              />
              {skinsData?.items && skinsData.items.length > 0 ? (
                <div className="space-y-1">
                  {skinsData.items.map((skin) => (
                    <div
                      key={skin.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-[13px] font-medium">{skin.name}</span>
                        <span className="ml-2 text-[11px] text-muted-foreground">
                          {skin.model === 1 ? 'Steve' : 'Alex'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[11px] text-muted-foreground hover:text-destructive cursor-pointer"
                        onClick={() => setRevokeTarget({ type: 'skin', id: String(skin.id), name: skin.name })}
                      >
                        <X className="h-3 w-3 mr-1" />
                        撤销
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-muted-foreground">暂无皮肤</p>
              )}
              <div className="space-y-2">
                <Select value={giftSkinId} onValueChange={setGiftSkinId}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="选择要赠送的皮肤..." />
                  </SelectTrigger>
                  <SelectContent>
                    {skinsListLoading ? (
                      <SelectItem value="__loading__" disabled>加载中...</SelectItem>
                    ) : (
                      skinsListData?.items.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button
                  className="w-full justify-start cursor-pointer transition-colors duration-200"
                  variant="outline"
                  size="sm"
                  disabled={!giftSkinId}
                  onClick={() => setGiftSkinDialogOpen(true)}
                >
                  <Gift className="h-4 w-4 mr-2" />
                  赠送皮肤
                </Button>
              </div>
            </div>
          </McCard>

          {/* 用户披风库 */}
          <McCard variant="solid" color="gold">
            <div className="p-5 space-y-3">
              <McSectionHeader
                title="用户披风库"
                icon={Flag}
                variant="gold"
              />
              {capesData?.items && capesData.items.length > 0 ? (
                <div className="space-y-1">
                  {capesData.items.map((cape) => (
                    <div
                      key={cape.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-[13px] font-medium">{cape.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[11px] text-muted-foreground hover:text-destructive cursor-pointer"
                        onClick={() => setRevokeTarget({ type: 'cape', id: String(cape.id), name: cape.name })}
                      >
                        <X className="h-3 w-3 mr-1" />
                        撤销
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-muted-foreground">暂无披风</p>
              )}
              <div className="space-y-2">
                <Select value={giftCapeId} onValueChange={setGiftCapeId}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="选择要赠送的披风..." />
                  </SelectTrigger>
                  <SelectContent>
                    {capesListLoading ? (
                      <SelectItem value="__loading__" disabled>加载中...</SelectItem>
                    ) : (
                      capesListData?.items.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button
                  className="w-full justify-start cursor-pointer transition-colors duration-200"
                  variant="outline"
                  size="sm"
                  disabled={!giftCapeId}
                  onClick={() => setGiftCapeDialogOpen(true)}
                >
                  <Gift className="h-4 w-4 mr-2" />
                  赠送披风
                </Button>
              </div>
            </div>
          </McCard>
        </motion.aside>
      </div>

      {/* ─── 确认对话框 ──────────────────────────────── */}

      <ConfirmDialog
        open={skinDialogOpen}
        onOpenChange={setSkinDialogOpen}
        title="强制设置皮肤"
        description={
          skinLibraryId
            ? `将档案的皮肤强制设置为「${skinLibraryId}」，确认继续？`
            : '将卸下当前档案的皮肤，确认继续？'
        }
        confirmLabel="确认设置"
        variant="default"
        onConfirm={handleForceSetSkin}
        loading={skinMutation.isPending}
      />

      <ConfirmDialog
        open={capeDialogOpen}
        onOpenChange={setCapeDialogOpen}
        title="强制设置披风"
        description={
          capeLibraryId
            ? `将档案的披风强制设置为「${capeLibraryId}」，确认继续？`
            : '将卸下当前档案的披风，确认继续？'
        }
        confirmLabel="确认设置"
        variant="default"
        onConfirm={handleForceSetCape}
        loading={capeMutation.isPending}
      />

      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="重置游戏档案"
        description="此操作将重置该游戏档案的所有数据（皮肤、披风等），此操作不可撤销。"
        confirmLabel="确认重置"
        variant="destructive"
        onConfirm={handleForceReset}
        loading={resetMutation.isPending}
      />

      {/* 赠送皮肤确认 */}
      <ConfirmDialog
        open={giftSkinDialogOpen}
        onOpenChange={setGiftSkinDialogOpen}
        title="赠送皮肤"
        description={`确认将皮肤「${skinsListData?.items.find(i => String(i.id) === giftSkinId)?.name ?? giftSkinId}」赠送给该用户？`}
        confirmLabel="确认赠送"
        variant="default"
        onConfirm={handleGiftSkin}
        loading={giftSkinMutation.isPending}
      />

      {/* 赠送披风确认 */}
      <ConfirmDialog
        open={giftCapeDialogOpen}
        onOpenChange={setGiftCapeDialogOpen}
        title="赠送披风"
        description={`确认将披风「${capesListData?.items.find(i => String(i.id) === giftCapeId)?.name ?? giftCapeId}」赠送给该用户？`}
        confirmLabel="确认赠送"
        variant="default"
        onConfirm={handleGiftCape}
        loading={giftCapeMutation.isPending}
      />

      {/* 撤销确认 */}
      <ConfirmDialog
        open={!!revokeTarget}
        onOpenChange={(open) => { if (!open) setRevokeTarget(null) }}
        title={`撤销${revokeTarget?.type === 'skin' ? '皮肤' : '披风'}`}
        description={revokeTarget ? `确认撤销「${revokeTarget.name}」？此操作不可撤销。` : ''}
        confirmLabel="确认撤销"
        variant="destructive"
        onConfirm={handleRevoke}
        loading={revokeSkinMutation.isPending || revokeCapeMutation.isPending}
      />

      {/* 同步配额确认 */}
      <ConfirmDialog
        open={syncQuotaDialogOpen}
        onOpenChange={setSyncQuotaDialogOpen}
        title="同步配额"
        description="将重新计算并同步该用户的资源库配额，确认继续？"
        confirmLabel="确认同步"
        variant="default"
        onConfirm={handleSyncQuota}
        loading={syncQuotaMutation.isPending}
      />
    </motion.div>
  )
}
