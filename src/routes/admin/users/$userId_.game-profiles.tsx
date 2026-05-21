/**
 * 管理员端 - 用户游戏档案页
 * MC 风格：nether + gold 配色
 * 展示游戏档案列表 + 配额管理（从用户详情页拆分）
 */

import {
  createFileRoute,
  Link,
  useParams,
  useNavigate,
} from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  Ban,
  User,
  Gamepad2,
  Plus,
  Minus,
  Loader2,
  Save,
  Shirt,
  Flag,
  Image as ImageIcon,
} from 'lucide-react'
import { McCard } from '#/components/shared/mc-card'
import { McBadge } from '#/components/shared/mc-badge'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { LoadingPage } from '#/components/public/loading-page'
import {
  useAdminUserGameProfiles,
  useAdminUserDetail,
  useAdjustGameProfileQuotaMutation,
} from '#/api/endpoints/api-auth/admin-user'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import { toast } from 'sonner'
import { isSuperAdmin } from '#/lib/permissions'
import { useSetPageTitle } from '#/components/layout/page-title-context'
import {
  staggerContainer,
  fadeUpItem,
  formatTime,
  QuotaBar,
} from './components'
import type { AdminGameProfileItem } from '#/api/types'

// ─── Route 定义 ────────────────────────────────────────────

export const Route = createFileRoute('/admin/users/$userId_/game-profiles')({
  component: AdminUserGameProfilesPage,
})

// ─── 角色配置 ──────────────────────────────────────────────

const roleConfig = {
  SUPER_ADMIN: {
    label: '超管',
    variant: 'nether' as const,
    Icon: ShieldAlert,
  },
  ADMIN: { label: '管理员', variant: 'gold' as const, Icon: Shield },
  PLAYER: { label: '玩家', variant: 'default' as const, Icon: User },
}

// ─── 子组件：档案卡片（MC 风格） ─────────────────────────────

function ProfileCard({ profile }: { profile: AdminGameProfileItem }) {
  return (
    <McCard variant="solid" color="gold">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <McIconBox variant="nether" size="md">
            <span className="text-sm font-semibold">{profile.name.charAt(0).toUpperCase()}</span>
          </McIconBox>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{profile.name}</p>
            <p className="font-mono text-[11px] text-muted-foreground truncate">
              {profile.uuid}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          {profile.skin && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shirt className="h-3 w-3 shrink-0" />
              <span className="truncate">{profile.skin.name}</span>
              <McBadge variant="default">
                {profile.skin.model === 2 ? 'ALEX' : 'STEVE'}
              </McBadge>
            </div>
          )}
          {profile.cape && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Flag className="h-3 w-3 shrink-0" />
              <span className="truncate">{profile.cape.name}</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground">
          更新于 {formatTime(profile.updated_at)}
        </p>
      </div>
    </McCard>
  )
}

// ─── 页面组件 ──────────────────────────────────────────────

function AdminUserGameProfilesPage() {
  const navigate = useNavigate()
  const { userId } = useParams({ strict: false })
  const { data: userInfo } = useUserInfo()
  const { data: detail, isLoading: detailLoading } = useAdminUserDetail(userId)
  const { data: profilesData, isLoading: profilesLoading } =
    useAdminUserGameProfiles(userId)
  const quotaMutation = useAdjustGameProfileQuotaMutation(userId)
  const setTitle = useSetPageTitle()

  const [deltaInput, setDeltaInput] = useState('')
  const [remark, setRemark] = useState('')

  useEffect(() => {
    if (detail) setTitle(`${detail.user.username} - 游戏档案`)
    return () => setTitle(null)
  }, [detail, setTitle])

  const superMode = isSuperAdmin(userInfo?.user.role_name)
  if (!superMode) {
    navigate({ to: '/admin' })
    return null
  }

  if (detailLoading || profilesLoading) return <LoadingPage />
  if (!detail)
    return (
      <div className="p-8 text-center text-muted-foreground">用户不存在</div>
    )

  const { user, game_profile } = detail
  const profiles = profilesData?.items ?? []
  const rc = roleConfig[user.role_name] ?? roleConfig.PLAYER

  const handleAdjustQuota = async () => {
    const delta = Number(deltaInput)
    if (!delta || isNaN(delta)) {
      toast.error('请输入有效的数值')
      return
    }
    try {
      await quotaMutation.mutateAsync({
        delta,
        remark: remark || undefined,
      })
      toast.success(
        `配额已${delta > 0 ? '增加' : '减少'} ${Math.abs(delta)} 个`,
      )
      setDeltaInput('')
      setRemark('')
    } catch {
      toast.error('调整配额失败')
    }
  }

  return (
    <motion.div
      className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面头部 */}
      <motion.header variants={fadeUpItem} className="flex items-center gap-4">
        <Link
          to="/admin/users/$userId"
          params={{ userId }}
          className="group inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-colors hover:border-mc-nether/30 hover:text-mc-nether"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <McBadge variant={rc.variant}>
              <rc.Icon className="size-3" />
              {rc.label}
            </McBadge>
            {user.has_ban && (
              <McBadge variant="nether">
                <Ban className="size-3" />
                已封禁
              </McBadge>
            )}
          </div>
          <h1 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl truncate">
            {user.username} - 游戏档案
          </h1>
        </div>
      </motion.header>

      {/* 主内容区：左 2/3 + 右 1/3 */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* 左侧：游戏档案列表 */}
        <motion.div variants={fadeUpItem} className="space-y-3 min-w-0">
          <McSectionHeader
            title={`游戏档案列表 · ${profiles.length} 个`}
            icon={Gamepad2}
            variant="nether"
          />
          {profiles.length === 0 ? (
            <McCard variant="solid" color="default">
              <div className="py-10 text-center">
                <McIconBox variant="nether" size="lg" className="mx-auto mb-3">
                  <Gamepad2 />
                </McIconBox>
                <p className="text-sm text-muted-foreground">暂无游戏档案</p>
              </div>
            </McCard>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </motion.div>

        {/* 右侧：游戏档案配额 + 调整操作 */}
        <motion.aside
          variants={fadeUpItem}
          className="lg:sticky lg:top-6 lg:self-start space-y-4"
        >
          {/* 游戏档案配额概览 */}
          <McCard variant="solid" color="gold">
            <div className="p-5 space-y-3">
              <McSectionHeader
                title="游戏档案配额"
                icon={Gamepad2}
                variant="gold"
              />
              <div className="text-center space-y-2 py-2">
                <p className="text-3xl font-bold tabular-nums tracking-tight">
                  {game_profile.used}
                  <span className="text-base text-muted-foreground font-normal">
                    /{game_profile.total}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  剩余{' '}
                  <span className="font-medium tabular-nums text-foreground">
                    {Math.max(0, game_profile.total - game_profile.used)}
                  </span>{' '}
                  个档案位
                </p>
              </div>
              <QuotaBar
                label="已使用"
                used={game_profile.used}
                total={game_profile.total}
              />
            </div>
          </McCard>

          {superMode && (
            <McCard variant="solid" color="nether">
              <div className="p-5 space-y-3">
                <McSectionHeader
                  title="调整配额"
                  icon={Plus}
                  variant="nether"
                />
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">
                    变化量（正数增加，负数减少）
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-lg"
                      className="shrink-0"
                      onClick={() =>
                        setDeltaInput((v) => String(Number(v || 0) - 1))
                      }
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <Input
                      type="number"
                      className="text-center font-mono text-sm"
                      value={deltaInput}
                      onChange={(e) => setDeltaInput(e.target.value)}
                      placeholder="0"
                    />
                    <Button
                      variant="outline"
                      size="icon-lg"
                      className="shrink-0"
                      onClick={() =>
                        setDeltaInput((v) => String(Number(v || 0) + 1))
                      }
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">
                    备注（可选）
                  </span>
                  <Textarea
                    rows={2}
                    maxLength={255}
                    className="resize-none text-sm"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="调整原因..."
                  />
                  <div className="text-right text-[11px] text-muted-foreground tabular-nums">
                    {remark.length}/255
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={handleAdjustQuota}
                  disabled={
                    quotaMutation.isPending ||
                    !deltaInput ||
                    isNaN(Number(deltaInput)) ||
                    Number(deltaInput) === 0
                  }
                >
                  {quotaMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1.5" />
                      确认调整
                    </>
                  )}
                </Button>
              </div>
            </McCard>
          )}
        </motion.aside>
      </div>
    </motion.div>
  )
}
