/**
 * 管理端 - Matrix 玩家统计查询页
 * 通过 UUID 查询玩家游戏统计数据
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Search,
  Clock,
  Gamepad2,
  Pickaxe,
  Box,
  Skull,
  Sword,
  User,
  Fingerprint,
} from 'lucide-react'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { McCard } from '#/components/shared/mc-card'
import { LoadingPage } from '#/components/public/loading-page'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { useAdminMatrixStatistics } from '#/api/endpoints/api-mc/admin-matrix-statistics'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'

// ─── 常量 ──────────────────────────────────────────────────

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// ─── 工具函数 ───────────────────────────────────────────────

/** 将毫秒格式化为可读时间字符串 */
function formatPlayTime(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0 && minutes > 0) return `${hours}小时${minutes}分钟`
  if (hours > 0) return `${hours}小时`
  return `${minutes}分钟`
}

// ─── 统计卡片配置 ──────────────────────────────────────────

interface StatCardConfig {
  label: string
  Icon: typeof Clock
  getValue: (data: MatrixStatisticData) => string | number
  color: 'grass' | 'diamond' | 'nether' | 'gold'
}

type MatrixStatisticData = NonNullable<
  ReturnType<typeof useAdminMatrixStatistics>['data']
>

const statCards: StatCardConfig[] = [
  {
    label: '总游戏时长',
    Icon: Clock,
    getValue: (d) => formatPlayTime(d.total_play_time_ms),
    color: 'grass',
  },
  {
    label: '总会话数',
    Icon: Gamepad2,
    getValue: (d) => d.total_sessions,
    color: 'diamond',
  },
  {
    label: '总破坏方块',
    Icon: Pickaxe,
    getValue: (d) => d.total_blocks_broken.toLocaleString(),
    color: 'nether',
  },
  {
    label: '总放置方块',
    Icon: Box,
    getValue: (d) => d.total_blocks_placed.toLocaleString(),
    color: 'gold',
  },
  {
    label: '总死亡次数',
    Icon: Skull,
    getValue: (d) => d.total_deaths.toLocaleString(),
    color: 'nether',
  },
  {
    label: '总击杀实体',
    Icon: Sword,
    getValue: (d) => d.total_entities_killed.toLocaleString(),
    color: 'grass',
  },
]

// ─── Route 定义 ────────────────────────────────────────────

export const Route = createFileRoute('/admin/matrix/statistics/')({
  component: AdminMatrixStatisticsPage,
})

// ─── 页面组件 ──────────────────────────────────────────────

function AdminMatrixStatisticsPage() {
  const [uuidInput, setUuidInput] = useState('')
  const [queryUuid, setQueryUuid] = useState('')

  const isUuidValid = UUID_REGEX.test(uuidInput)

  const handleSearch = () => {
    if (isUuidValid) {
      setQueryUuid(uuidInput)
    }
  }

  const { data, isLoading, error } = useAdminMatrixStatistics(queryUuid)

  const isNotFound =
    error && 'status' in error && (error as { status: number }).status === 404

  // 首次加载骨架屏
  if (isLoading && !data) return <LoadingPage />

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面标题 */}
      <motion.div variants={fadeUpItem}>
        <McSectionHeader
          title="玩家统计查询"
          description="输入玩家 UUID 查询其游戏统计数据"
          icon={Search}
        />
      </motion.div>

      {/* UUID 输入区域 */}
      <motion.div variants={fadeUpItem}>
        <McCard variant="solid" color="default">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 p-5">
            <div className="relative flex-1">
              <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="输入玩家 UUID（如：550e8400-e29b-41d4-a716-446655440000）"
                className="pl-9 h-10 font-mono text-sm"
                value={uuidInput}
                onChange={(e) => setUuidInput(e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch()
                }}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!isUuidValid}
              className="h-10 px-5 shrink-0"
            >
              <Search className="mr-2 h-4 w-4" />
              查询统计
            </Button>
          </div>
        </McCard>
      </motion.div>

      {/* 错误状态：404 无数据 */}
      {isNotFound && (
        <motion.div variants={fadeUpItem}>
          <McCard variant="glass" color="default">
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <Skull className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-base font-medium text-muted-foreground">
                该玩家暂无统计数据
              </p>
              <p className="text-sm text-muted-foreground/70">
                请确认 UUID 是否正确，或该玩家尚未进入服务器
              </p>
            </div>
          </McCard>
        </motion.div>
      )}

      {/* 统计数据展示区域 */}
      {data && !isNotFound && (
        <>
          {/* 玩家基本信息卡片 */}
          <motion.div variants={fadeUpItem}>
            <McCard variant="solid" color="diamond" className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-mc-diamond" />
                  <span className="text-sm font-medium text-muted-foreground">
                    玩家名称
                  </span>
                </div>
                <span className="text-lg font-bold">{data.player_name}</span>

                <div className="hidden sm:block h-6 w-px bg-border" />

                <div className="flex items-center gap-3">
                  <Fingerprint className="h-5 w-5 text-mc-diamond" />
                  <span className="text-sm font-medium text-muted-foreground">
                    玩家 UUID
                  </span>
                </div>
                <code className="font-mono text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {data.player_uuid}
                </code>
              </div>
            </McCard>
          </motion.div>

          {/* 游戏数据卡片组 */}
          <motion.div
            variants={fadeUpItem}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {statCards.map((card) => (
              <McCard key={card.label} variant="glass" color={card.color}>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <card.Icon className="h-4.5 w-4.5 text-muted-foreground" />
                    <span className="text-[13px] font-medium text-muted-foreground">
                      {card.label}
                    </span>
                  </div>
                  <p className="text-2xl font-bold tabular-nums tracking-tight">
                    {card.getValue(data)}
                  </p>
                </div>
              </McCard>
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
