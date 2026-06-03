/**
 * 管理端 Matrix 警告详情页
 * 展示单条警告的完整信息（基本信息、警告信息、时间、上下文数据）
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import { useAdminMatrixWarningDetail } from '#/api/endpoints/api-mc/admin-matrix-warning'
import { LoadingPage } from '#/components/public/loading-page'
import { McCard } from '#/components/shared/mc-card'
import { McBadge } from '#/components/shared/mc-badge'
import { McIconBox } from '#/components/shared/mc-icon-box'
import {
  ArrowLeft,
  AlertTriangle,
  Shield,
  Clock,
  Database,
  Server,
  User,
  Copy,
  Check,
  Hash,
} from 'lucide-react'
import { motion } from 'motion/react'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { useState } from 'react'
import { toast } from 'sonner'
import { formatTime } from '#/lib/format'

export const Route = createFileRoute('/admin/matrix/warnings/$warningId')({
  component: WarningDetailPage,
})

/** 风险分数 → 徽章变体 */
function riskScoreVariant(score: number): 'nether' | 'gold' | 'grass' {
  if (score >= 70) return 'nether'
  if (score >= 30) return 'gold'
  return 'grass'
}

/** 风险分数 → 中文等级 */
function riskScoreLabel(score: number): string {
  if (score >= 70) return '高风险'
  if (score >= 30) return '中风险'
  return '低风险'
}

function WarningDetailPage() {
  const { warningId } = Route.useParams()
  const { data: warning, isLoading } = useAdminMatrixWarningDetail(
    warningId ?? '',
  )

  if (isLoading) return <LoadingPage />

  if (!warning) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground">
          警告记录不存在
        </p>
        <Link
          to="/admin/matrix/warnings"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          返回警告列表
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:px-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* ── 页面头部 ── */}
      <motion.header
        variants={fadeUpItem}
        className="flex flex-wrap items-center gap-3"
      >
        {/* 返回按钮 */}
        <Link
          to="/admin/matrix/warnings"
          className="group inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-border/60 bg-background/80 text-muted-foreground mc-pixel-shadow-sm transition-colors hover:border-mc-nether/30 hover:text-mc-nether"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>

        {/* 标题区 */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <McBadge variant="nether">
            <McIconBox variant="nether" size="sm" className="mr-0.5">
              <Hash className="h-3 w-3" />
            </McIconBox>
            #{warning.id}
          </McBadge>

          <McBadge variant={riskScoreVariant(warning.risk_score)}>
            <AlertTriangle className="h-3 w-3" />
            {warning.risk_score} 分 · {riskScoreLabel(warning.risk_score)}
          </McBadge>

          <McBadge variant="default">{warning.warning_type}</McBadge>
        </div>

        {/* 右侧元信息 */}
        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground shrink-0">
          <McBadge variant="gold">
            <User className="h-3 w-3" />
            {warning.player_name}
          </McBadge>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(warning.created_at)}
          </span>
        </div>
      </motion.header>

      {/* ── 主内容区 ── */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* 左侧：主要信息 */}
        <motion.div variants={fadeUpItem} className="space-y-4 min-w-0">
          {/* 警告描述卡片 */}
          <McCard variant="solid" color="nether">
            <div className="p-5 pb-4">
              <div className="flex items-center gap-2.5">
                <McIconBox variant="nether" size="md">
                  <AlertTriangle className="h-4 w-4" />
                </McIconBox>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {warning.warning_type}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    警告详情描述
                  </p>
                </div>
              </div>
            </div>
            <div className="px-5 pb-5">
              <p className="text-sm leading-relaxed text-foreground/90">
                {warning.description || (
                  <span className="text-muted-foreground italic">暂无描述</span>
                )}
              </p>
            </div>
          </McCard>

          {/* 上下文数据 */}
          {warning.context_data && warning.context_data.length > 0 && (
            <McCard variant="glass" color="default">
              <div className="p-5 pb-4">
                <div className="flex items-center gap-2.5">
                  <McIconBox variant="diamond" size="sm">
                    <Database className="h-3.5 w-3.5" />
                  </McIconBox>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      上下文数据
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      共 {warning.context_data.length} 条记录
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="flex flex-wrap gap-1.5">
                  {warning.context_data.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-none bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground border border-border/50"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </McCard>
          )}
        </motion.div>

        {/* 右侧：元数据面板 */}
        <motion.aside
          variants={fadeUpItem}
          className="lg:sticky lg:top-6 lg:self-start space-y-4"
        >
          {/* 玩家信息 */}
          <McCard variant="glass" color="default" className="p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              玩家信息
            </h3>
            <div className="space-y-3">
              <MetaRow label="玩家名称" value={warning.player_name} />
              <CopyableRow label="玩家 UUID" value={warning.player_uuid} />
            </div>
          </McCard>

          {/* 服务器信息 */}
          <McCard variant="glass" color="default" className="p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5" />
              服务器信息
            </h3>
            <div className="space-y-3">
              <MetaRow label="服务器名称" value={warning.server_name} />
              <MetaRow
                label="创建时间"
                value={formatTime(warning.created_at)}
              />
            </div>
          </McCard>

          {/* 风险评分 */}
          <McCard
            variant="solid"
            color={riskScoreVariant(warning.risk_score)}
            className="p-4"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              风险评分
            </h3>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-bold tabular-nums ${
                  warning.risk_score >= 70
                    ? 'text-mc-nether'
                    : warning.risk_score >= 30
                      ? 'text-mc-gold'
                      : 'text-mc-grass'
                }`}
              >
                {warning.risk_score}
              </span>
              <span className="text-sm text-muted-foreground">
                / 100 · {riskScoreLabel(warning.risk_score)}
              </span>
            </div>
            {/* 进度条 */}
            <div className="mt-3 h-1.5 w-full rounded-none bg-muted overflow-hidden">
              <div
                className={`h-full rounded-none transition-all duration-500 ${
                  warning.risk_score >= 70
                    ? 'bg-mc-nether'
                    : warning.risk_score >= 30
                      ? 'bg-mc-gold'
                      : 'bg-mc-grass'
                }`}
                style={{ width: `${warning.risk_score}%` }}
              />
            </div>
          </McCard>
        </motion.aside>
      </div>
    </motion.div>
  )
}

/** 元数据行 */
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs font-medium break-all text-right">
        {value || '-'}
      </span>
    </div>
  )
}

/** 可复制行 */
function CopyableRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success('已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('复制失败')
    }
  }

  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <button
        onClick={handleCopy}
        className="group flex items-center gap-1 text-xs font-mono break-all text-right hover:text-primary transition-colors cursor-pointer"
        title="点击复制"
      >
        <span className="truncate max-w-[180px]">{value}</span>
        {copied ? (
          <Check className="h-3 w-3 text-mc-grass shrink-0" />
        ) : (
          <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        )}
      </button>
    </div>
  )
}
