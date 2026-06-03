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
import { McActionTile } from '#/components/shared/mc-action-tile'
import { McStatCard } from '#/components/shared/mc-stat-card'

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

  const refreshButton =
    servers.length > 0 ? (
      <button
        type="button"
        onClick={() => {
          servers.forEach((s) => {
            refreshMutation.mutate({ name: s.server_name })
          })
        }}
        disabled={refreshMutation.isPending}
        className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-none border border-border/50 bg-transparent px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground/60 transition-all hover:border-mc-nether/30 hover:text-mc-nether disabled:opacity-50 disabled:pointer-events-none"
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
        <div className="flex flex-col gap-4">
          {serverLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <McCard key={i} variant="glass" className="p-4">
                  <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-muted animate-pulse" />
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {server.players.map((player) => (
                      <McCard
                        key={player.player_uuid}
                        variant="glass"
                        color="nether"
                        className="group overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-medium text-sm text-foreground truncate group-hover:text-mc-nether transition-colors">
                              {player.player_name}
                            </h3>
                            <span className="shrink-0 text-[11px] text-muted-foreground truncate font-mono">
                              {player.world_name}
                            </span>
                          </div>
                          <code className="mt-2 block text-[10px] text-muted-foreground/40 font-mono">
                            {player.player_uuid.slice(0, 8)}
                          </code>
                        </div>
                      </McCard>
                    ))}
                  </div>
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
            <McStatCard
              key={card.title}
              title={card.title}
              value={card.value}
              description={card.subtitle}
              icon={card.icon}
              variant={card.accent}
              className={card.locked ? 'opacity-50' : ''}
            />
          ))}
        </div>
      </motion.section>

      <motion.section variants={fadeUpItem} className="flex flex-col gap-4">
        <McSectionHeader label="Operations" title="快捷操作" variant="nether" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <McActionTile
              key={action.to}
              title={action.title}
              description={action.description}
              icon={action.icon}
              variant={action.accent}
              onClick={() => navigate({ to: action.to as any })}
            />
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
