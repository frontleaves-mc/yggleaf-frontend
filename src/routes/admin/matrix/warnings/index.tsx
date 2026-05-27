/**
 * 管理端 - Matrix 警告列表页
 * MC 风格：nether + gold 配色
 * 支持多维度筛选、风险分数颜色标识、分页
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useAdminMatrixWarnings } from '#/api/endpoints/api-mc/admin-matrix-warning'
import type { MatrixWarningListItem } from '#/api/types'
import { LoadingPage } from '#/components/public/loading-page'
import { McCard } from '#/components/shared/mc-card'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  
  TableColumnHeader,
  TableProvider,
  TSTableBody,
  TSTableCell,
  TSTableHead,
  TSTableHeader,
  TSTableHeaderGroup,
  TSTableRow
} from '#/components/ui/tanstack-table'
import type {ColumnDef} from '#/components/ui/tanstack-table';
import { formatTime } from '#/lib/format'
import { fadeUpItem, staggerContainer } from '#/lib/motion-presets'

// ─── 常量 ──────────────────────────────────────────────────

const PAGE_SIZE = 20

/** 风险分数 → 颜色映射 */
function riskScoreColor(score: number): string {
  if (score >= 70) return 'text-red-500 font-semibold'
  if (score >= 30) return 'text-yellow-500 font-semibold'
  return 'text-green-500 font-semibold'
}

// ─── Route 定义 ────────────────────────────────────────────

export const Route = createFileRoute('/admin/matrix/warnings/')({
  component: AdminMatrixWarningsPage,
})

// ─── 页面组件 ──────────────────────────────────────────────

function AdminMatrixWarningsPage() {
  const navigate = useNavigate()

  // ── 筛选状态 ──
  const [playerUuid, setPlayerUuid] = useState('')
  const [warningType, setWarningType] = useState('')
  const [riskScoreMin, setRiskScoreMin] = useState('')
  const [riskScoreMax, setRiskScoreMax] = useState('')
  const [serverName, setServerName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [page, setPage] = useState(1)

  // ── 重置筛选 ──
  const resetFilters = () => {
    setPlayerUuid('')
    setWarningType('')
    setRiskScoreMin('')
    setRiskScoreMax('')
    setServerName('')
    setStartTime('')
    setEndTime('')
    setPage(1)
  }

  // ── 数据查询 ──
  const { data, isLoading } = useAdminMatrixWarnings({
    page,
    page_size: PAGE_SIZE,
    player_uuid: playerUuid || undefined,
    warning_type: warningType || undefined,
    risk_score_min: riskScoreMin ? Number(riskScoreMin) : undefined,
    risk_score_max: riskScoreMax ? Number(riskScoreMax) : undefined,
    server_name: serverName || undefined,
    start_time: startTime || undefined,
    end_time: endTime || undefined,
  })

  const list = data?.list ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  // ── 表格列定义 ──
  const columns: ColumnDef<MatrixWarningListItem, unknown>[] = [
    {
      id: 'player_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="玩家名称" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.player_name}</span>
      ),
    },
    {
      accessorKey: 'server_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="服务器" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-[13px]">
          {row.original.server_name}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'warning_type',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="警告类型" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px]">{row.original.warning_type}</span>
      ),
      size: 140,
    },
    {
      accessorKey: 'risk_score',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="风险分数" />
      ),
      cell: ({ row }) => (
        <span
          className={`tabular-nums ${riskScoreColor(row.original.risk_score)}`}
        >
          {row.original.risk_score}
        </span>
      ),
      size: 96,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="描述" />
      ),
      cell: ({ row }) => (
        <span className="max-w-[240px] truncate block text-[13px] text-muted-foreground">
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="创建时间" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground whitespace-nowrap">
          {formatTime(row.original.created_at)}
        </span>
      ),
      size: 160,
    },
  ]

  // ── 筛选变化重置页码 ──
  const onFilterChange =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value)
      setPage(1)
    }

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
          icon={AlertTriangle}
          title="警告管理"
          description="查看和管理 Matrix 反作弊系统产生的所有警告记录"
        >
          <span className="text-xs text-muted-foreground tabular-nums">
            共 {total} 条记录
          </span>
        </McSectionHeader>
      </motion.div>

      {/* 筛选栏 */}
      <motion.div
        variants={fadeUpItem}
        className="flex flex-wrap items-center gap-3"
      >
        {/* 玩家 UUID */}
        <Input
          placeholder="玩家 UUID"
          className="h-9 max-w-[200px]"
          value={playerUuid}
          onChange={onFilterChange(setPlayerUuid)}
        />

        {/* 警告类型 */}
        <Input
          placeholder="警告类型"
          className="h-9 max-w-[160px]"
          value={warningType}
          onChange={onFilterChange(setWarningType)}
        />

        {/* 风险分数范围 */}
        <div className="flex items-center gap-1.5">
          <Input
            placeholder="最低分"
            type="number"
            className="h-9 w-[100px]"
            value={riskScoreMin}
            onChange={onFilterChange(setRiskScoreMin)}
          />
          <span className="text-muted-foreground text-xs">~</span>
          <Input
            placeholder="最高分"
            type="number"
            className="h-9 w-[100px]"
            value={riskScoreMax}
            onChange={onFilterChange(setRiskScoreMax)}
          />
        </div>

        {/* 服务器名称 */}
        <Input
          placeholder="服务器名称"
          className="h-9 max-w-[160px]"
          value={serverName}
          onChange={onFilterChange(setServerName)}
        />

        {/* 时间范围 */}
        <div className="flex items-center gap-1.5">
          <input
            type="datetime-local"
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:ring-[2px] focus-visible:ring-ring focus-visible:ring-offset-2"
            value={startTime}
            onChange={onFilterChange(setStartTime)}
          />
          <span className="text-muted-foreground text-xs">至</span>
          <input
            type="datetime-local"
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:ring-[2px] focus-visible:ring-ring focus-visible:ring-offset-2"
            value={endTime}
            onChange={onFilterChange(setEndTime)}
          />
        </div>

        {/* 查询 & 重置按钮 */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5"
          onClick={resetFilters}
        >
          <RotateCcw className="size-3.5" />
          重置
        </Button>
      </motion.div>

      {/* 数据表格 */}
      <motion.div variants={fadeUpItem}>
        <McCard variant="solid" color="nether" className="overflow-hidden">
          <TableProvider columns={columns} data={list}>
            <TSTableHeader>
              {({ headerGroup }) => (
                <TSTableHeaderGroup headerGroup={headerGroup}>
                  {({ header }) => <TSTableHead header={header} />}
                </TSTableHeaderGroup>
              )}
            </TSTableHeader>
            <TSTableBody
              emptyContent={
                <p className="text-sm text-muted-foreground">暂无警告记录</p>
              }
            >
              {({ row }) => (
                <TSTableRow
                  row={row}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() =>
                    navigate({
                      to: `/admin/matrix/warnings/${row.original.id}`,
                    })
                  }
                >
                  {({ cell }) => <TSTableCell cell={cell} />}
                </TSTableRow>
              )}
            </TSTableBody>
          </TableProvider>
        </McCard>
      </motion.div>

      {/* 分页控制 */}
      {totalPages > 1 && (
        <motion.div
          variants={fadeUpItem}
          className="flex items-center justify-between"
        >
          <span className="text-xs text-muted-foreground">
            第 {page}/{totalPages} 页，共 {total} 条
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              下一页
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
