/**
 * 玩家端 Matrix 统计页面 - 我的游戏统计
 *
 * 使用 SubTab 导航分区展示：
 *   - 概览：基本信息 + 6 个核心数据卡片
 *   - 方块：方块破坏/放置明细
 *   - 战斗：死亡原因/击杀实体明细
 *   - 物品：物品使用明细
 */

import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Clock,
  Gamepad2,
  Pickaxe,
  Shirt,
  Skull,
  Sword,
  Target,
  Timer,
} from 'lucide-react'
import { motion } from 'motion/react'
import { usePlayerMatrixStatistics } from '#/api/endpoints/api-mc/player-matrix-statistics'
import { LoadingPage } from '#/components/public/loading-page'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { mcStaggerGrid, mcStaggerGridItem } from '#/lib/motion-presets'

export const Route = createFileRoute('/user/matrix-statistics/')({
  component: MatrixStatisticsPage,
})

// ─── 时间格式化 ──────────────────────────────────────────────

/** 将毫秒数格式化为可读时长，如 "12小时30分钟" */
function formatPlayTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0 && minutes > 0) {
    return `${hours}小时${minutes}分钟`
  }
  if (hours > 0) {
    return `${hours}小时`
  }
  if (minutes > 0) {
    return `${minutes}分钟`
  }
  return '不到1分钟'
}

function cleanMinecraftId(id: string): string {
  return id.replace(/^minecraft:/, '')
}

// ─── 统计卡片 ────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  variant: 'grass' | 'diamond' | 'nether' | 'gold'
}

function StatCard({ icon: Icon, label, value, variant }: StatCardProps) {
  return (
    <motion.div variants={mcStaggerGridItem}>
      <McCard variant="glass" color={variant} className="p-5">
        <div className="flex items-center gap-3.5">
          <McIconBox variant={variant} size="md">
            <Icon />
          </McIconBox>
          <div className="min-w-0 flex flex-col gap-0.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
              {label}
            </span>
            <span className="truncate text-lg font-bold tabular-nums text-foreground">
              {value}
            </span>
          </div>
        </div>
      </McCard>
    </motion.div>
  )
}

// ─── 详细数据明细组件 ────────────────────────────────────────

interface DetailSectionProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  data: Record<string, number>
  variant: 'grass' | 'diamond' | 'nether' | 'gold'
}

function DetailSection({
  title,
  icon: Icon,
  data,
  variant,
}: DetailSectionProps) {
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a)

  return (
    <motion.div variants={mcStaggerGridItem}>
      <McCard variant="glass" color={variant} className="p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-[13px] font-medium text-muted-foreground">
              {title}
            </span>
            <span className="ml-auto text-[11px] text-muted-foreground/60">
              {entries.length} 种
            </span>
          </div>
          {entries.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {entries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-none border border-border/60 bg-background/40 px-3 py-2"
                >
                  <span className="text-[12px] font-mono text-muted-foreground truncate mr-2">
                    {cleanMinecraftId(key)}
                  </span>
                  <span className="text-[12px] font-bold tabular-nums shrink-0">
                    {value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-muted-foreground py-2">暂无数据</p>
          )}
        </div>
      </McCard>
    </motion.div>
  )
}

// ─── 页面组件 ────────────────────────────────────────────────

function MatrixStatisticsPage() {
  const { data, isLoading } = usePlayerMatrixStatistics()

  // 加载中
  if (isLoading) {
    return <LoadingPage />
  }

  // 无数据（404 或未进入过服务器）
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <McIconBox variant="diamond" size="lg">
          <Gamepad2 />
        </McIconBox>
        <p className="text-sm text-muted-foreground/70">
          暂无游戏统计数据，请先进入服务器
        </p>
      </div>
    )
  }

  const statCards: StatCardProps[] = [
    {
      icon: Clock,
      label: '总游玩时间',
      value: formatPlayTime(data.total_play_time_ms),
      variant: 'grass',
    },
    {
      icon: Timer,
      label: '总会话数',
      value: data.total_sessions,
      variant: 'diamond',
    },
    {
      icon: Pickaxe,
      label: '总方块破坏',
      value: data.total_blocks_broken.toLocaleString('zh-CN'),
      variant: 'nether',
    },
    {
      icon: Target,
      label: '总方块放置',
      value: data.total_blocks_placed.toLocaleString('zh-CN'),
      variant: 'gold',
    },
    {
      icon: Skull,
      label: '总死亡数',
      value: data.total_deaths,
      variant: 'nether',
    },
    {
      icon: Sword,
      label: '总击杀数',
      value: data.total_entities_killed,
      variant: 'grass',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* 页面标题 */}
      <McSectionHeader title="我的游戏统计" icon={Gamepad2} variant="diamond" />

      {/* SubTab 导航 */}
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="blocks">方块</TabsTrigger>
          <TabsTrigger value="combat">战斗</TabsTrigger>
          <TabsTrigger value="items">物品</TabsTrigger>
        </TabsList>

        {/* ─── 概览 ──────────────────────────────── */}
        <TabsContent value="overview" className="mt-6">
          <motion.div
            className="flex flex-col gap-6"
            variants={mcStaggerGrid}
            initial="hidden"
            animate="visible"
          >
            {/* 基本信息区 */}
            <motion.div variants={mcStaggerGridItem}>
              <McCard variant="solid" color="diamond" className="p-6">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-start gap-3">
                    <McIconBox variant="diamond" size="sm">
                      <Gamepad2 />
                    </McIconBox>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                        玩家名称
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {data.player_name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <McIconBox variant="gold" size="sm">
                      <Clock />
                    </McIconBox>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                        当前会话开始时间
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {data.current_session_start
                          ? new Date(data.current_session_start).toLocaleString(
                              'zh-CN',
                              {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )
                          : '未在游戏中'}
                      </span>
                    </div>
                  </div>
                </div>
              </McCard>
            </motion.div>

            {/* 统计数据卡片组 */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {statCards.map((card) => (
                <StatCard key={card.label} {...card} />
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* ─── 方块统计 ──────────────────────────── */}
        <TabsContent value="blocks" className="mt-6">
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            variants={mcStaggerGrid}
            initial="hidden"
            animate="visible"
          >
            <DetailSection
              title="方块破坏明细"
              icon={Pickaxe}
              data={data.blocks_break}
              variant="nether"
            />
            <DetailSection
              title="方块放置明细"
              icon={Box}
              data={data.blocks_place}
              variant="gold"
            />
          </motion.div>
        </TabsContent>

        {/* ─── 战斗统计 ──────────────────────────── */}
        <TabsContent value="combat" className="mt-6">
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            variants={mcStaggerGrid}
            initial="hidden"
            animate="visible"
          >
            <DetailSection
              title="死亡原因明细"
              icon={Skull}
              data={data.deaths}
              variant="nether"
            />
            <DetailSection
              title="击杀实体明细"
              icon={Sword}
              data={data.entities_kill}
              variant="grass"
            />
          </motion.div>
        </TabsContent>

        {/* ─── 物品统计 ──────────────────────────── */}
        <TabsContent value="items" className="mt-6">
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            variants={mcStaggerGrid}
            initial="hidden"
            animate="visible"
          >
            <DetailSection
              title="物品使用明细"
              icon={Shirt}
              data={data.items_used}
              variant="diamond"
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
