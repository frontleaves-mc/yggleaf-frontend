/**
 * 登录页 - OAuth2 SSO 入口
 * 沉浸式左右分屏布局
 * 左侧: 深色品牌展示区（全屏沉浸）
 * 右侧: 登录操作区（简洁聚焦）
 * 移动端: 仅显示右侧
 *
 * 流程:
 *   1. 用户点击「SSO 安全登录」→ window.location.href = 后端 /sso/oauth/login
 *   2. 后端返回 302 → 浏览器跟随重定向到 auth.frontleaves.com
 *   3. SSO 完成认证后回调到前端 /callback?code=xxx&state=xxx
 *   4. /callback 路由负责用授权码换 Token → 跳转管理后台
 */

import { createFileRoute, redirect } from '@tanstack/react-router'
import { getOAuthLoginUrl } from '#/api/endpoints/auth'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'
import { Button } from '#/components/ui/button'
import { ShieldCheck, Shirt, Flag, ExternalLink, Sparkles } from 'lucide-react'
import { RiseTransition } from '#/components/ui/page-transition'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (checkIsAuthenticated()) {
      throw redirect({ to: '/admin/' as any })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const handleSSOLogin = () => {
    window.location.href = getOAuthLoginUrl()
  }

  return (
    <div className="flex min-h-screen">
      {/* ─── 左侧: 品牌沉浸区 ─── */}
      <div className="relative hidden w-[55%] overflow-hidden lg:flex lg:flex-col bg-gradient-to-br from-[oklch(0.15_0.05_220)] via-[oklch(0.12_0.045_215)] to-[oklch(0.08_0.04_230)]">
        {/* 装饰光晕 */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[oklch(0.45_0.12_200)] opacity-[0.08] blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-[10%] h-[350px] w-[350px] rounded-full bg-[oklch(0.55_0.10_75)] opacity-[0.04] blur-[100px]" />

        {/* 内容 */}
        <RiseTransition className="relative z-10 flex flex-1 flex-col justify-center gap-10 px-14 py-12">
          {/* Logo */}
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--diamond)] to-[var(--diamond-deep)] text-xl font-bold text-white shadow-lg shadow-[var(--diamond)]/20"
              style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
            >
              Y
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-2xl font-bold tracking-tight text-white">Yggleaf</span>
              <span className="text-sm text-white/40">Minecraft 资源平台</span>
            </div>
          </div>

          {/* 标题 */}
          <div className="max-w-lg">
            <h1 className="font-display mb-3 text-[2rem] font-bold leading-tight tracking-tight text-white">
              安全登录，<br />继续管理你的<br />游戏资源。
            </h1>
            <p className="text-sm leading-relaxed text-white/45">
              使用统一认证平台完成登录，进入后即可继续管理皮肤、披风和游戏档案。
            </p>
          </div>

          {/* 功能条目 */}
          <div className="grid gap-3 sm:grid-cols-3">
            <FeatureItem icon={<Shirt className="h-4 w-4" />} label="皮肤管理" desc="上传与整理角色形象资源" />
            <FeatureItem icon={<Flag className="h-4 w-4" />} label="披风管理" desc="统一维护披风资源与分发" />
            <FeatureItem icon={<ShieldCheck className="h-4 w-4" />} label="安全认证" desc="OAuth 2.0 + PKCE 登录流程" />
          </div>
        </RiseTransition>

        {/* 底部版权 */}
        <div className="relative z-10 px-14 pb-8 text-xs text-white/20">
          &copy; {new Date().getFullYear()} FrontLeaves &middot; Yggleaf
        </div>
      </div>

      {/* ─── 右侧: 登录操作区 ─── */}
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <RiseTransition className="flex w-full max-w-[400px] flex-col gap-6">
          {/* 移动端 Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--diamond)] to-[var(--diamond-deep)] text-sm font-bold text-white shadow-lg shadow-[var(--diamond)]/15"
              style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
            >
              Y
            </div>
            <span className="text-lg font-bold text-foreground">Yggleaf</span>
          </div>

          {/* 标签 */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Unified SSO
          </div>

          {/* 标题 */}
          <div className="flex flex-col gap-2">
            <h2 className="text-[1.75rem] font-bold tracking-tight text-foreground">欢迎回来</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              通过统一认证平台登录 Yggleaf，继续管理 Minecraft 资源与账号数据。
            </p>
          </div>

          {/* SSO 登录按钮 */}
          <Button
            type="button"
            onClick={handleSSOLogin}
            className="h-12 w-full bg-gradient-to-r from-[var(--diamond)] to-[var(--diamond-deep)] text-[15px] font-semibold text-white shadow-lg shadow-[var(--diamond)]/20 transition-all hover:-translate-y-0.5 hover:opacity-95"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            SSO 安全登录
          </Button>

          {/* 安全说明 */}
          <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">安全认证说明</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  使用 OAuth 2.0 统一认证。密码由 SSO 提供商保管，登录完成后会自动回跳当前应用。
                </p>
              </div>
            </div>
          </div>

          {/* 底部提示 */}
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            还没有账号？请先在 SSO 平台完成注册与授权。
          </p>
        </RiseTransition>
      </div>
    </div>
  )
}

/* ─── 功能条目组件 ─── */

function FeatureItem({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-3.5">
      <div className="flex items-start gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-[oklch(0.70_0.12_200)]"
          style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-white/80">{label}</p>
          <p className="text-xs text-white/35">{desc}</p>
        </div>
      </div>
    </div>
  )
}
