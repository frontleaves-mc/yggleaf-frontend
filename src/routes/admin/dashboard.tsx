/**
 * Dashboard 仪表盘
 * 管理后台首页 — MC 风格点缀的专业数据面板
 * 配色：nether(红) + gold(黄) 作为 MC 点缀色，保持专业感
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Flag,
  Gamepad2,
  Palette,
  RefreshCw,
  Shield,
  Shirt,
  Users,
  Activity,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useCapes } from '#/api/endpoints/api-auth/cape-library'
import { useSkins } from '#/api/endpoints/api-auth/skin-library'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import {
  useRefreshServerStatusMutation,
  useServerStatus,
} from '#/api/endpoints/api-mc/server-status'
import { DashboardWelcome } from '#/components/dashboard/dashboard-welcome'
import { LoadingPage } from '#/components/public/loading-page'
import { fadeUpItem, staggerContainer } from '#/lib/motion-presets'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { McBadge } from '#/components/shared/mc-badge'

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const navigate = useNavigate()
  const { data: userInfo, isLoading: userLoading } = useUserInfo()
  const user = userInfo?.user
  const { data: skins, isLoading: skinsLoading } = useSkins()
  const { data: capes, isLoading: capesLoading } = useCapes()
  const { data: serverStatusData, isLoading: serverLoading } = useServerStatus()
  const servers = serverStatusData ?? []
  const refreshMutation = useRefreshServerStatusMutation()

  if (userLoading) return <LoadingPage />

  const skinCount = skins?.items?.length ?? 0
  const capeCount = capes?.items?.length ?? 0

  const refreshButton = servers.length > 0 ? (
    <button
      type="button"
      onClick={() => {
        servers.forEach((s) => {
          refreshMutation.mutate({ name: s.server_name })
        })
      }}
      disabled={refreshMutation.isPending}
      className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border/50 bg-transparent px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground/60 transition-all hover:border-mc-nether/30 hover:text-mc-nether disabled:opacity-50 disabled:pointer-events-none"
    >
      <RefreshCw
        className={`size-3 ${refreshMutation.isPending ? 'animate-spin' : ''}`}
      />
      刷新全部
    </button>
  ) : null

  const inlineStats = (
    <div className="flex items-baseline gap-5 pt-1">
      <span className="flex items-baseline gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/35">
          SKINS
        </span>
        <span className="text-[13px] font-semibold tabular-nums text-foreground/80">
          {skinsLoading ? '...' : skinCount}
        </span>
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/35">
          CAPES
        </span>
        <span className="text-[13px] font-semibold tabular-nums text-foreground/80">
          {capesLoading ? '...' : capeCount}
        </span>
      </span>
    </div>
  )

  const statCards = [
    {
      title: '皮肤库',
      value: skinsLoading ? '...' : String(skinCount),
      subtitle: '总资源数',
      icon: Shirt,
      accent: 'nether' as const,
      locked: false,
    },
    {
      title: '披风库',
      value: capesLoading ? '...' : String(capeCount),
      subtitle: '总资源数',
      icon: Flag,
      accent: 'gold' as const,
      locked: false,
    },
    {
      title: '游戏档案',
      value: '--',
      subtitle: '活跃档案',
      icon: Gamepad2,
      accent: 'nether' as const,
      locked: true,
    },
    {
      title: '用户总数',
      value: '--',
      subtitle: '已注册用户',
      icon: Users,
      accent: 'gold' as const,
      locked: true,
    },
  ]

  const quickActions = [
    {
      title: '皮肤库管理',
      description: '浏览、上传、编辑皮肤资源',
      icon: Palette,
      to: '/admin/skins/',
      accent: 'nether' as const,
    },
    {
      title: '披风库管理',
      description: '浏览、上传、编辑披风资源',
      icon: Shield,
      to: '/admin/capes/',
      accent: 'gold' as const,
    },
  ]

  return (
    <motion.div
      className="flex flex-col gap-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <DashboardWelcome
          username={user?.username}
          fallbackName="管理员"
          servers={servers}
          serverLoading={serverLoading}
          showTps
          actions={refreshButton}
          inlineStats={inlineStats}
        />
      </motion.div>

      <motion.section variants={fadeUpItem} className="flex flex-col gap-4">
        <McSectionHeader
          label="Online Players"
          title="在线玩家"
          icon={Activity}
          variant="nether"
        />
        <div className="flex flex-col gap-3">
          {serverLoading ? (
            ['a', 'b'].map((k) => (
              <McCard key={k} variant="glass" className="p-4">
                <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
              </McCard>
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
                  <McCard variant="glass" className="px-4 py-3">
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
                  </McCard>
                </div>
              ))
          ) : (
            <McCard variant="glass" className="border-dashed py-8 text-center">
              <p className="text-sm text-muted-foreground/60">当前无玩家在线</p>
            </McCard>
          )}
        </div>
      </motion.section>

      <motion.section variants={fadeUpItem} className="flex flex-col gap-4">
        <McSectionHeader
          label="Overview"
          title="系统概览"
          icon={Activity}
          variant="gold"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <McCard
              key={card.title}
              variant="glass"
              color={card.accent}
              className={`p-5 sm:p-6 ${card.locked ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {card.title}
                  </p>
                  <p
                    className={`text-2xl font-bold tracking-tight tabular-nums ${card.value === '...' ? 'opacity-50' : ''}`}
                  >
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </div>
                <McIconBox variant={card.accent} size="md">
                  <card.icon />
                </McIconBox>
              </div>
            </McCard>
          ))}
        </div>
      </motion.section>

      <motion.section variants={fadeUpItem} className="flex flex-col gap-4">
        <McSectionHeader
          label="Operations"
          title="快捷操作"
          variant="nether"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <McCard
              key={action.to}
              variant="solid"
              color={action.accent}
              className="group cursor-pointer p-5 transition-all hover:shadow-md"
              onClick={() => navigate({ to: action.to as any })}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <McIconBox variant={action.accent} size="md">
                    <action.icon />
                  </McIconBox>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-mc-nether"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-foreground/90">
                    {action.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground/75">
                    {action.description}
                  </p>
                </div>
              </div>
            </McCard>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
