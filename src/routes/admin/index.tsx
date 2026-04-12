/**
 * Dashboard 仪表盘
 * 管理后台首页 - 系统概览 + 统计数据 + 快捷操作
 */

import { createFileRoute } from '@tanstack/react-router'
import { useUserInfo } from '#/api/endpoints/user'
import { useSkins } from '#/api/endpoints/skin-library'
import { useCapes } from '#/api/endpoints/cape-library'
import { StatCard } from '#/components/admin/shared/StatCard'
import { LoadingPage } from '#/components/admin/shared/LoadingPage'
import {
  Users,
  Gamepad2,
  Shirt,
  Flag,
  ArrowRight,
  Palette,
  Shield,
  Settings,
  TrendingUp,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: user, isLoading: userLoading } = useUserInfo()
  const { data: skins, isLoading: skinsLoading } = useSkins()
  const { data: capes, isLoading: capesLoading } = useCapes()

  // 全局加载状态
  if (userLoading) return <LoadingPage />

  const skinCount = skins?.length ?? 0
  const capeCount = capes?.length ?? 0

  return (
    <div className="admin-page-enter space-y-8">
      {/* 欢迎区域 */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)]/30 bg-gradient-to-br from-[var(--lagoon)]/6 via-[var(--card)] to-[var(--card)] p-6 sm:p-8">
        {/* 背景装饰 */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--lagoon)]/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-[var(--lagoon-deep)]/6 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">
              欢迎回来，{user?.username ?? '管理员'}
            </h1>
            <p className="text-[14px] text-[var(--muted-foreground)]">
              管理你的 Minecraft 皮肤、披风与游戏档案资源。
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lagoon)]/15 bg-[var(--lagoon)]/5 px-3 py-1.5 font-medium text-[var(--lagoon-deep)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--lagoon)]" />
              系统运行正常
            </span>
          </div>
        </div>
      </section>

      {/* 统计卡片 */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="皮肤库"
            value={skinsLoading ? '...' : skinCount}
            icon={Shirt}
            trend={skinCount > 0 ? 'up' : 'neutral'}
            trendValue={skinCount > 0 ? `${skinCount} 个资源` : undefined}
            description="总资源数"
          />
          <StatCard
            title="披风库"
            value={capesLoading ? '...' : capeCount}
            icon={Flag}
            trend={capeCount > 0 ? 'up' : 'neutral'}
            trendValue={capeCount > 0 ? `${capeCount} 个资源` : undefined}
            description="总资源数"
          />
          <StatCard
            title="游戏档案"
            value="--"
            icon={Gamepad2}
            trend="neutral"
            description="活跃档案"
          />
          <StatCard
            title="用户总数"
            value="--"
            icon={Users}
            trend="neutral"
            description="已注册用户"
          />
        </div>
      </section>

      {/* 快捷操作 */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--foreground)]">
          <TrendingUp className="h-4 w-4 text-[var(--lagoon)]" />
          快捷操作
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction
            title="皮肤库管理"
            description="浏览、上传、编辑皮肤资源"
            icon={Palette}
            to="/admin/skins/"
            accent="from-[var(--lagoon)]/10 to-[var(--lagoon)]/4"
          />
          <QuickAction
            title="披风库管理"
            description="浏览、上传、编辑披风资源"
            icon={Shield}
            to="/admin/capes/"
            accent="from-[var(--lagoon-deep)]/10 to-[var(--lagoon-deep)]/4"
          />
          <QuickAction
            title="个人设置"
            description="修改密码、账户信息"
            icon={Settings}
            to="/admin/profile/"
            accent="from-[var(--palm)]/10 to-[var(--palm)]/4"
          />
        </div>
      </section>

      {/* 最近活动（占位） */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-[var(--foreground)]">
          动态概览
        </h2>
        <div className="rounded-xl border border-dashed border-[var(--border)]/40 p-8 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            详细的活动日志和系统监控功能正在开发中...
          </p>
        </div>
      </section>
    </div>
  )
}

/** 快捷操作卡片 */
function QuickAction({
  title,
  description,
  icon: Icon,
  to,
  accent,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  to: string
  accent: string
}) {
  return (
    <Link
      to={to as any}
      className="group flex items-start gap-4 rounded-xl border border-[var(--border)]/50 bg-[var(--card)] p-5 transition-all duration-200 hover:border-[var(--lagoon)]/30 hover:shadow-md hover:shadow-[var(--lagoon)]/5"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${accent} transition-transform duration-200 group-hover:scale-105`}
      >
        <Icon className="h-5 w-5 text-[var(--lagoon-deep)]" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]/40 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--lagoon)]" />
        </div>
        <p className="text-[13px] leading-relaxed text-[var(--muted-foreground)]">{description}</p>
      </div>
    </Link>
  )
}
