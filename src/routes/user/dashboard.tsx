/**
 * 用户端仪表盘 - 玩家控制中心
 *
 * 布局：12 列网格 (左 8 右 4)
 *   - 左侧：欢迎区 + 服务器状态（留白区域）
 *   - 右侧：快捷引导 + 游戏配置指南
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
} from 'lucide-react'
import { motion } from 'motion/react'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import { usePublicAnnouncements } from '#/api/endpoints/api-mc/public-announcement'
import { useServerStatus } from '#/api/endpoints/api-mc/server-status'
import { DashboardWelcome } from '#/components/dashboard/dashboard-welcome'
import { fadeUpItem, staggerContainer } from '#/lib/motion-presets'

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
    iconBg: 'bg-[oklch(0.55_0.12_223)]/[0.1]',
    iconColor: 'text-[oklch(0.45_0.14_223)]',
  },
  {
    title: '披风库',
    icon: Flag,
    to: '/user/capes',
    iconBg: 'bg-[oklch(0.6_0.16_250)]/[0.1]',
    iconColor: 'text-[oklch(0.48_0.18_250)]',
  },
  {
    title: '游戏档案',
    icon: Gamepad2,
    to: '/user/profiles',
    iconBg: 'bg-[oklch(0.6_0.13_160)]/[0.1]',
    iconColor: 'text-[oklch(0.48_0.15_160)]',
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
    <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/70 p-3.5 backdrop-blur-[4px]">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.06]">
        <Icon className="size-4 text-primary/80" />
      </div>
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
    <motion.div
      variants={fadeUpItem}
      className="relative overflow-hidden rounded-[1.125rem] border border-border/60 bg-card/95 shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)] backdrop-blur-[10px]"
    >
      <div className="pointer-events-none absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />

      <div className="flex items-center gap-2.5 p-6 pb-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/[0.03] shadow-[0_0_12px_-3px_oklch(0.52_0.105_223.128_/_0.12)]">
          <Gamepad2 className="size-[18px] text-primary" />
        </div>
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
        <InfoItem icon={KeyRound} label="登录密码" value="在本平台设置的密码" />
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

  return (
    <motion.div
      className="grid grid-cols-1 gap-8 lg:grid-cols-12"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="flex flex-col gap-8 lg:col-span-8"
        variants={fadeUpItem}
      >
        <DashboardWelcome
          username={user?.username}
          fallbackName="冒险者"
          servers={servers}
          serverLoading={serverLoading}
        />

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/[0.08]">
              <Users className="size-3.5 text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">在线玩家</h2>
          </div>

          <div className="flex flex-col gap-3">
            {serverLoading ? (
              ['a', 'b'].map((k) => (
                <div
                  key={k}
                  className="animate-pulse rounded-xl border border-border/60 bg-card/90 px-4 py-3"
                >
                  <div className="h-4 w-1/3 rounded bg-muted" />
                </div>
              ))
            ) : servers.length > 0 && servers.some((s) => s.online && s.players.length > 0) ? (
              servers
                .filter((s) => s.online && s.players.length > 0)
                .map((server) => (
                  <div key={server.server_name}>
                    {servers.length > 1 && (
                      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                        {server.server_name}
                      </p>
                    )}
                    <div className="rounded-xl border border-border/60 bg-card/90 px-4 py-3 backdrop-blur-[10px]">
                      <div className="flex flex-wrap items-center gap-2">
                        {server.players.map((player) => (
                          <span
                            key={player.player_uuid}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/60 px-2.5 py-0.5 text-[13px] font-medium text-foreground/80"
                          >
                            {player.player_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 py-8 text-center text-sm text-muted-foreground/60">
                当前无玩家在线
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/[0.08]">
              <Megaphone className="size-3.5 text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">公告</h2>
          </div>

          <div className="flex flex-col gap-3">
            {announcementsLoading ? (
              ['a', 'b'].map((k) => (
                <div
                  key={k}
                  className="animate-pulse rounded-xl border border-border/60 bg-card/90 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-4 w-2/5 rounded bg-muted" />
                    <div className="h-3 w-16 rounded bg-muted" />
                  </div>
                  <div className="mt-2 h-3 w-full rounded bg-muted" />
                </div>
              ))
            ) : announcements.length > 0 ? (
              announcements.map((item) => (
                <Link
                  key={item.id}
                  to="/announcements/$id"
                  params={{ id: item.id }}
                  className="rounded-xl border border-border/60 bg-card/90 backdrop-blur-[10px] px-4 py-3 transition-colors hover:border-primary/20"
                >
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
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 py-8 text-center text-sm text-muted-foreground/60">
                暂无公告
              </div>
            )}
          </div>
        </section>
      </motion.div>

      <motion.aside
        className="flex flex-col gap-6 lg:col-span-4"
        variants={fadeUpItem}
      >
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
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/90 backdrop-blur-[10px] px-3.5 py-2.5 text-left transition-all hover:border-primary/20 hover:bg-primary/[0.03]"
              >
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${link.iconBg}`}
                >
                  <link.icon className={`size-3.5 ${link.iconColor}`} />
                </div>
                <span className="text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground">
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
                  strokejoin="round"
                  className="ml-auto shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </section>
      </motion.aside>
    </motion.div>
  )
}
