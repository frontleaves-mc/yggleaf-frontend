/**
 * 超管 — 服务器负载监控页面
 * 展示所有服务器的实时负载数据 + 历史趋势图表
 */

import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick,
  RefreshCw,
  Server,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useServerLoadRealtime, useServerLoadHistory } from '#/api/endpoints/api-mc/server-load'
import { TpsTrendChart } from '#/components/admin/server-load/tps-trend-chart'
import { ResourceTrendChart, formatBytes } from '#/components/admin/server-load/resource-trend-chart'
import { LoadingPage } from '#/components/public/loading-page'
import { PageHeader } from '#/components/public/page-header'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { fadeUpItem, staggerContainer } from '#/lib/motion-presets'
import type { ServerRealtimeLoad } from '#/api/types'

export const Route = createFileRoute('/admin/server-load/')({
  component: ServerLoadPage,
})

function formatUptime(lastHeartbeat: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - lastHeartbeat
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  return `${Math.floor(diff / 86400)}天前`
}

function tpsColor(tps: number): string {
  if (tps >= 19) return 'text-emerald-500'
  if (tps >= 15) return 'text-amber-500'
  return 'text-red-500'
}

function usageBarColor(pct: number): string {
  if (pct < 50) return 'bg-emerald-500'
  if (pct < 80) return 'bg-amber-500'
  return 'bg-red-500'
}

function usageTextColor(pct: number): string {
  if (pct < 50) return 'text-emerald-500'
  if (pct < 80) return 'text-amber-500'
  return 'text-red-500'
}

function MetricBar({
  label,
  icon: Icon,
  percent,
  detail,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  percent: number
  detail: string
}) {
  const pct = Math.min(100, Math.max(0, percent))
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="size-3.5 text-muted-foreground/50" />
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold tabular-nums ${usageTextColor(pct)}`}>
            {pct.toFixed(1)}%
          </span>
          <span className="text-[10px] text-muted-foreground/50 font-mono">
            {detail}
          </span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${usageBarColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function ServerCard({ server }: { server: ServerRealtimeLoad }) {
  const memInfo = server.memory_info ?? { total_bytes: 0, used_bytes: 0, free_bytes: 0 }
  const jvmInfo = server.jvm_info ?? { max_memory_bytes: 0, used_memory_bytes: 0 }
  const cpuInfo = server.cpu_info ?? { cores: 0, usage_percent: 0 }

  const memUsagePercent =
    memInfo.total_bytes > 0
      ? (memInfo.used_bytes / memInfo.total_bytes) * 100
      : 0

  const jvmUsagePercent =
    jvmInfo.max_memory_bytes > 0
      ? (jvmInfo.used_memory_bytes / jvmInfo.max_memory_bytes) * 100
      : 0

  return (
    <McCard
      variant="solid"
      color={server.online ? 'nether' : 'default'}
      className="p-5"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <McIconBox variant={server.online ? 'nether' : 'gold'} size="sm">
            <Server className="size-3.5" />
          </McIconBox>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {server.display_name || server.server_name}
            </h3>
            <p className="text-[10px] font-mono text-muted-foreground/50">
              ID: {server.server_id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-block size-2 rounded-full ${server.online ? 'bg-emerald-500' : 'bg-zinc-500'}`}
          />
          <span className="text-xs text-muted-foreground">
            {server.online ? '在线' : '离线'}
          </span>
        </div>
      </div>

      {!server.online ? (
        <div className="flex items-center gap-1.5 py-6 text-center justify-center">
          <Clock className="size-3.5 text-muted-foreground/40" />
          <span className="text-xs text-muted-foreground/60">
            最后心跳: {formatUptime(server.last_heartbeat)}
          </span>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground/50" />
              <span className="text-sm font-medium text-muted-foreground">TPS</span>
            </div>
            <span className={`text-2xl font-bold tabular-nums ${tpsColor(server.tps)}`}>
              {server.tps.toFixed(1)}
            </span>
          </div>

          <div className="space-y-3">
            <MetricBar
              label="CPU"
              icon={Cpu}
              percent={cpuInfo.usage_percent}
              detail={`${cpuInfo.cores} 核心`}
            />
            <MetricBar
              label="内存"
              icon={MemoryStick}
              percent={memUsagePercent}
              detail={`${formatBytes(memInfo.used_bytes)} / ${formatBytes(memInfo.total_bytes)}`}
            />
            <MetricBar
              label="JVM"
              icon={HardDrive}
              percent={jvmUsagePercent}
              detail={`${formatBytes(jvmInfo.used_memory_bytes)} / ${formatBytes(jvmInfo.max_memory_bytes)}`}
            />
          </div>

          <div className="flex items-center gap-1.5 pt-2 border-t border-border/40">
            <Clock className="size-3 text-muted-foreground/40" />
            <span className="text-[11px] text-muted-foreground/50">
              心跳: {formatUptime(server.last_heartbeat)}
            </span>
          </div>
        </div>
      )}
    </McCard>
  )
}

function ServerLoadPage() {
  const { data: servers, isLoading, refetch, isFetching } = useServerLoadRealtime()
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null)

  const onlineServers = useMemo(
    () => (servers ?? []).filter((s) => s.online),
    [servers],
  )

  const offlineServers = useMemo(
    () => (servers ?? []).filter((s) => !s.online),
    [servers],
  )

  const activeServerId = useMemo(() => {
    if (selectedServerId) return selectedServerId
    if (onlineServers.length > 0) return String(onlineServers[0].server_id)
    return null
  }, [selectedServerId, onlineServers])

  const summary = useMemo(() => {
    if (!onlineServers.length) return null
    const avgTps =
      onlineServers.reduce((acc, s) => acc + s.tps, 0) / onlineServers.length
    const avgCpu =
      onlineServers.reduce((acc, s) => acc + s.cpu_info.usage_percent, 0) /
      onlineServers.length
    const totalMem = onlineServers.reduce(
      (acc, s) => acc + s.memory_info.total_bytes,
      0,
    )
    const usedMem = onlineServers.reduce(
      (acc, s) => acc + s.memory_info.used_bytes,
      0,
    )
    const totalJvm = onlineServers.reduce(
      (acc, s) => acc + s.jvm_info.max_memory_bytes,
      0,
    )
    const usedJvm = onlineServers.reduce(
      (acc, s) => acc + s.jvm_info.used_memory_bytes,
      0,
    )
    return {
      avgTps,
      avgCpu,
      totalMem,
      usedMem,
      totalJvm,
      usedJvm,
    }
  }, [onlineServers])

  if (isLoading) return <LoadingPage />

  return (
    <motion.div
      className="flex flex-col gap-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <PageHeader
          title="服务器负载"
          description="实时监控所有服务器的运行状态与资源使用情况"
          actions={
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1.5 rounded-md border border-border/50 bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground/60 transition-all hover:border-mc-nether/30 hover:text-mc-nether disabled:opacity-50 disabled:pointer-events-none"
            >
              <RefreshCw
                className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`}
              />
              刷新
            </button>
          }
        />
      </motion.div>

      <motion.section variants={fadeUpItem} className="flex flex-col gap-4">
        <McSectionHeader
          label="Realtime"
          title="实时负载"
          icon={Cpu}
          variant="gold"
        />
        {(servers ?? []).length === 0 ? (
          <McCard variant="glass" className="border-dashed py-8 text-center">
            <p className="text-sm text-muted-foreground/60">
              暂无服务器数据
            </p>
          </McCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {onlineServers.map((server) => (
              <ServerCard key={server.server_id} server={server} />
            ))}
            {offlineServers.map((server) => (
              <ServerCard key={server.server_id} server={server} />
            ))}
          </div>
        )}
      </motion.section>

      {(servers ?? []).length > 0 && (
        <motion.section variants={fadeUpItem} className="flex flex-col gap-4">
          <McSectionHeader
            label="History"
            title="历史趋势"
            icon={HardDrive}
            variant="nether"
          />
          <div className="flex flex-wrap items-center gap-2">
            {(servers ?? []).map((s) => (
              <button
                key={s.server_id}
                type="button"
                onClick={() => setSelectedServerId(String(s.server_id))}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  activeServerId === String(s.server_id)
                    ? 'bg-mc-nether/20 text-mc-nether border border-mc-nether/30'
                    : 'bg-card text-muted-foreground/60 border border-border/50 hover:border-mc-nether/20 hover:text-mc-nether'
                }`}
              >
                {s.display_name || s.server_name}
                {!s.online && (
                  <span className="ml-1 text-muted-foreground/40">(离线)</span>
                )}
              </button>
            ))}
          </div>
          {activeServerId ? (
            <HistoryCharts serverId={activeServerId} />
          ) : (
            <McCard variant="glass" className="border-dashed py-8 text-center">
              <p className="text-sm text-muted-foreground/60">
                暂无可用服务器
              </p>
            </McCard>
          )}
        </motion.section>
      )}
    </motion.div>
  )
}

function HistoryCharts({ serverId }: { serverId: string }) {
  const timeRange = useMemo(() => {
    const now = new Date()
    now.setSeconds(0, 0)
    const end = now.toISOString()
    const start = new Date(now.getTime() - 60 * 60 * 1000).toISOString()
    return { start, end }
  }, [])

  const { data: historyData, isLoading } = useServerLoadHistory(
    serverId,
    timeRange,
    { refetchInterval: 30_000 },
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-[360px] rounded-xl bg-muted/20 animate-pulse" />
        <div className="h-[360px] rounded-xl bg-muted/20 animate-pulse" />
      </div>
    )
  }

  if (!historyData || historyData.records.length === 0) {
    return (
      <McCard variant="glass" className="border-dashed py-8 text-center">
        <p className="text-sm text-muted-foreground/60">
          近 1 小时无历史数据
        </p>
      </McCard>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <McCard variant="glass" className="p-5">
        <TpsTrendChart records={historyData.records} height={360} />
      </McCard>
      <McCard variant="glass" className="p-5">
        <ResourceTrendChart records={historyData.records} height={360} />
      </McCard>
    </div>
  )
}
