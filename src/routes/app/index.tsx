/**
 * 用户端首页 - 简洁欢迎页
 *
 * 展示：
 *   - 欢迎信息（用户名 + 服务器名）
 *   - 服务器公告区域
 *   - 快速导航卡片（皮肤库、披风库、游戏档案）
 */

import { authStore } from '#/stores/auth-store'
import { Shirt, Flag, Gamepad2, ArrowRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent } from '#/components/ui/card'

// ─── 快速导航配置 ───────────────────────────────────────

const quickLinks = [
  {
    key: 'skins',
    title: '皮肤库',
    desc: '浏览和选择你的角色皮肤',
    icon: Shirt,
    to: '/app/skins',
    accent: 'from-[var(--diamond)]/10 to-transparent',
  },
  {
    key: 'capes',
    title: '披风库',
    desc: '挑选独一无二的披风',
    icon: Flag,
    to: '/app/capes',
    accent: 'from-[var(--gold)]/10 to-transparent',
  },
  {
    key: 'profiles',
    title: '游戏档案',
    desc: '管理你的游戏角色档案',
    icon: Gamepad2,
    to: '/app/profiles',
    accent: 'from-oklch(0.58 0.20 300)/10 to-transparent',
  },
]

// ─── 页面组件 ─────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate()
  const user = authStore.state.user

  return (
    <div className="space-y-8">
      {/* ── 欢迎区域 ── */}
      <section className="relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-[var(--diamond)]/6 via-card to-card p-8 sm:p-10">
        {/* 装饰光晕 */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[var(--diamond)]/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 size-32 rounded-full bg-[var(--gold)]/6 blur-2xl" />

        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground display-title">
            欢迎回来，{user?.username ?? '冒险者'}！
          </h1>
          <p className="mt-2 text-muted-foreground max-w-lg">
            Yggleaf Minecraft 服务器 — 认证中心与资源平台。
            在这里管理你的皮肤、披风和游戏档案。
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--diamond)]/15 bg-[var(--diamond)]/5 px-3 py-1.5 font-medium text-[var(--diamond-deep)]">
            <span className="size-1.5 animate-pulse rounded-full bg-[var(--diamond)]" />
            服务器运行中
          </div>
        </div>
      </section>

      {/* ── 服务器公告 ── */}
      <section>
        <Card className="border-dashed border-border/50">
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-[var(--gold)]" />
              服务器公告
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              欢迎来到 Yggleaf 服务器！请确保你已绑定正确的游戏账号，
              以便正常使用皮肤和披风功能。如有问题请联系管理员。
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── 快速导航卡片 ── */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4">快速开始</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => navigate({ to: link.to as any })}
              className="group card-hover text-left rounded-xl border border-border/50 bg-card p-5 transition-all duration-200 hover:border-[var(--diamond)]/30"
            >
              {/* 图标背景 */}
              <div className={`flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${link.accent} mb-3`}>
                <link.icon className="size-5 text-[var(--diamond-deep)]" />
              </div>

              <h3 className="font-semibold text-foreground group-hover:text-[var(--diamond)] transition-colors">
                {link.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{link.desc}</p>

              <ArrowRight className="mt-3 size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--diamond)]" />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
