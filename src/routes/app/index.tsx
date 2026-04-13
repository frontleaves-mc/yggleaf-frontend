/**
 * 用户端首页 - 简洁欢迎页
 *
 * 展示：
 *   - 欢迎信息（用户名 + 服务器名）
 *   - 服务器公告区域
 *   - 快速导航卡片（皮肤库、披风库、游戏档案）
 */

import { authStore } from '#/stores/auth-store'
import { Shirt, Flag, Gamepad2, ArrowRight, Sparkles, ShieldCheck, Server } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'

// ─── 快速导航配置 ───────────────────────────────────────

const quickLinks = [
  {
    key: 'skins',
    title: '皮肤库',
    desc: '浏览和选择你的角色皮肤',
    icon: Shirt,
    to: '/app/skins',
    accent: 'from-primary/10 to-transparent',
  },
  {
    key: 'capes',
    title: '披风库',
    desc: '挑选独一无二的披风',
    icon: Flag,
    to: '/app/capes',
    accent: 'from-chart-4/10 to-transparent',
  },
  {
    key: 'profiles',
    title: '游戏档案',
    desc: '管理你的游戏角色档案',
    icon: Gamepad2,
    to: '/app/profiles',
    accent: 'from-primary/10 to-transparent',
  },
]

// ─── 页面组件 ─────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate()
  const user = authStore.state.user
  const spotlightStats = [
    { label: '资源中心', value: '24/7', icon: Server },
    { label: '认证状态', value: 'Secure', icon: ShieldCheck },
    { label: '体验标签', value: 'Polished', icon: Sparkles },
  ]

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[1.25rem] border border-border/70 p-4.5 sm:p-6 bg-gradient-to-b from-card to-card/95 shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,oklch(from_var(--primary)_l_c_h_/_0.05),transparent_62%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.9fr)] lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/75 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
              <Sparkles className="size-3.5" />
              玩家中心
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-[1.9rem] font-bold tracking-tight text-foreground sm:text-[2.35rem]">
                欢迎回来，{user?.username ?? '冒险者'}。
              </h1>
              <p className="max-w-2xl text-sm leading-6.5 text-muted-foreground">
                这里把皮肤、披风和游戏档案整理成一个更清晰的工作台。
                你可以更快找到资源、同步角色形象，也能一眼看到当前账号状态。
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {spotlightStats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-2 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.45)]">
                  <Icon className="size-4 text-primary" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-sm font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="border border-border/70 bg-card/95 backdrop-blur-[10px] shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)] border-border/60 py-0">
            <CardHeader className="gap-2 border-b border-border/50 py-5">
              <CardTitle className="text-base">服务器公告</CardTitle>
              <CardDescription>一眼看到当前平台状态与使用提醒。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 py-5">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                服务器运行中
              </div>
              <p className="text-sm leading-6.5 text-muted-foreground">
                欢迎来到 Yggleaf。请先确认你的账号已绑定正确角色，这样皮肤与披风的配置才能即时生效。
                如果显示异常，优先检查档案绑定状态，再联系管理员处理。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Quick Access</p>
            <h2 className="text-xl font-semibold text-foreground">从这里开始切换你的资源</h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => navigate({ to: link.to as any })}
              className="transition-[transform,border-color,box-shadow] duration-220 hover:-translate-y-0.5 hover:border-primary/24 hover:shadow-lg hover:shadow-primary/12 border border-border/70 bg-card/95 backdrop-blur-[10px] shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)] group flex flex-col gap-4 rounded-[18px] p-5 text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${link.accent}`}>
                  <link.icon className="size-5 text-primary" />
                </div>
                <ArrowRight className="size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                  {link.title}
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">{link.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
