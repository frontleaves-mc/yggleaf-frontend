/**
 * 管理员端 - 用户详情页
 * 展示用户完整信息 + 资源库数据 + 游戏档案配额调整
 */

import { createFileRoute, Link, useParams, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  ShieldAlert,
  Ban,
  CheckCircle,
  Calendar,
  Gamepad2,
  Shirt,
  Flag,
  Plus,
  Minus,
  Loader2,
  Save,
  User,
  Image as ImageIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Badge } from '#/components/ui/badge'
import { Textarea } from '#/components/ui/textarea'
import { LoadingPage } from '#/components/public/loading-page'
import {
  useAdminUserDetail,
  useAdjustGameProfileQuotaMutation,
} from '#/api/endpoints/admin-user'
import { useUserInfo } from '#/api/endpoints/user'
import { toast } from 'sonner'
import { isSuperAdmin } from '#/lib/permissions'

// ─── 动画常量 ─────────────────────────────────────────────

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

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── 子组件：信息展示行 ────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
      <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="text-[13px] font-medium">{value}</span>
    </div>
  )
}

// ─── 子组件：配额进度条 ────────────────────────────────────

function QuotaBar({
  label,
  used,
  total,
}: {
  label: string
  used: number
  total: number
}) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums font-medium">
          {used} / {total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Route 定义 ────────────────────────────────────────────

export const Route = createFileRoute('/admin/users/$userId')({
  component: AdminUserDetailPage,
})

// ─── 页面组件 ──────────────────────────────────────────────

function AdminUserDetailPage() {
  const navigate = useNavigate()
  const { userId } = useParams({ strict: false }) as { userId: string }
  const { data: userInfo } = useUserInfo()
  const { data: detail, isLoading } = useAdminUserDetail(userId)
  const quotaMutation = useAdjustGameProfileQuotaMutation(userId)

  const superMode = isSuperAdmin(userInfo?.user?.role_name)
  if (!superMode) {
    navigate({ to: '/admin' })
    return null
  }

  const [deltaInput, setDeltaInput] = useState('')
  const [remark, setRemark] = useState('')

  if (isLoading) return <LoadingPage />
  if (!detail)
    return (
      <div className="p-8 text-center text-muted-foreground">用户不存在</div>
    )

  const { user, game_profile, library_quota, skin_list, cape_list } = detail

  const roleConfig = {
    SUPER_ADMIN: {
      label: '超管',
      color: 'destructive' as const,
      Icon: ShieldAlert,
    },
    ADMIN: { label: '管理员', color: 'primary' as const, Icon: Shield },
    PLAYER: { label: '玩家', color: 'secondary' as const, Icon: User },
  }

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
      toast.success(`配额已${delta > 0 ? '增加' : '减少'} ${Math.abs(delta)} 个`)
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
          to="/admin/users"
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
            {user.username}
          </h1>
        </div>
      </motion.header>

      {/* ── 主内容区：左 2/3 + 右 1/3 ── */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* ═══ 左侧：详细信息 ═══ */}
        <motion.div variants={fadeUpItem} className="space-y-4 min-w-0">
          {/* 基本信息 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">基本信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow icon={User} label="用户 ID" value={<code className="text-xs">{user.id}</code>} />
                <InfoRow icon={User} label="用户名" value={user.username} />
                <InfoRow icon={Mail} label="邮箱" value={user.email || '-'} />
                <InfoRow icon={Phone} label="手机号" value={user.phone || '-'} />
                <InfoRow
                  icon={rc.Icon}
                  label="角色"
                  value={
                    <Badge variant="secondary" className="text-xs">
                      {rc.label}
                    </Badge>
                  }
                />
                <InfoRow
                  icon={user.has_ban ? Ban : CheckCircle}
                  label="封禁状态"
                  value={
                    <Badge
                      variant={user.has_ban ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {user.has_ban ? '已封禁' : '正常'}
                    </Badge>
                  }
                />
                <InfoRow icon={Calendar} label="注册时间" value={formatTime(user.created_at)} />
                <InfoRow icon={Calendar} label="更新时间" value={formatTime(user.updated_at)} />
                {user.jailed_at && (
                  <InfoRow icon={Ban} label="监禁时间" value={formatTime(user.jailed_at)} />
                )}
              </div>
            </CardContent>
          </Card>

          {superMode && (
          {/* 资源库配额 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                <Shirt className="h-3.5 w-3.5" />
                资源库配额
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Shirt className="h-3.5 w-3.5" />
                    皮肤配额
                  </p>
                  <QuotaBar
                    label="私有"
                    used={library_quota.skins_private_used}
                    total={library_quota.skins_private_total}
                  />
                  <QuotaBar
                    label="公开"
                    used={library_quota.skins_public_used}
                    total={library_quota.skins_public_total}
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Flag className="h-3.5 w-3.5" />
                    披风配额
                  </p>
                  <QuotaBar
                    label="私有"
                    used={library_quota.capes_private_used}
                    total={library_quota.capes_private_total}
                  />
                  <QuotaBar
                    label="公开"
                    used={library_quota.capes_public_used}
                    total={library_quota.capes_public_total}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {superMode && (
          {/* 皮肤列表 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                <Shirt className="h-3.5 w-3.5" />
                皮肤列表
                <span className="ml-auto text-xs font-normal text-muted-foreground tabular-nums">
                  {skin_list.length} 个
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {skin_list.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">暂无皮肤</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {skin_list.map((skin) => (
                    <div key={skin.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted">
                        {skin.texture_url ? (
                          <img src={skin.texture_url} alt={skin.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{skin.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-muted-foreground">{skin.model}</span>
                          <Badge
                            variant={skin.is_public ? 'secondary' : 'outline'}
                            className="text-[10px] px-1.5 py-0"
                          >
                            {skin.is_public ? '公开' : '私有'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          )}

          {superMode && (
          {/* 披风列表 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                <Flag className="h-3.5 w-3.5" />
                披风列表
                <span className="ml-auto text-xs font-normal text-muted-foreground tabular-nums">
                  {cape_list.length} 个
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cape_list.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">暂无披风</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {cape_list.map((cape) => (
                    <div key={cape.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted aspect-[2/3]">
                        {cape.texture_url ? (
                          <img src={cape.texture_url} alt={cape.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{cape.name}</p>
                        <Badge
                          variant={cape.is_public ? 'secondary' : 'outline'}
                          className="text-[10px] px-1.5 py-0 mt-0.5"
                        >
                          {cape.is_public ? '公开' : '私有'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          )}
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
                <label className="text-xs text-muted-foreground">
                  变化量（正数增加，负数减少）
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
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
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() =>
                      setDeltaInput((v) => String(Number(v || 0) + 1))
                    }
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">备注（可选）</label>
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
          )}
        </motion.aside>
      </div>
    </motion.div>
  )
}
