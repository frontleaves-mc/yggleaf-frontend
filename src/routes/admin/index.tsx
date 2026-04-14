/**
 * Dashboard 仪表盘
 * 管理后台首页 - 系统概览 + 统计数据 + 快捷操作
 */

import { createFileRoute } from '@tanstack/react-router'
import { useUserInfo } from '#/api/endpoints/user'
import { useSkins } from '#/api/endpoints/skin-library'
import { useCapes } from '#/api/endpoints/cape-library'
import { LoadingPage } from '#/components/public/loading-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
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
  Activity,
  LayoutDashboard,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { PageTransition } from '#/components/ui/page-transition'
import { motion } from 'motion/react'
import { cardHoverVariants, hoverLiftTransition, iconScaleSmallVariants, arrowSlideSmallVariants, childMotionTransition } from '#/lib/motion-presets'

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
    <PageTransition className="flex flex-col gap-6">
      <section className="rounded-[1.25rem] border border-border/70 p-4.5 sm:p-6 bg-gradient-to-b from-card to-card/95 shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,oklch(from_var(--primary)_l_c_h_/_0.05),transparent_62%)]" />
        <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.95fr)]">
          <div className="flex flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-background/75 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
              <LayoutDashboard className="size-3.5" />
              Admin Overview
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-[1.9rem] font-bold tracking-tight text-foreground sm:text-[2.35rem]">
                欢迎回来，{user?.username ?? '管理员'}
              </h1>
              <p className="max-w-2xl text-sm leading-6.5 text-muted-foreground">
                这里集中展示当前系统概况与常用入口，方便你继续处理皮肤、披风和账号相关工作。
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-2 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.45)]">
                <Shirt className="size-4 text-primary" />
                <span className="text-xs text-muted-foreground">皮肤资源</span>
                <span className="text-sm font-semibold text-foreground">{skinCount}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-2 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.45)]">
                <Flag className="size-4 text-primary" />
                <span className="text-xs text-muted-foreground">披风资源</span>
                <span className="text-sm font-semibold text-foreground">{capeCount}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-2 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.45)]">
                <Activity className="size-4 text-primary" />
                <span className="text-xs text-muted-foreground">系统状态</span>
                <span className="text-sm font-semibold text-foreground">Healthy</span>
              </div>
            </div>
          </div>

          <Card className="border border-border/70 bg-card/95 backdrop-blur-[10px] shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)] border-border/60 py-0">
            <CardHeader className="border-b border-border/50 py-5">
              <CardTitle className="text-base">今日焦点</CardTitle>
              <CardDescription>后台运维与资源管理的简要提示。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 py-5">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                系统运行正常
              </div>
              <p className="text-sm leading-6.5 text-muted-foreground">
                当前后台状态稳定。若后续继续细化界面，建议优先统一列表页、详情页和表单页的间距节奏。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            transition={hoverLiftTransition}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      皮肤库
                    </p>
                    <p className="text-2xl font-bold tracking-tight tabular-nums">
                      {skinsLoading ? '...' : skinCount}
                    </p>
                    <p className="text-xs text-muted-foreground">总资源数</p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Shirt className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            transition={hoverLiftTransition}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      披风库
                    </p>
                    <p className="text-2xl font-bold tracking-tight tabular-nums">
                      {capesLoading ? '...' : capeCount}
                    </p>
                    <p className="text-xs text-muted-foreground">总资源数</p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Flag className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            transition={hoverLiftTransition}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      游戏档案
                    </p>
                    <p className="text-2xl font-bold tracking-tight tabular-nums">
                      --
                    </p>
                    <p className="text-xs text-muted-foreground">活跃档案</p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Gamepad2 className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            transition={hoverLiftTransition}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      用户总数
                    </p>
                    <p className="text-2xl font-bold tracking-tight tabular-nums">
                      --
                    </p>
                    <p className="text-xs text-muted-foreground">已注册用户</p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Operations</p>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              快捷操作
            </h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction
            title="皮肤库管理"
            description="浏览、上传、编辑皮肤资源"
            icon={Palette}
            to="/admin/skins/"
            accent="from-primary/10 to-primary/4"
          />
          <QuickAction
            title="披风库管理"
            description="浏览、上传、编辑披风资源"
            icon={Shield}
            to="/admin/capes/"
            accent="from-primary/10 to-primary/4"
          />
          <QuickAction
            title="个人设置"
            description="修改密码、账户信息"
            icon={Settings}
            to="/admin/profile/"
            accent="from-chart-4/12 to-chart-4/4"
          />
        </div>
      </section>

      <section>
        <Card className="border border-border/70 bg-card/95 backdrop-blur-[10px] shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)] border-dashed border-border/50 py-0">
          <CardHeader className="py-6">
            <CardTitle className="text-base">动态概览</CardTitle>
            <CardDescription>这里预留给后续的活动日志、审计记录与系统监控。</CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <div className="rounded-2xl border border-dashed border-border/50 bg-background/55 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                详细的活动日志和系统监控功能正在开发中。
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageTransition>
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
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      transition={hoverLiftTransition}
      className="cursor-pointer"
    >
      <Link
        to={to as any}
        className="border border-border/70 bg-card/95 backdrop-blur-[10px] shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)] hover:border-primary/24 group flex items-start gap-4 rounded-[18px] p-4.5"
      >
        <motion.div
          variants={iconScaleSmallVariants}
          transition={childMotionTransition}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${accent}`}
        >
          <Icon className="h-5 w-5 text-primary" />
        </motion.div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <motion.span
              variants={arrowSlideSmallVariants}
              transition={childMotionTransition}
            >
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
            </motion.span>
          </div>
          <p className="text-[13px] leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </Link>
    </motion.div>
  )
}
