/**
 * 管理员端 - 用户游戏档案页
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
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Badge } from '#/components/ui/badge'
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

export const Route = createFileRoute('/admin/users/$userId/game-profiles')({
  component: AdminUserGameProfilesPage,
})

// ─── 角色配置 ──────────────────────────────────────────────

const roleConfig = {
  SUPER_ADMIN: {
    label: '超管',
    color: 'destructive' as const,
    Icon: ShieldAlert,
  },
  ADMIN: { label: '管理员', color: 'primary' as const, Icon: Shield },
  PLAYER: { label: '玩家', color: 'secondary' as const, Icon: User },
}

// ─── 子组件：档案卡片 ──────────────────────────────────────

function ProfileCard({ profile }: { profile: AdminGameProfileItem }) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      {/* 头像区 + 档案名称 */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{profile.name}</p>
          <p className="font-mono text-[11px] text-muted-foreground truncate">
            {profile.uuid}
          </p>
        </div>
      </div>

      {/* 皮肤 / 披风信息 */}
      <div className="space-y-1.5">
        {profile.skin && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shirt className="h-3 w-3 shrink-0" />
            <span className="truncate">{profile.skin.name}</span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 shrink-0"
            >
              {profile.skin.model === 2 ? 'ALEX' : 'STEVE'}
            </Badge>
          </div>
        )}
        {profile.cape && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Flag className="h-3 w-3 shrink-0" />
            <span className="truncate">{profile.cape.name}</span>
          </div>
        )}
      </div>

      {/* 更新时间 */}
      <p className="text-[11px] text-muted-foreground">
        更新于 {formatTime(profile.updated_at)}
      </p>
    </div>
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
  const profiles = profilesData?.data ?? []
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
      {/* ── 页面头部 ── */}
      <motion.header variants={fadeUpItem} className="flex items-center gap-4">
        <Link
          to="/admin/users/$userId"
          params={{ userId }}
          className="group inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-colors hover:border-primary/25 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge
              variant="secondary"
              className={`text-xs ${
                rc.color === 'destructive'
                  ? 'bg-destructive/10 text-destructive'
                  : rc.color === 'primary'
                    ? 'bg-primary/10 text-primary'
                    : ''
              }`}
            >
              <rc.Icon className="mr-1 h-3 w-3" />
              {rc.label}
            </Badge>
            {user.has_ban && (
              <Badge variant="destructive" className="text-xs">
                <Ban className="mr-1 h-3 w-3" />
                已封禁
              </Badge>
            )}
          </div>
          <h1 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl truncate">
            {user.username} - 游戏档案
          </h1>
        </div>
      </motion.header>

      {/* ── 主内容区：左 2/3 + 右 1/3 ── */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* ═══ 左侧：游戏档案列表 ═══ */}
        <motion.div variants={fadeUpItem} className="space-y-4 min-w-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                <Gamepad2 className="h-3.5 w-3.5" />
                游戏档案列表
                <span className="ml-auto text-xs font-normal text-muted-foreground tabular-nums">
                  {profiles.length} 个
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profiles.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  暂无游戏档案
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {profiles.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ═══ 右侧：游戏档案配额 + 调整操作 ═══ */}
        <motion.aside
          variants={fadeUpItem}
          className="lg:sticky lg:top-6 lg:self-start space-y-4"
        >
          {/* 游戏档案配额概览 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                <Gamepad2 className="h-3.5 w-3.5" />
                游戏档案配额
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
            </CardContent>
          </Card>

          {superMode && (
            <>
              {/* 配额调整操作 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    调整配额
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                </CardContent>
              </Card>
            </>
          )}
        </motion.aside>
      </div>
    </motion.div>
  )
}
