/**
 * 管理员端 - 游戏档案详情页
 *
 * 布局：左侧（档案信息 + 游戏统计 Tab）+ 右侧（危险操作）
 * 精简：只保留重置档案操作，皮肤/披风/配额管理归属用户管理页
 */

import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Box,
  ChevronDown,
  Clock,
  Fingerprint,
  Gamepad2,
  Pickaxe,
  RefreshCw,
  RotateCcw,
  Shirt,
  Skull,
  Sword,
  User,
  UserCircle,
} from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { cn } from '#/lib/utils'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { LoadingPage } from '#/components/public/loading-page'
import { Button } from '#/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { ConfirmDialog } from '#/components/public/confirm-dialog'
import {
  useAdminGameProfileDetail,
  useForceResetProfileMutation,
} from '#/api/endpoints/api-auth/admin-game-profile'
import { useAdminMatrixStatistics } from '#/api/endpoints/api-mc/admin-matrix-statistics'
import { useSetPageTitle } from '#/components/layout/page-title-context'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { formatTime } from '#/lib/format'

function formatPlayTime(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0 && minutes > 0) return `${hours}小时${minutes}分钟`
  if (hours > 0) return `${hours}小时`
  return `${minutes}分钟`
}

// ─── Route 定义 ────────────────────────────────────────────

export const Route = createFileRoute('/admin/game-profiles/$profileId')({
  component: GameProfileDetailPage,
})

// ─── 键值对行组件（扁平化设计） ──────────────────────────────

function KVRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-border/40 last:border-b-0">
      <span className="text-[13px] text-muted-foreground shrink-0">
        {label}
      </span>
      <span
        className={cn(
          'text-[13px] font-medium text-right truncate',
          mono && 'font-mono text-muted-foreground',
        )}
      >
        {value}
      </span>
    </div>
  )
}

// ─── 页面组件 ──────────────────────────────────────────────

function GameProfileDetailPage() {
  const { profileId } = useParams({ strict: false })
  const { data: detail, isLoading } = useAdminGameProfileDetail(profileId!)
  const setTitle = useSetPageTitle()

  const resetMutation = useForceResetProfileMutation(profileId!)

  const {
    data: matrixData,
    isLoading: matrixLoading,
    error: matrixError,
  } = useAdminMatrixStatistics(detail?.uuid ?? '')

  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [expandedDetails, setExpandedDetails] = useState<
    Record<string, boolean>
  >({})

  const toggleDetail = (key: string) => {
    setExpandedDetails((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // 页面标题同步
  useEffect(() => {
    if (detail) setTitle(detail.name)
    return () => setTitle(null)
  }, [detail, setTitle])

  // ─── 操作处理 ──────────────────────────────────────

  const handleForceReset = async () => {
    try {
      await resetMutation.mutateAsync()
      toast.success('档案已重置')
      setResetDialogOpen(false)
    } catch {
      toast.error('重置档案失败')
    }
  }

  // ─── 加载 / 错误态 ──────────────────────────────────

  if (isLoading) return <LoadingPage />
  if (!detail) {
    return (
      <div className="p-8 text-center text-muted-foreground">档案不存在</div>
    )
  }

  const { user } = detail

  // Matrix 统计卡片配置
  const statCards = matrixData
    ? [
        {
          label: '总游戏时长',
          Icon: Clock,
          value: formatPlayTime(matrixData.total_play_time_ms),
        },
        { label: '总会话数', Icon: Gamepad2, value: matrixData.total_sessions },
        {
          label: '总破坏方块',
          Icon: Pickaxe,
          value: matrixData.total_blocks_broken.toLocaleString(),
        },
        {
          label: '总放置方块',
          Icon: Box,
          value: matrixData.total_blocks_placed.toLocaleString(),
        },
        {
          label: '总死亡次数',
          Icon: Skull,
          value: matrixData.total_deaths.toLocaleString(),
        },
        {
          label: '总击杀实体',
          Icon: Sword,
          value: matrixData.total_entities_killed.toLocaleString(),
        },
      ]
    : []

  const detailSections = matrixData
    ? [
        {
          key: 'blocks_break',
          label: '方块破坏明细',
          data: matrixData.blocks_break,
          icon: Pickaxe,
        },
        {
          key: 'blocks_place',
          label: '方块放置明细',
          data: matrixData.blocks_place,
          icon: Box,
        },
        {
          key: 'deaths',
          label: '死亡原因明细',
          data: matrixData.deaths,
          icon: Skull,
        },
        {
          key: 'entities_kill',
          label: '击杀实体明细',
          data: matrixData.entities_kill,
          icon: Sword,
        },
        {
          key: 'items_used',
          label: '物品使用明细',
          data: matrixData.items_used,
          icon: Shirt,
        },
      ]
    : []

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面头部 */}
      <motion.header variants={fadeUpItem} className="flex items-center gap-4">
        <Link
          to="/admin/game-profiles"
          className="group inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-colors hover:border-mc-nether/30 hover:text-mc-nether"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">游戏档案详情</p>
          <h1 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl truncate">
            {detail.name}
          </h1>
        </div>
      </motion.header>

      {/* 主内容区：左 + 右 */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* 左侧：Tab 分区展示 */}
        <motion.div variants={fadeUpItem} className="min-w-0">
          <Tabs defaultValue="profile">
            <TabsList variant="line">
              <TabsTrigger value="profile">档案信息</TabsTrigger>
              {detail.uuid && (
                <TabsTrigger value="statistics">游戏统计</TabsTrigger>
              )}
            </TabsList>

            {/* ─── 档案信息（扁平化） ─────────────── */}
            <TabsContent value="profile" className="mt-5 space-y-4">
              <div className="rounded-xl border border-border/60 bg-card px-6 py-4">
                <div className="grid gap-x-8 sm:grid-cols-2">
                  <KVRow label="档案 ID" value={detail.id} mono />
                  <KVRow label="玩家名称" value={detail.name} />
                  <KVRow label="UUID" value={detail.uuid} mono />
                  <KVRow label="所属用户" value={user.username} />
                  <KVRow
                    label="皮肤库 ID"
                    value={detail.skin_library_id || '未设置'}
                    mono
                  />
                  <KVRow
                    label="披风库 ID"
                    value={detail.cape_library_id || '未设置'}
                    mono
                  />
                  <KVRow
                    label="更新时间"
                    value={formatTime(detail.updated_at)}
                  />
                </div>
              </div>

              {/* 关联用户 */}
              <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card px-6 py-4">
                <McIconBox variant="gold" size="md">
                  <UserCircle />
                </McIconBox>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    用户 ID: {user.id}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* ─── 游戏统计 ──────────────────────── */}
            {detail.uuid && (
              <TabsContent value="statistics" className="mt-5">
                {matrixLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : matrixError &&
                  'status' in matrixError &&
                  (matrixError as { status: number }).status === 404 ? (
                  <div className="rounded-xl border border-border/60 bg-card p-8 text-center text-muted-foreground">
                    暂无统计数据
                  </div>
                ) : matrixData ? (
                  <div className="space-y-5">
                    {/* 玩家标识 */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border/60 bg-card px-5 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-mc-grass" />
                        <span className="text-sm font-medium">
                          {matrixData.player_name}
                        </span>
                      </div>
                      <div className="hidden sm:block h-4 w-px bg-border" />
                      <div className="flex items-center gap-2">
                        <Fingerprint className="h-4 w-4 text-muted-foreground" />
                        <code className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {matrixData.player_uuid}
                        </code>
                      </div>
                    </div>

                    {/* 统计卡片 */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {statCards.map((card) => (
                        <div
                          key={card.label}
                          className="rounded-xl border border-border/60 bg-card p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <card.Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-[12px] font-medium text-muted-foreground">
                              {card.label}
                            </span>
                          </div>
                          <p className="text-xl font-bold tabular-nums tracking-tight">
                            {card.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* 详细数据（可折叠） */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-muted-foreground px-1">
                        数据明细
                      </h3>
                      {detailSections.map((section) => {
                        const entries = Object.entries(section.data)
                        const totalCount = entries.length
                        const isExpanded = expandedDetails[section.key] ?? false

                        return (
                          <div key={section.key}>
                            <button
                              type="button"
                              onClick={() => toggleDetail(section.key)}
                              className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/40 px-4 py-3 transition-colors hover:bg-background/60 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <section.icon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-[13px] font-medium">
                                  {section.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[12px] text-muted-foreground">
                                  {totalCount} 项
                                </span>
                                <ChevronDown
                                  className={cn(
                                    'h-4 w-4 text-muted-foreground transition-transform duration-200',
                                    isExpanded && 'rotate-180',
                                  )}
                                />
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {totalCount === 0 ? (
                                  <div className="col-span-full py-4 text-center text-[13px] text-muted-foreground">
                                    暂无数据
                                  </div>
                                ) : (
                                  entries
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([rawKey, value]) => {
                                      const displayKey = rawKey.replace(
                                        /^minecraft:/,
                                        '',
                                      )
                                      return (
                                        <div
                                          key={rawKey}
                                          className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2"
                                        >
                                          <span className="text-[12px] font-mono text-muted-foreground">
                                            {displayKey}
                                          </span>
                                          <span className="text-[12px] font-bold tabular-nums">
                                            {value.toLocaleString()}
                                          </span>
                                        </div>
                                      )
                                    })
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </TabsContent>
            )}
          </Tabs>
        </motion.div>

        {/* 右侧：危险操作 */}
        <motion.aside
          variants={fadeUpItem}
          className="lg:sticky lg:top-6 lg:self-start"
        >
          <div className="rounded-xl border border-destructive/20 bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-destructive" />
              <span className="text-sm font-semibold">危险操作</span>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              重置档案将清除该档案的所有数据（皮肤、披风等），此操作不可撤销。
            </p>
            <Button
              className="w-full cursor-pointer"
              variant="destructive"
              size="sm"
              onClick={() => setResetDialogOpen(true)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              重置档案
            </Button>
          </div>
        </motion.aside>
      </div>

      {/* 重置确认对话框 */}
      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="重置游戏档案"
        description="此操作将重置该游戏档案的所有数据（皮肤、披风等），此操作不可撤销。"
        confirmLabel="确认重置"
        variant="destructive"
        onConfirm={handleForceReset}
        loading={resetMutation.isPending}
      />
    </motion.div>
  )
}
