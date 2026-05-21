/**
 * 管理员端 - 用户详情页
 * MC 风格：nether + gold 配色
 * 展示用户完整信息 + 资源库数据
 */

import {
  createFileRoute,
  Link,
  useParams,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  Ban,
  Shirt,
  Flag,
  User,
  Image as ImageIcon,
} from 'lucide-react'
import { McCard } from '#/components/shared/mc-card'
import { McBadge } from '#/components/shared/mc-badge'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { LoadingPage } from '#/components/public/loading-page'
import { useAdminUserDetail } from '#/api/endpoints/api-auth/admin-user'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import { isSuperAdmin } from '#/lib/permissions'
import { useSetPageTitle } from '#/components/layout/page-title-context'
import {
  staggerContainer,
  fadeUpItem,
  formatTime,
  QuotaBar,
} from './components'

// ─── Route 定义 ────────────────────────────────────────────

export const Route = createFileRoute('/admin/users/$userId')({
  component: AdminUserDetailPage,
})

// ─── 页面组件 ──────────────────────────────────────────────

function AdminUserDetailPage() {
  const navigate = useNavigate()
  const { userId } = useParams({ strict: false })
  const { data: userInfo } = useUserInfo()
  const { data: detail, isLoading } = useAdminUserDetail(userId)
  const setTitle = useSetPageTitle()

  const superMode = isSuperAdmin(userInfo?.user?.role_name)
  if (!superMode) {
    navigate({ to: '/admin' })
    return null
  }

  useEffect(() => {
    if (detail) setTitle(detail.user.username)
    return () => setTitle(null)
  }, [detail, setTitle])

  if (isLoading) return <LoadingPage />
  if (!detail)
    return (
      <div className="p-8 text-center text-muted-foreground">用户不存在</div>
    )

  const { user, library_quota, skin_list, cape_list } = detail

  const roleConfig = {
    SUPER_ADMIN: {
      label: '超管',
      variant: 'nether' as const,
      Icon: ShieldAlert,
    },
    ADMIN: { label: '管理员', variant: 'gold' as const, Icon: Shield },
    PLAYER: { label: '玩家', variant: 'default' as const, Icon: User },
  }

  const rc = roleConfig[user.role_name] ?? roleConfig.PLAYER

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
          to="/admin/users"
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
            {user.username}
          </h1>
        </div>
      </motion.header>

      {/* 主内容区：左 + 右 */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* 左侧：详细信息 */}
        <motion.div variants={fadeUpItem} className="space-y-4 min-w-0">
          {superMode && (
            <McCard variant="solid" color="gold">
              <div className="p-5 space-y-4">
                <McSectionHeader
                  title="资源库配额"
                  icon={Shirt}
                  variant="gold"
                />
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
              </div>
            </McCard>
          )}

          {superMode && (
            <McCard variant="solid" color="nether">
              <div className="p-5 space-y-4">
                <McSectionHeader
                  title={`皮肤列表 · ${skin_list.length} 个`}
                  icon={Shirt}
                  variant="nether"
                />
                {skin_list.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    暂无皮肤
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {skin_list.map((skin) => (
                      <div
                        key={skin.id}
                        className="flex items-center gap-3 rounded-lg border border-border/60 p-3 bg-muted/30"
                      >
                        <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted">
                          {skin.texture_url ? (
                            <img
                              src={skin.texture_url}
                              alt={skin.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {skin.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-muted-foreground">
                              {skin.model}
                            </span>
                            <McBadge variant={skin.is_public ? 'gold' : 'default'}>
                              {skin.is_public ? '公开' : '私有'}
                            </McBadge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </McCard>
          )}

          {superMode && (
            <McCard variant="solid" color="gold">
              <div className="p-5 space-y-4">
                <McSectionHeader
                  title={`披风列表 · ${cape_list.length} 个`}
                  icon={Flag}
                  variant="gold"
                />
                {cape_list.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    暂无披风
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {cape_list.map((cape) => (
                      <div
                        key={cape.id}
                        className="flex items-center gap-3 rounded-lg border border-border/60 p-3 bg-muted/30"
                      >
                        <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted aspect-[2/3]">
                          {cape.texture_url ? (
                            <img
                              src={cape.texture_url}
                              alt={cape.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {cape.name}
                          </p>
                          <McBadge variant={cape.is_public ? 'gold' : 'default'} className="mt-0.5">
                            {cape.is_public ? '公开' : '私有'}
                          </McBadge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </McCard>
          )}
        </motion.div>

        {/* 右侧：基本信息 */}
        <motion.aside
          variants={fadeUpItem}
          className="lg:sticky lg:top-6 lg:self-start"
        >
          <McCard variant="solid" color="nether" className="p-5">
            <div className="flex justify-center mb-4">
              <McIconBox variant="nether" size="lg">
                <span className="text-xl font-bold">{user.username.charAt(0).toUpperCase()}</span>
              </McIconBox>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">用户名</span>
                <span className="truncate font-medium">{user.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">邮箱</span>
                <span className="truncate">{user.email || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">角色</span>
                <McBadge variant={rc.variant}>{rc.label}</McBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">更新时间</span>
                <span className="text-xs">{formatTime(user.updated_at)}</span>
              </div>
            </div>
          </McCard>
        </motion.aside>
      </div>
    </motion.div>
  )
}
