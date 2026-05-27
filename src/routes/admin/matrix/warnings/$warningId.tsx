/**
 * 管理端 Matrix 警告详情页
 * 展示单条警告的完整信息（基本信息、警告信息、时间、上下文数据）
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import { useAdminMatrixWarningDetail } from '#/api/endpoints/api-mc/admin-matrix-warning'
import { LoadingPage } from '#/components/public/loading-page'
import { McCard } from '#/components/shared/mc-card'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { ArrowLeft, AlertTriangle, Shield, Clock, Database } from 'lucide-react'
import { motion } from 'motion/react'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'

export const Route = createFileRoute('/admin/matrix/warnings/$warningId')({
  component: WarningDetailPage,
})

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
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 返回按钮 */}
      <motion.div variants={fadeUpItem}>
        <Link
          to="/admin/matrix/warnings"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回警告列表
        </Link>
      </motion.div>

      {/* 页面标题 */}
      <motion.div variants={fadeUpItem}>
        <McSectionHeader
          title="警告详情"
          subtitle={`ID: ${warning.id}`}
          icon={AlertTriangle}
          variant="nether"
          description="查看 Matrix 反作弊系统警告的完整信息"
        />
      </motion.div>

      {/* 详情卡片组 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 基本信息 */}
        <motion.div variants={fadeUpItem}>
          <McCard variant="solid" color="diamond">
            <div className="p-6 pb-4">
              <McSectionHeader
                title="基本信息"
                icon={Shield}
                variant="diamond"
              />
            </div>
            <div className="px-6 pb-6 space-y-3">
              <InfoRow label="警告 ID" value={warning.id} mono />
              <InfoRow label="玩家名称" value={warning.player_name} />
              <InfoRow label="玩家 UUID" value={warning.player_uuid} mono />
              <InfoRow label="服务器名称" value={warning.server_name} />
            </div>
          </McCard>
        </motion.div>

        {/* 警告信息 */}
        <motion.div variants={fadeUpItem}>
          <McCard variant="solid" color="nether">
            <div className="p-6 pb-4">
              <McSectionHeader
                title="警告信息"
                icon={AlertTriangle}
                variant="nether"
              />
            </div>
            <div className="px-6 pb-6 space-y-3">
              <InfoRow label="警告类型" value={warning.warning_type} />
              <InfoRow
                label="风险分数"
                value={String(warning.risk_score)}
                highlight={
                  warning.risk_score >= 70
                    ? 'destructive'
                    : warning.risk_score >= 30
                      ? 'warning'
                      : 'success'
                }
              />
              <div className="flex items-start justify-between gap-3 pt-1">
                <span className="text-[13px] text-muted-foreground shrink-0">
                  描述
                </span>
                <span className="text-[13px] font-medium break-all max-w-[70%]">
                  {warning.description || '-'}
                </span>
              </div>
            </div>
          </McCard>
        </motion.div>

        {/* 时间信息 */}
        <motion.div variants={fadeUpItem}>
          <McCard variant="glass" color="gold">
            <div className="p-6 pb-4">
              <McSectionHeader title="时间信息" icon={Clock} variant="gold" />
            </div>
            <div className="px-6 pb-6 space-y-3">
              <InfoRow
                label="创建时间"
                value={new Date(warning.created_at).toLocaleString('zh-CN')}
              />
            </div>
          </McCard>
        </motion.div>

        {/* 上下文数据（条件渲染） */}
        {warning.context_data?.length > 0 && (
          <motion.div variants={fadeUpItem}>
            <McCard variant="glass" color="emerald">
              <div className="p-6 pb-4">
                <McSectionHeader
                  title="上下文数据"
                  icon={Database}
                  variant="emerald"
                />
              </div>
              <div className="px-6 pb-6">
                <p className="font-mono text-xs leading-relaxed break-all text-foreground/80">
                  {warning.context_data.join(', ')}
                </p>
              </div>
            </McCard>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

/** 信息行组件 */
function InfoRow({
  label,
  value,
  mono,
  highlight,
}: {
  label: string
  value: string
  mono?: boolean
  highlight?: 'success' | 'warning' | 'destructive'
}) {
  const colorClass =
    highlight === 'destructive'
      ? 'text-red-500 font-bold'
      : highlight === 'warning'
        ? 'text-yellow-500 font-semibold'
        : highlight === 'success'
          ? 'text-emerald-500 font-semibold'
          : ''

  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[13px] text-muted-foreground shrink-0">
        {label}
      </span>
      <span
        className={`text-[13px] break-all ${mono ? 'font-mono text-xs' : 'font-medium'} ${colorClass}`}
      >
        {value}
      </span>
    </div>
  )
}
