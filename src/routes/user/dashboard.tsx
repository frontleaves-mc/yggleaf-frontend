/**
 * 用户端仪表盘 - 玩家控制中心 (MC 风格)
 *
 * 布局：12 列网格 (左 8 右 4)
 *   - 左侧：欢迎区 + 在线玩家 + 公告
 *   - 右侧：游戏配置指南 + 快捷引导
 */

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  BookOpen,
  ExternalLink,
  Flag,
  Gamepad2,
  KeyRound,
  Mail,
  Megaphone,
  Shirt,
  Users,
  Wallet,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import { useUserEconomyBalance } from '#/api/endpoints/api-mc/player-economy'
import { usePublicAnnouncements } from '#/api/endpoints/api-mc/public-announcement'
import { useServerStatus } from '#/api/endpoints/api-mc/server-status'
import { DashboardWelcome } from '#/components/dashboard/dashboard-welcome'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { mcStaggerGrid, mcStaggerGridItem } from '#/lib/motion-presets'

export const Route = createFileRoute('/user/dashboard')({
  component: DashboardPage,
})

/** 仪表盘展示的公告条数 */
const DASHBOARD_ANNOUNCEMENT_LIMIT = 3

const quickLinks = [
  {
    title: '皮肤库',
    icon: Shirt,
    to: '/user/skins',
    variant: 'diamond' as const,
  },
  {
    title: '披风库',
    icon: Flag,
    to: '/user/capes',
    variant: 'nether' as const,
  },
  {
    title: '游戏档案',
    icon: Gamepad2,
    to: '/user/profiles',
    variant: 'grass' as const,
  },
]

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <McIconBox variant="diamond" size="sm">
        <Icon />
      </McIconBox>
      <div className="min-w-0 flex flex-col gap-0.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
          {label}
        </span>
        <span className="truncate text-sm font-semibold text-foreground">
          {value}
        </span>
      </div>
    </div>
  )
}

function GameConfigGuide({
  user,
}: {
  user: { email?: string | null } | undefined
}) {
  return (
    <motion.div variants={mcStaggerGridItem}>
      <McCard variant="solid" color="gold" className="p-0">
        <div className="flex items-center gap-3 p-6 pb-4">
          <McIconBox variant="gold" size="md">
            <Gamepad2 />
          </McIconBox>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-semibold text-foreground">
              游戏配置指南
            </h3>
            <p className="text-xs text-muted-foreground">
              使用以下信息登录游戏客户端
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-6 pb-4">
          <InfoItem
            icon={Mail}
            label="登录账号"
            value={user?.email ?? '加载中…'}
          />
          <InfoItem
            icon={KeyRound}
            label="登录密码"
            value="在本平台设置的密码"
          />
        </div>

        <div className="border-t border-border/40 px-6 py-4">
          <a
            href="https://game-doc.frontleaves.com/docs/yggdrasil"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border/60 bg-background/80 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/20 hover:bg-primary/[0.04] hover:text-primary"
          >
            <BookOpen className="size-4" />
            查看登录详细文档
            <ExternalLink className="size-3 text-muted-foreground/50" />
          </a>
        </div>
      </McCard>
    </motion.div>
  )
}

function DashboardPage() {
  const navigate = useNavigate()
  const { data: userInfo } = useUserInfo()
  const { data: serverStatusData, isLoading: serverLoading } = useServerStatus()
  const { data: announcementsData, isLoading: announcementsLoading } =
    usePublicAnnouncements({
      page: 1,
      page_size: DASHBOARD_ANNOUNCEMENT_LIMIT,
    })
  const servers = serverStatusData ?? []
  const user = userInfo?.user
  const announcements = announcementsData?.list ?? []
  const { data: balanceData, isLoading: balanceLoading } = useUserEconomyBalance()

  return (
    <motion.div
      className="grid grid-cols-1 gap-8 lg:grid-cols-12"
      variants={mcStaggerGrid}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col gap-8 lg:col-span-8"
        variants={mcStaggerGridItem}
      >
        <DashboardWelcome
          username={user?.username}
          fallbackName="冒险者"
          servers={servers}
          serverLoading={serverLoading}
        />

        <section className="flex flex-col gap-4">
          <McSectionHeader title="在线玩家" icon={Users} variant="grass" />

          <div className="flex flex-col gap-4">
            {serverLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <McCard key={i} variant="glass" className="p-4">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
                  </McCard>
                ))}
              </div>
            ) : servers.length > 0 &&
              servers.some((s) => s.online && s.players.length > 0) ? (
              servers
                .filter((s) => s.online && s.players.length > 0)
                .map((server) => (
                  <div key={server.server_name}>
                    {servers.length > 1 && (
                      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                        {server.server_name}
                      </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {server.players.map((player) => (
                        <McCard
                          key={player.player_uuid}
                          variant="glass"
                          color="grass"
                          className="group overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-medium text-sm text-foreground truncate group-hover:text-mc-grass transition-colors">
                                {player.player_name}
                              </h3>
                              <span className="shrink-0 text-[11px] text-muted-foreground truncate font-mono">
                                {player.world_name}
                              </span>
                            </div>
                          </div>
                        </McCard>
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              <McCard
                variant="glass"
                className="flex items-center justify-center py-8"
              >
                <span className="text-sm text-muted-foreground/60">
                  当前无玩家在线
                </span>
              </McCard>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <McSectionHeader title="公告" icon={Megaphone} variant="diamond" />

          <div className="flex flex-col gap-3">
            {announcementsLoading ? (
              ['a', 'b'].map((k) => (
                <McCard key={k} variant="glass" className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-4 w-2/5 rounded bg-muted" />
                    <div className="h-3 w-16 rounded bg-muted" />
                  </div>
                  <div className="mt-2 h-3 w-full rounded bg-muted" />
                </McCard>
              ))
            ) : announcements.length > 0 ? (
              announcements.map((item) => (
                <Link
                  key={item.id}
                  to="/announcements/$id"
                  params={{ id: item.id }}
                  className="block transition-colors hover:opacity-90"
                >
                  <McCard variant="glass" className="px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-medium text-foreground/90">
                        {item.title}
                      </h3>
                      <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground/50">
                        {item.published_at
                          ? new Date(item.published_at).toLocaleDateString(
                              'zh-CN',
                            )
                          : ''}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground/70">
                      {item.desc ?? ''}
                    </p>
                  </McCard>
                </Link>
              ))
            ) : (
              <McCard
                variant="glass"
                className="flex items-center justify-center py-8"
              >
                <span className="text-sm text-muted-foreground/60">
                  暂无公告
                </span>
              </McCard>
            )}
          </div>
        </section>
      </motion.div>

      <motion.aside
        className="flex flex-col gap-6 lg:col-span-4"
        variants={mcStaggerGridItem}
      >
        {balanceLoading ? (
          <motion.div variants={mcStaggerGridItem}>
            <McCard variant="glass" className="p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                  <div className="h-6 w-24 rounded bg-muted animate-pulse" />
                </div>
              </div>
            </McCard>
          </motion.div>
        ) : balanceData ? (
          <motion.div variants={mcStaggerGridItem}>
            <Link to="/user/economy" className="block group">
              <McCard variant="solid" color="gold" className="p-4 transition-all group-hover:ring-2 group-hover:ring-gold-500/50">
                <div className="flex items-center gap-3">
                  <McIconBox variant="diamond" size="md">
                    <Wallet className="size-4" />
                  </McIconBox>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">账户余额</p>
                    <p className="text-xl font-bold font-mono tabular-nums truncate">
                      {balanceData.balance_display}
                    </p>
                    <p className="text-xs text-muted-foreground">{balanceData.currency}</p>
                  </div>
                </div>
              </McCard>
            </Link>
          </motion.div>
        ) : null}

        <GameConfigGuide user={user} />

        <section className="flex flex-col gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            Quick Access
          </p>
          <div className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <button
                key={link.to}
                type="button"
                onClick={() => navigate({ to: link.to as any })}
                className="group text-left transition-colors hover:opacity-90"
              >
                <McCard
                  variant="glass"
                  color={link.variant}
                  className="flex items-center gap-3 px-3.5 py-2.5"
                >
                  <McIconBox variant={link.variant} size="sm">
                    <link.icon />
                  </McIconBox>
                  <span className="flex-1 text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground">
                    {link.title}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </McCard>
              </button>
            ))}
          </div>
        </section>
      </motion.aside>
    </motion.div>
  )
}
